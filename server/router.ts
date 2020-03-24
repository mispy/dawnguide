import { Json } from "./utils"

type Responselike = Response | Json | string | void
type RouteHandler<T> = (req: T) => Responselike | Promise<Responselike>

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'all'

type Route<T> = {
    method: Method
    regex: string
    handler: RouteHandler<T>
}

function match<T extends Request>(req: T, route: Route<T>) {
    if (req.method !== 'all' && req.method.toLowerCase() !== route.method)
        return null

    const url = new URL(req.url)
    const path = url.pathname
    const match = path.match(`^${route.regex}$`)
    return match ? match.slice(1) : null
}


/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router<T extends Request> {
    routes: Route<T>[] = []

    private handle(method: Method, regex: string, handler: RouteHandler<T>) {
        this.routes.push({
            method,
            regex,
            handler
        })
    }

    get(regex: string, handler: RouteHandler<T>) {
        return this.handle('get', regex, handler)
    }

    post(regex: string, handler: RouteHandler<T>) {
        return this.handle('post', regex, handler)
    }

    put(regex: string, handler: RouteHandler<T>) {
        return this.handle('put', regex, handler)
    }

    patch(regex: string, handler: RouteHandler<T>) {
        return this.handle('patch', regex, handler)
    }

    delete(regex: string, handler: RouteHandler<T>) {
        return this.handle('delete', regex, handler)
    }

    all(regex: string, handler: RouteHandler<T>) {
        return this.handle('delete', regex, handler)
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
        return this.routes.find(r => match(req, r))
    }
}

export default Router