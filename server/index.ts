
// declare const require: any
// const { getAssetFromKV, mapRequestToAsset } = require('@cloudflare/kv-asset-handler')
import bcrypt = require('bcryptjs')
import cookie = require('cookie')
import uuidv4 = require('uuid/v4')
import Router from './router'

interface KVStore {
    get(key: string): Promise<string>
    put(key: string, value: string): Promise<void>
}

interface User {
    username: string
    email: string
    password: string
}

declare const STORE: KVStore

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
// const DEBUG = false

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function signup(req: Request) {
    const { username, email, password } = JSON.parse(await readRequestBody(req))
    const crypted = await bcrypt.hash(password, 12)

    const id = uuidv4()
    STORE.put(`users:${id}`, JSON.stringify({ id, username, email, password: crypted }))
    STORE.put(`user_id_by_email:${email}`, id)

    const res = new Response("Signed up! " + id)

    const sessionId = uuidv4()

    res.headers.set('Set-Cookie', cookie.serialize('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    }))

    return res
}

async function login(req: Request) {
    const { email, password } = JSON.parse(await readRequestBody(req))

    const sessionId = await expectLogin(email, password)

    const res = new Response("Logged in! " + sessionId)

    return res
}

async function handleRequest(req: Request) {
    const r = new Router()
    r.post('/signup', signup)
    r.post('/login', login)
    r.get('.*', () => serveStatic(req))

    const cookies = cookie.parse(req.headers.get('cookie') || '')
    console.log("cookies", cookies)

    const sessionid = cookies['sessionid']
    if (sessionid) {
        // TODO expire old sessions
        const sessionJson = await STORE.get(`sessions:${sessionid}`)
        console.log("sessionJson", sessionJson)
        if (sessionJson) {
            const session = JSON.parse(sessionJson)
            console.log("session", session)
        }
    }

    const resp = await r.route(req)
    return resp
}

async function serveStatic(req: Request) {
    const url = new URL(req.url)
    let pathname = url.pathname
    console.log(pathname)
    if (pathname == '/') {
        pathname = '/index.html'
    } else if (!pathname.includes('.')) {
        pathname = pathname + '.html'
    }
    const response = await fetch(`http://localhost:8020${pathname}`)
    return response
}

	
async function readRequestBody(request: Request) {
    const { headers } = request
    const contentType = headers.get('content-type')
    if (!contentType) {
        throw new Error("No content type")
    }
    if (contentType.includes('application/json')) {
      const body = await request.json()
      return JSON.stringify(body)
    } else if (contentType.includes('application/text')) {
      const body = await request.text()
      return body
    } else if (contentType.includes('text/html')) {
      const body = await request.text()
      return body
    } else if (contentType.includes('form')) {
      const formData = await request.formData()
      let body: {[key: string]: string} = {}
      for (let entry of (formData as any).entries()) {
        body[entry[0]] = entry[1]
      }
      return JSON.stringify(body)
    } else {
      let myBlob = await request.blob()
      var objectURL = URL.createObjectURL(myBlob)
      return objectURL
    }
}

async function expectLogin(email: string, password: string): Promise<string> {
    const userId = STORE.get(`user_id_by_email:${email}`)
    if (!userId) {
        throw new Error("No such user")
    }
    const user = JSON.parse(await STORE.get(`users:${userId}`)) as User

    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
        // Login successful

        const sessionId = uuidv4() // XXX maybe make longer
        // TODO session expiry
        return sessionId
    } else {
        throw new Error("Invalid password")
    }
}

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

// async function handleEvent(event: FetchEvent) {
// //   const url = new URL(event.request.url)
//   const req = event.request
//   console.log(req.url)
//   const { data } = await axios.get(req.url.replace("3000", "8020"))
//   return new Response("foo", { status: 200 })

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