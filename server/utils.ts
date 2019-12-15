import { BASE_URL } from "./settings"
import _ = require('lodash')

/** Make mutable redirect response to absolute url */
export function redirect(dest: string, code: number = 302) {
    if (!dest.startsWith("http"))
        dest = BASE_URL + dest

    const res = Response.redirect(dest, code)
    return new Response(res.body, res)
}

export type Json = { [key: string]: string | number | Json | null | undefined }

/** Parse request body, throw error if it's not an object */
export async function expectRequestJson(request: Request): Promise<Json> {
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
        let body: Json = {}
        for (let entry of (formData as any).entries()) {
            body[entry[0]] = entry[1]
        }
        return body
    } else {
        throw new Error(`Unexpected content type ${contentType}`)
    }
}

/** Expect a given json object to resolve some keys to string values */
export function expectStrings<U extends keyof Json>(json: Json, ...keys: U[]): Pick<{ [key: string]: string }, U> {
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