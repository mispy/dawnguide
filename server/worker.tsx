// @ts-ignore
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')

import Router from './router'
import * as auth from './authController'
import * as site from './siteController'
import * as system from './systemController'
import * as payments from './paymentsController'
import { IS_PRODUCTION, ASSET_DEV_SERVER, SENTRY_KEY, STRIPE_WEBHOOK_SECRET, BUILD_ID } from './settings'
import { redirect, JsonResponse } from './utils'
import api = require('./api')
import * as _ from 'lodash'
import { logToSentry } from './sentry'
import { EventRequest, SessionRequest } from './requests'
import conceptDefs from '../concepts'

// Workers require that this be a sync callback
addEventListener('fetch', event => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent) {
    // Performing some conversion/annotation of the event here
    const req = await EventRequest.from(event)
    return maybeCached(req)
}

declare const caches: {
    default: Cache
}

async function maybeCached(req: EventRequest): Promise<Response> {
    // Cloudflare Workers replaces the normal Cloudflare CDN behavior, so
    // we implement our caching logic here.
    // Things are not cached by default if logged in, are if logged out.
    const cacheable = req.session
        ? req.method === 'GET' && req.path.match(new RegExp("^/assets/"))
        : req.method === 'GET' && !req.path.match(new RegExp("^/heartbeat$"))
    const cache = caches.default

    if (cacheable) {
        const cachedResponse = await cache.match(req.event.request)
        if (cachedResponse && cachedResponse.headers.get("Dawnguide-Build-Id") === BUILD_ID) {
            return cachedResponse
        }
    }

    let res = await processRequest(req)

    if (cacheable && res.status === 200) {
        console.log(req.path, res.headers.get('Cache-Control'))
        res = new Response(res.body, { headers: res.headers, status: res.status })
        res.headers.set('Dawnguide-Build-Id', BUILD_ID)
        if (!res.headers.get('Cache-Control')) {
            res.headers.set('Cache-Control', 'max-age=0, s-maxage=365000000')
        }
        req.event.waitUntil(cache.put(req.event.request, res.clone()))
    }

    return res
}

async function processRequest(req: EventRequest): Promise<Response> {
    // Handle sneaky trailing slashes
    if (req.path.endsWith('/') && req.path !== "/") {
        return redirect(_.trimEnd(req.path, '/'), 301)
    }

    const r = new Router<EventRequest>()
    r.get('/(assets/.*)|.*\\.js|.*\\.css|.*\\.jpg|.*\\.png|.*\\.ico|.*\\.svg|.*\\.webmanifest|.*\\.json|.*\\.txt', serveStatic)
    r.get('/login', auth.loginPage)
    r.post('/login', auth.submitLogin)
    r.get('/signup', auth.signupPage)
    r.post('/signup', auth.submitSignup)
    r.get('/reset-password', auth.resetPasswordPage)
    r.post('/reset-password', auth.submitResetPassword)
    r.get('/reset-password/:token', auth.resetPasswordConfirmPage)
    r.post('/reset-password/:token', auth.submitResetPasswordConfirm)
    r.get('/account/confirmation/:token', auth.emailConfirmSuccess)
    r.get('/logout', auth.logout)
    r.get('/export/:secret', system.databaseExport)
    r.post(`/stripe/webhook/${STRIPE_WEBHOOK_SECRET}`, payments.stripeWebhook)

    r.get('/heartbeat', system.heartbeat)
    // r.post('/webhook/checkout', fulfillCheckout) // From Stripe

    // These pages are server-rendered only if user isn't logged in
    if (!req.session) {
        r.get('/', site.frontPage)
        for (const concept of conceptDefs) {
            r.get(`/${concept.id}`, (req) => site.conceptPage(req, concept.id))
        }
    }

    r.all('.*', behindLogin)

    try {
        const res = await r.route(req)
        if (res instanceof Response)
            return res
        else if (typeof res === "string")
            return new Response(res)
        else if (typeof res === "object")
            return new JsonResponse(res)
        else
            return new Response()
    } catch (e) {
        const status = e.status || 500

        if (SENTRY_KEY && status >= 500) {
            await logToSentry(e, req)
        }

        let message = e.stack
        if (!message) {
            message = e.message || e.toString()
        }
        return new Response(message, { status: status })
    }
}

async function behindLogin(req: EventRequest) {
    // Routes in here require login

    if (!req.session) {
        if (req.params.emailToken) {
            const sessionKey = await auth.tryTokenLogin(req.params.emailToken)
            if (sessionKey) {
                const res = redirect(req.url.pathname)
                res.headers.set('Set-Cookie', auth.sessionCookie(sessionKey))
                return res
            } else {
                return redirect(`/login?then=${encodeURIComponent(req.url.pathname)}`)
            }
        } else {
            return redirect(`/login?then=${encodeURIComponent(req.url.pathname)}`)
        }
    }

    const r = new Router<SessionRequest>()
    r.all('/api/.*', api.processRequest)
    r.get('/', site.appPage)
    r.get('/home', site.appPage)
    r.get('/review/:conceptId', site.appPage)
    r.get('/review', site.appPage)
    r.get('/lesson', site.appPage)
    r.get('/settings', site.appPage)
    r.get('/account', site.appPage)
    r.get('/notifications', site.appPage)
    r.get('/subscription', site.appPage)
    r.get('/contact', site.appPage)
    r.get('/admin', site.appPage)
    r.get('/admin/emails', site.appPage)

    for (const concept of conceptDefs) {
        r.get(`/${concept.id}`, site.appPage)
    }

    return await r.route(req as SessionRequest)
}

async function serveStatic(req: EventRequest) {
    let res: Response
    // Transform path for pretty urls etc
    if (IS_PRODUCTION) {
        // Serve asset from Cloudflare KV storage
        res = await serveStaticLive(req.event, req.path)
    } else {
        // Proxy through to webpack dev server to serve asset
        res = await fetch(`${ASSET_DEV_SERVER}${req.path}`)
    }

    // Files in /assets are treated as immutable and version stamped
    if (IS_PRODUCTION && req.path.split("/").includes("assets") && res.status === 200) {
        res = new Response(res.body, { headers: res.headers, status: res.status })
        res.headers.set('Cache-Control', 'max-age=365000000, immutable')
    }
    return res
}

async function serveStaticLive(event: FetchEvent, pathname: string) {
    const mapRequestToAsset = (req: Request) => {
        const url = new URL(req.url)
        url.pathname = pathname
        return new Request(url.toString(), req as RequestInit)
    }

    const options: any = {
        // cacheControl: {
        //     bypassCache: true
        // },
        mapRequestToAsset: mapRequestToAsset
    }

    return await getAssetFromKV(event, options)
}

// const stripe = require('stripe')('sk_test_9wcL4jDcQIs3Dm6PRSulNtLS');

// async function fulfillCheckout() {
//     const sig = request.headers['stripe-signature'];

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//         return response.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the checkout.session.completed event
//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;

//         // Fulfill the purchase...
//         handleCheckoutSession(session);
//     }

//     // Return a response to acknowledge receipt of the event
//     return new JsonResponse({ received: true })
// }