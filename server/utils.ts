import { BASE_URL } from "./settings"
import _ = require('lodash')
import ReactDOMServer = require('react-dom/server')

export function pageResponse(rootElement: Parameters<typeof ReactDOMServer.renderToStaticMarkup>[0]) {
    return new Response(`<!doctype html>${ReactDOMServer.renderToStaticMarkup(rootElement)}`, { headers: { "Content-Type": 'text/html' } })
}

/** Make mutable redirect response to absolute url */
export function redirect(dest: string, code: number = 302) {
    if (!dest.startsWith("http"))
        dest = BASE_URL + dest

    const res = Response.redirect(dest, code)
    return new Response(res.body, res)
}

export type Json = any

/** Parse request body, throw error if it's not an object */
export async function expectRequestJson<T = Json>(request: Request): Promise<T> {
    const { headers } = request
    const contentType = headers.get('content-type')
    if (!contentType) {
        throw new Error("No content type")
    }
    if (contentType.includes('application/json')) {
        const body = await request.json()
        return body
    } else if (contentType.includes('form')) {
        const formData = await request.formData()
        const body: Json = {}
        for (const entry of (formData as any).entries()) {
            body[entry[0]] = entry[1]
        }
        return body as any as T
    } else {
        throw new Error(`Unexpected content type ${contentType}`)
    }
}

/** Expect a given json object to resolve some keys to string values */
export function expectStrings<U extends keyof Record<string, string | undefined>>(json: Record<string, string | undefined>, ...keys: U[]): Pick<Record<string, string | undefined>, U> {
    const obj: any = {}
    for (const key of keys) {
        const val = json[key]
        if (!_.isString(val)) {
            throw new Error(`Expected string value for ${key}, instead saw: ${val}`)
        }
        obj[key] = val
    }
    return obj
}

export interface QueryParams { [key: string]: string | undefined }

export function getQueryParams(queryStr: string): QueryParams {
    if (queryStr[0] === "?")
        queryStr = queryStr.substring(1)

    const querySplit = queryStr.split("&").filter(s => !!s)
    const params: QueryParams = {}

    for (const param of querySplit) {
        const pair = param.split("=")
        params[pair[0]] = pair[1]
    }

    return params
}

export class JsonResponse extends Response {
    constructor(obj: Json, init: ResponseInit = {}) {
        init = _.extend({ headers: { 'Content-Type': 'application/json' } }, init)
        super(JSON.stringify(obj), init)
    }
}

// Cloudflare's example code
// export async function readRequestBody(request: Request) {
//     const { headers } = request
//     const contentType = headers.get('content-type')
//     if (!contentType) {
//         throw new Error("No content type")
//     }
//     if (contentType.includes('application/json')) {
//         const body = await request.json()
//         return JSON.stringify(body)
//     } else if (contentType.includes('application/text')) {
//         const body = await request.text()
//         return body
//     } else if (contentType.includes('text/html')) {
//         const body = await request.text()
//         return body
//     } else if (contentType.includes('form')) {
//         const formData = await request.formData()
//         let body: { [key: string]: string } = {}
//         for (let entry of (formData as any).entries()) {
//             body[entry[0]] = entry[1]
//         }
//         return JSON.stringify(body)
//     } else {
//         let myBlob = await request.blob()
//         var objectURL = URL.createObjectURL(myBlob)
//         return objectURL
//     }
// }