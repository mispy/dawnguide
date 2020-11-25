declare const global: any

// @ts-ignore
import * as runtime from '@dollarshaveclub/cloudworker/lib/runtime'
// @ts-ignore
import StubCacheFactory from '@dollarshaveclub/cloudworker/lib/runtime/cache/stub'
import EventEmitter from 'events'

const dispatcher = new (EventEmitter as any)()
const eventListener = (eventType: any, handler: any) => {
    const wrapper = (event: any) => {
        Promise.resolve(handler(event)).catch((error) => { event.onError(error) })
    }
    dispatcher.on(eventType, wrapper)
}

const cacheFactory = new StubCacheFactory()
const context = new runtime.Context(eventListener, cacheFactory, {})

for (const key in context) {
    if (!(key in global)) {
        global[key] = context[key]
    }
}

// @ts-ignore
import { KeyValueStore } from '@dollarshaveclub/cloudworker/lib/kv'
global.STORE = new KeyValueStore()
