import _ = require("lodash")

// @ts-ignore
const objectToFormData = require('object-to-formdata').default

export class RequestError extends Error {
    constructor(message: string) {
        super(message)
    }
}

namespace http {
    export interface HttpOptions {
        headers?: { [key: string]: string }
    }

    export async function request(url: RequestInfo, init: RequestInit) {
        const response = await fetch(url, init)

        if (response.status !== 200) {
            console.error(response)
            const results = await gatherResponse(response)
            console.error(results)
            throw new RequestError(`Received ${response.status} from ${init.method} request to ${url}`)
        }

        const results = await gatherResponse(response)
        return results
    }

    export async function get(url: string, options: HttpOptions = {}) {
        return http.request(url, {
            method: 'GET',
            headers: options.headers || {}
        })
    }

    export async function del(url: string, options: HttpOptions = {}) {
        return http.request(url, {
            method: 'DELETE',
            headers: options.headers || {}
        })
    }

    export async function post(url: string, body: any, options: HttpOptions = {}) {
        return http.request(url, {
            body: objectToFormData(body, {}, new URLSearchParams()),
            method: 'POST',
            headers: _.extend({
                'content-type': 'application/x-www-form-urlencoded',
            }, options.headers || {})
        })
    }

    export async function postJson(url: string, body: any, options: HttpOptions = {}) {
        return http.request(url, {
            body: JSON.stringify(body),
            method: 'POST',
            headers: _.extend({
                'content-type': 'application/json;charset=UTF-8',
            }, options.headers || {})
        })
    }

    async function gatherResponse(response: Response) {
        const { headers } = response
        const contentType = headers.get('content-type')
        if (!contentType)
            return response

        if (contentType.includes('application/json')) {
            return await response.json()
        } else if (contentType.includes('application/text')) {
            return await response.text()
        } else if (contentType.includes('text/html')) {
            return await response.text()
        } else {
            return await response.text()
        }
    }
}

export default http

