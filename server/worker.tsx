// @ts-ignore
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')

import Router from './router'
import { signup, login, SessionRequest, logout, getSession, resetPasswordStart, resetPasswordFinish, emailConfirmFinish } from './authentication'
import { IS_PRODUCTION, WEBPACK_DEV_SERVER } from './settings'
import { redirect, getQueryParams, JsonResponse, EventRequest } from './utils'
import api = require('./api')
import _ = require('lodash')
import { signupPage } from './SignupPage'
import { loginPage } from './LoginPage'
import { landingPage } from './LandingPage'
import { resetPasswordPage } from './ResetPasswordPage'
import { resetPasswordFinalizePage } from './ResetPasswordFinalizePage'
import { publicConceptPage } from './ConceptPage'
import { appPage } from './AppPage'

// Workers require that this be a sync callback
addEventListener('fetch', event => {
    // Annotate request with some useful info by default
    const url = new URL(event.request.url)
    const req = {
        event: event,
        headers: event.request.headers,
        method: event.request.method,
        url: url,
        path: url.pathname,
        params: getQueryParams(url.search)
    } as EventRequest
    event.respondWith(processRequest(req))
})

async function processRequest(req: EventRequest) {
    const r = new Router<EventRequest>()
    r.get('/(assets/.*)|.*\\.js|.*\\.css|.*\\.jpg|.*\\.png|.*\\.ico|.*\\.svg|.*\\.webmanifest|.*\\.json|.*\\.txt', serveStatic)
    r.get('/login', loginPage)
    r.get('/signup', signupPage)
    r.get('/reset-password', resetPasswordPage)
    r.get('/', rootPage)
    r.get('/reset-password/(.*)', resetPasswordFinalizePage)
    r.post('/reset-password/(.*)', resetPasswordFinish)
    r.post('/signup', signup)
    r.post('/login', login)
    r.post('/reset-password', resetPasswordStart)
    r.get('/account/confirmation/(.*)', emailConfirmFinish)
    // r.post('/webhook/checkout', fulfillCheckout) // From Stripe
    r.get('/logout', logout)
    r.get('/concept/([^/]+)', conceptPage)
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
        let message = e.stack
        if (!message) {
            message = e.message || e.toString()
        }
        return new Response(message, { status: 500 })
    }
}

async function rootPage(req: EventRequest) {
    const session = await getSession(req)

    if (session) {
        // Root url redirects to app if logged in
        return redirect('/home')
    } else {
        return landingPage()
    }
}

async function conceptPage(req: EventRequest, conceptId: string) {
    const session = await getSession(req)

    if (session) {
        const sessionReq = Object.assign({}, req, { session: session }) as SessionRequest
        return appPage(sessionReq)
    } else {
        return publicConceptPage(req, conceptId)
    }
}

async function behindLogin(req: EventRequest) {
    // Routes in here require login

    const session = await getSession(req)

    if (!session) {
        return redirect('/login')
    }

    const r = new Router<SessionRequest>()
    r.all('/api/.*', api.processRequest)
    r.get('/', appPage)
    r.get('/home', appPage)
    r.get('/review', appPage)
    r.get('/lesson', appPage)
    r.get('/settings', appPage)
    r.get('/admin', appPage)

    const sessionReq = Object.assign({}, req, { session: session }) as SessionRequest
    return await r.route(sessionReq)
}

async function serveStatic(req: EventRequest) {
    // Transform path for pretty urls etc
    if (IS_PRODUCTION) {
        // Serve asset from Cloudflare KV storage
        return await serveStaticLive(req.event, req.path)
    } else {
        // Proxy through to webpack dev server to serve asset
        return await fetch(`${WEBPACK_DEV_SERVER}${req.path}`)
    }
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