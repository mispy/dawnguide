
// declare const require: any
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')

import Router from './router'
import { signup, login, SessionRequest, logout, getSession } from './authentication'
import { IS_PRODUCTION } from './settings'
import { redirect } from './utils'

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
    r.get('.*', () => requireLogin(event))

    const req = event.request
    try {
        return await r.route(req)
    } catch (e) {
        return new Response(e.message || e.toString(), { status: 500 })
    }
}

async function rootPage(event: FetchEvent) {
    const session = await getSession(event.request)

    if (session) {
        return redirect('/home')
    } else {
        return serveStatic(event)
    }
}

async function requireLogin(event: FetchEvent) {
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
    const pathname = transformStaticPath(url.pathname)
    if (IS_PRODUCTION) {
        return await serveStaticLive(event, pathname)
    } else {
        return await fetch(`http://localhost:8020${pathname}`)
    }
}

function transformStaticPath(pathname: string): string {
    if (pathname == '/') {
        pathname = '/landing.html'
    } else if (pathname == "/login" || pathname == "/signup") {
        pathname = pathname + '.html'
    } else if (!pathname.includes(".")) {
        pathname = "/index.html"
    }
    return pathname
}

const DEBUG = false

async function serveStaticLive(event: FetchEvent, pathname: string) {
    const mapRequestToAsset = (req: Request) => {
        const url = new URL(req.url)
        url.pathname = pathname
        return new Request(url.toString(), req as RequestInit)
    }

    const options: any = {
        mapRequestToAsset: mapRequestToAsset
    }
    try {
        if (DEBUG) {
            // customize caching
            options.cacheControl = {
                bypassCache: true,
            }
        }


        return await getAssetFromKV(event, options)
    } catch (e) {
        // if an error is thrown try to serve the asset at 404.html
        if (!DEBUG) {
            try {
                let notFoundResponse = await getAssetFromKV(event, {
                    mapRequestToAsset: (req: Request) => new Request(`${new URL(req.url).origin}/404.html`, req as RequestInit),
                })

                return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
            } catch (e) { }
        }

        return new Response(e.message || e.toString(), { status: 500 })
    }
}

// async function handleEvent(event: FetchEvent) {
// //   const url = new URL(event.request.url)

//   let options: any = {}

//   /**
//    * You can add custom logic to how we fetch your assets
//    * by configuring the function `mapRequestToAsset`
//    */
//   // options.mapRequestToAsset = handlePrefix(/^\/docs/)



//   try {
//     if (DEBUG) {
//       // customize caching
//       options.cacheControl = {
//         bypassCache: true,
//       }
//     }


//     return await getAssetFromKV(event, options)
//   } catch (e) {
//     // if an error is thrown try to serve the asset at 404.html
//     if (!DEBUG) {
//       try {
//         let notFoundResponse = await getAssetFromKV(event, {
//           mapRequestToAsset: (req: Request) => new Request(`${new URL(req.url).origin}/404.html`, req as RequestInit),
//         })

//         return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
//       } catch (e) {}
//     }

//     return new Response(e.message || e.toString(), { status: 500 })
//   }
// }

// // /**
// //  * Here's one example of how to modify a request to
// //  * remove a specific prefix, in this case `/docs` from
// //  * the url. This can be useful if you are deploying to a
// //  * route on a zone, or if you only want your static content
// //  * to exist at a specific path.
// //  */
// // function handlePrefix(prefix: string) {
// //   return (request: Request) => {
// //     // compute the default (e.g. / -> index.html)
// //     let defaultAssetKey = mapRequestToAsset(request)
// //     let url = new URL(defaultAssetKey.url)

// //     // strip the prefix from the path for lookup
// //     url.pathname = url.pathname.replace(prefix, '/')

// //     // inherit all other props from the default request
// //     return new Request(url.toString(), defaultAssetKey)
// //   }
// // }


// addEventListener('fetch', event => {
//   try {
//     event.respondWith(handleEvent(event))
//   } catch (e) {
//     // if (DEBUG) {
//       return event.respondWith(
//         new Response(e.message || e.toString(), {
//           status: 500,
//         }),
//       )
//     // }
//     // event.respondWith(new Response('Internal Error', { status: 500 }))
//   }
// })
