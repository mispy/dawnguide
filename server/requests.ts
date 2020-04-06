import { getSession } from "./authentication"
import { Json, getQueryParams, ResponseError } from "./utils"
import { Session } from "./db"

/** Our annotation wrapper around incoming FetchEvents */
export class EventRequest {
    static async from(event: FetchEvent) {
        const { headers } = event.request
        const contentType = headers.get('content-type') || ""

        // Get the session if there is one
        const session = await getSession(event) || undefined

        // Parse body of the request as json, if present
        let json: Json | undefined
        if (event.request.method !== "GET") {
            if (contentType.includes('application/json')) {
                json = await event.request.json()
            } else if (contentType.includes('form')) {
                const formData = await event.request.formData()
                json = {}
                for (const entry of (formData as any).entries()) {
                    json[entry[0]] = entry[1]
                }
            }
        }

        return new EventRequest(event, json, session)
    }

    event: FetchEvent
    url: URL
    private _json?: Json
    session?: Session

    constructor(event: FetchEvent, json: Json | undefined, session: Session | undefined) {
        this.event = event
        this._json = json
        this.session = session
        this.url = new URL(this.event.request.url)
    }

    get headers() {
        return this.event.request.headers
    }

    get method() {
        return this.event.request.method
    }

    get path() {
        return this.url.pathname
    }

    get json(): Json {
        if (!this._json) {
            throw new Error(`Failed to get json from ${this.headers.get('content-type')} content type request`)
        }

        return this._json
    }

    get params() {
        return getQueryParams(this.url.search)
    }
}

export type SessionRequest = EventRequest & {
    session: Session
}
