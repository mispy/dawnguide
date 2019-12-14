
// declare const require: any
const { getAssetFromKV } = require('@cloudflare/kv-asset-handler')
import cookie = require('cookie')

import Router from './router'
import { signup, login, SessionRequest, logout } from './authentication'
import db = require('./db')

addEventListener('fetch', event => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent) {
    const r = new Router()
    r.post('/signup', signup)
    r.post('/login', login)
    r.get('/logout', logout)
    r.get('.*', () => serveStatic(event))

    const req = event.request
    const cookies = cookie.parse(req.headers.get('cookie') || '')
    console.log("cookies", cookies)

    const sessionKey = cookies['sessionKey']
    const session = await db.sessions.get(sessionKey)

    if (session) {
        return r.route(new SessionRequest(req, session))
    } else {
        return r.route(req)
    }
}

const DEVELOPMENT = !(global as any).__STATIC_CONTENT

async function serveStatic(event: FetchEvent) {
    // (global as any).__STATIC_CONTENT = "waffles"
    const url = new URL(event.request.url)
    if (DEVELOPMENT) {
        let pathname = url.pathname
        console.log(pathname)
        if (pathname == '/') {
            pathname = '/index.html'
        } else if (!pathname.includes('.')) {
            pathname = pathname + '.html'
        }
        const response = await fetch(`http://localhost:8020${pathname}`)
        return response
    } else {
        return serveStaticLive(event)
    }
}

const DEBUG = false

function mapRequestToAsset(req: Request) {
    const url = new URL(req.url)

    if (url.pathname.endsWith('/')) {
        // If path looks like a directory append index.html
        // e.g. If path is /about/ -> /about/index.html
        url.pathname += "index.html"
    } else if (!url.pathname.includes('.')) {
        // Map pretty urls e.g. /signup => /signup.html
        url.pathname += ".html"
    }

    return new Request(url.toString(), req as RequestInit)
}

async function serveStaticLive(event: FetchEvent) {
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
