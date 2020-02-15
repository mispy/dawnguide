
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')

import Router from './router'
import { signup, login, SessionRequest, logout, getSession, resetPassword } from './authentication'
import { IS_PRODUCTION, WEBPACK_DEV_SERVER } from './settings'
import { redirect, getQueryParams, JsonResponse } from './utils'
import api = require('./api')

// Workers require that this be a sync callback
addEventListener('fetch', event => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent) {
    const r = new Router()
    r.get('/(signup|login|reset-password|assets/.*)', () => serveStatic(event))
    r.get('/', () => rootPage(event))
    r.post('/signup', signup)
    r.post('/login', login)
    r.post('/reset-password', resetPassword)
    // r.post('/webhook/checkout', fulfillCheckout) // From Stripe
    r.get('/logout', logout)
    r.all('.*', () => behindLogin(event))

    const req = event.request
    try {
        return await r.route(req)
    } catch (e) {
        let message = e.stack
        if (!message) {
            message = e.message || e.toString()
        }
        return new Response(message, { status: 500 })
    }
}

async function rootPage(event: FetchEvent) {
    const session = await getSession(event.request)

    if (session) {
        // Root url redirects to app if logged in
        return redirect('/home')
    } else {
        return serveStatic(event)
    }
}

async function behindLogin(event: FetchEvent) {
    // Routes in here require login

    const req = event.request
    const session = await getSession(req)

    if (!session) {
        return redirect('/login')
    }

    const r = new Router()
    r.all('/api/.*', api.processRequest)
    r.get('.*', () => serveStatic(event))

    const sessionReq = req as SessionRequest
    sessionReq.session = session
    const url = new URL(sessionReq.url)
    sessionReq.params = getQueryParams(url.search)
    return await r.route(sessionReq)
}

async function serveStatic(event: FetchEvent) {
    const url = new URL(event.request.url)

    // Transform path for pretty urls etc
    let pathname = url.pathname
    if (pathname == '/') {
        pathname = '/landing.html'
    } else if (pathname == "/login" || pathname == "/signup" || pathname == "/reset-password") {
        pathname = pathname + '.html'
    } else if (!pathname.includes(".")) {
        pathname = "/index.html"
    }

    if (IS_PRODUCTION) {
        // Serve asset from Cloudflare KV storage
        return await serveStaticLive(event, pathname)
    } else {
        // Proxy through to webpack dev server to serve asset
        return await fetch(`${WEBPACK_DEV_SERVER}${pathname}`)
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