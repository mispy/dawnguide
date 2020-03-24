// CLOUDFLARE EXAMPLE CODE

import { SessionRequest } from "./authentication"
import { Json } from "./utils"

/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const Method = (method: string) => (req: Request) =>
    req.method.toLowerCase() === method.toLowerCase()
const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

const Header = (header: string, val: string) => (req: Request) => req.headers.get(header) === val
const Host = (host: string) => Header('host', host.toLowerCase())
const Referrer = (host: string) => Header('referrer', host.toLowerCase())

const Path = (regExp: string) => (req: Request) => {
    const url = new URL(req.url)
    const path = url.pathname
    const match = path.match(regExp) || []
    return match[0] === path
}

type Responselike = Response | Json | string | void
type RouteHandler<T> = (req: T) => Responselike | Promise<Responselike>

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router<T> {

    routes: {
        conditions: Function | Function[]
        handler: RouteHandler<T>
    }[]
    constructor() {
        this.routes = []
    }

    handle(conditions: Function | Function[], handler: RouteHandler<T>) {
        this.routes.push({
            conditions,
            handler,
        })
        return this
    }

    connect(url: string, handler: RouteHandler<T>) {
        return this.handle([Connect, Path(url)], handler)
    }

    delete(url: string, handler: RouteHandler<T>) {
        return this.handle([Delete, Path(url)], handler)
    }

    get(url: string, handler: RouteHandler<T>) {
        return this.handle([Get, Path(url)], handler)
    }

    head(url: string, handler: RouteHandler<T>) {
        return this.handle([Head, Path(url)], handler)
    }

    options(url: string, handler: RouteHandler<T>) {
        return this.handle([Options, Path(url)], handler)
    }

    patch(url: string, handler: RouteHandler<T>) {
        return this.handle([Patch, Path(url)], handler)
    }

    post(url: string, handler: RouteHandler<T>) {
        return this.handle([Post, Path(url)], handler)
    }

    put(url: string, handler: RouteHandler<T>) {
        return this.handle([Put, Path(url)], handler)
    }

    trace(url: string, handler: RouteHandler<T>) {
        return this.handle([Trace, Path(url)], handler)
    }

    all(url: string, handler: RouteHandler<T>) {
        return this.handle([Path(url)], handler)
    }

    route(req: T) {
        const route = this.resolve(req)

        if (route) {
            return route.handler(req)
        }

        return new Response('resource not found', {
            status: 404,
            statusText: 'not found',
            headers: {
                'content-type': 'text/plain',
            },
        })
    }

    /**
     * resolve returns the matching route for a request that returns
     * true for all conditions (if any).
     */
    resolve(req: T) {
        return this.routes.find(r => {
            if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
                return true
            }

            if (typeof r.conditions === 'function') {
                return r.conditions(req)
            }

            return r.conditions.every(c => c(req))
        })
    }
}

export default Router