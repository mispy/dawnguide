import { handleEvent } from '../server/worker'
import { absurl } from '../shared/utils'

class TestFetchEvent {
    constructor(readonly request: Request) {
    }

    waitUntil(promise: Promise<any>) {
        // No-op for now
    }
}

class APITester {
    constructor() {
    }

    async get(url: string): Promise<Response> {
        const request = new Request(absurl(url))
        const event = new TestFetchEvent(request)
        return await handleEvent(event as any)
    }
}

export const api = new APITester()