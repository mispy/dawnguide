import { BASE_URL } from "./settings"
import _ = require('lodash')
import ReactDOMServer = require('react-dom/server')


export function renderToHtml(rootElement: Parameters<typeof ReactDOMServer.renderToStaticMarkup>[0]) {
    const markup = ReactDOMServer.renderToStaticMarkup(rootElement)
    return `<!doctype html>${markup}`
}

export function pageResponse(rootElement: Parameters<typeof ReactDOMServer.renderToStaticMarkup>[0], opts?: ResponseInit | undefined) {
    const html = renderToHtml(rootElement)
    opts = opts ? _.cloneDeep(opts) : {}
    opts.headers = _.extend({ "Content-Type": 'text/html' }, opts.headers || {})
    return new Response(html, opts)
}

/** Make mutable redirect response to absolute url */
export function redirect(dest: string, code: number = 302) {
    if (!dest.startsWith("http"))
        dest = urljoin(BASE_URL, dest)

    const res = Response.redirect(dest, code)
    return new Response(res.body, res)
}

export type Json = any

/** Expect a given json object to resolve some keys to string values */
export function expectStrings<U extends keyof Record<string, string | undefined>>(json: Record<string, string | undefined>, ...keys: U[]): Pick<Record<string, string>, U> {
    const obj: any = {}
    for (const key of keys) {
        const val = json[key]
        if (!_.isString(val)) {
            throw new Error(`Expected string value for '${key}', instead saw: ${val}`)
        }
        obj[key] = val
    }
    return obj
}

/** Expect a given json object to have keys */
export function expectKeys<U extends keyof Record<string, any>>(json: Record<string, any>, ...keys: U[]): Pick<Record<string, any>, U> {
    for (const key of keys) {
        if (!(key in json)) {
            throw new Error(`Expected value for '${key}' in object: ${JSON.stringify(json)}`)
        }
    }
    return json as any
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

import urljoin = require('url-join')
export function absurl(path: string): string {
    return urljoin(BASE_URL, path)
}

import { fromString } from 'html-to-text'

export function htmlToPlaintext(html: string): string {
    return fromString(html, {
        tables: true,
        ignoreHref: true,
        wordwrap: false,
        uppercaseHeadings: false,
        ignoreImage: true
    })
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

/** 
 * Used for throwing error messages that are acceptable to return directly to the user
 * i.e. handled errors, which should not trigger sentry reporting
 */
export class ResponseError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

import { Memoize } from 'typescript-memoize';
import { Session } from "./db"
export const memoize = Memoize