import { Json } from "./utils"

type Responselike = Response | Json | string | void
type RouteHandler<T> = (req: T, ...args: string[]) => Responselike | Promise<Responselike>

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'all'

type Route<T> = {
    method: Method
    regex: string
    handler: RouteHandler<T>
}

function routeMatch<T extends Request>(req: T, route: Route<T>) {
    if (route.method !== 'all' && req.method.toLowerCase() !== route.method)
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
        return this.handle('all', regex, handler)
    }

    route(req: T) {
        let route, match = null
        for (const r of this.routes) {
            match = routeMatch(req, r)
            if (match) {
                route = r
                break
            }
        }

        if (route && match) {
            return route.handler(req, ...match)
        } else {
            return new Response('resource not found', {
                status: 404,
                statusText: 'not found',
                headers: {
                    'content-type': 'text/plain',
                },
            })
        }
    }
}

export default Router