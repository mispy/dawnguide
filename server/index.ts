
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')

import Router from './router'
import { signup, login, SessionRequest, logout, getSession } from './authentication'
import { IS_PRODUCTION, WEBPACK_DEV_SERVER } from './settings'
import { redirect } from './utils'

// Workers require that this be a sync callback
addEventListener('fetch', event => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent) {
    const r = new Router()
    r.get('/(signup|login|assets/.*)', () => serveStatic(event))
    r.get('/', () => rootPage(event))
    r.post('/signup', signup)
    r.post('/login', login)
    r.get('/logout', logout)
    r.get('.*', () => behindLogin(event))

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
    r.get('.*', () => serveStatic(event))

    const sessionReq = req as SessionRequest
    sessionReq.session = session
    return r.route(sessionReq)
}

async function serveStatic(event: FetchEvent) {
    const url = new URL(event.request.url)

    // Transform path for pretty urls etc
    let pathname = url.pathname
    if (pathname == '/') {
        pathname = '/landing.html'
    } else if (pathname == "/login" || pathname == "/signup") {
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