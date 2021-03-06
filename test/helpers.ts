import { handleEvent } from '../server/worker'
import { absurl } from '../common/utils'

class TestFetchEvent {
    constructor(readonly request: Request) {
    }

    waitUntil(promise: Promise<any>) {
        // No-op for now
    }
}

export class APITester {
    cookie: string = ""
    constructor() {
    }

    async get(url: string): Promise<Response> {
        const request = new Request(absurl(url), {
            headers: {
                "Cookie": this.cookie
            }
        })
        const event = new TestFetchEvent(request)
        return await handleEvent(event as any)
    }

    async post(url: string, body: any): Promise<Response> {
        const request = new Request(absurl(url), {
            method: "POST",
            headers: {
                "Cookie": this.cookie,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const event = new TestFetchEvent(request)
        return await handleEvent(event as any)
    }

    async login(email: string, password: string) {
        const asUser = new APITester()
        const response = await asUser.post("/login", { email, password })
        const cookie = response.headers.get('Set-Cookie')
        if (cookie) {
            asUser.cookie = cookie
        }
        return asUser
    }
}

export const asPublic = new APITester()