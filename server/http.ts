import _ = require("lodash")

const objectToFormData = require('object-to-formdata').default

namespace http {
    export interface HttpOptions {
        headers?: { [key: string]: string }
    }
    export async function postJson(url: string, body: any, options: HttpOptions = {}) {
        const init = {
            body: JSON.stringify(body),
            method: 'POST',
            headers: _.extend({
                'content-type': 'application/json;charset=UTF-8',
            }, options.headers || {})
        }
        const response = await fetch(url, init)
        const results = await gatherResponse(response)
        return results
    }

    export async function post(url: string, body: any, options: HttpOptions = {}) {
        const init = {
            body: objectToFormData(body, {}, new URLSearchParams()),
            method: 'POST',
            headers: _.extend({
                'content-type': 'application/x-www-form-urlencoded',
            }, options.headers || {})
        }
        const response = await fetch(url, init)
        const results = await gatherResponse(response)
        return results
    }

    async function gatherResponse(response: Response) {
        const { headers } = response
        const contentType = headers.get('content-type')
        if (!contentType)
            throw new Error(`Unexpected contentType ${contentType}`)

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

