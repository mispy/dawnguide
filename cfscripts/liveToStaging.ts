import db = require('../server/db')
import { StreamingTextResponse } from '../server/utils'

declare const process: any
const hash = process.env.CFSCRIPT_HASH
declare const global: any
const secret = global.LIVE_ADMIN_SECRET

function sendMessage(message: string, writer: WritableStreamDefaultWriter) {
    // defaultWriter is of type WritableStreamDefaultWriter
    const encoder = new TextEncoder()

    writer.write(encoder.encode(message))
}


async function importdb(res: StreamingTextResponse) {
    res.log(`Fetching live db...`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    res.log(`Writing export to KV store...`)

    res.close()
}

async function main(event: FetchEvent) {
    if (!secret) {
        return new Response("Can't download from live db without LIVE_ADMIN_SECRET", { status: 400 })
    }

    const res = new StreamingTextResponse()
    event.waitUntil(importdb(res))
    event.respondWith(res)
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url)



    if (url.pathname === `/${hash}`) {
        main(event)
    } else {
        event.respondWith(new Response(`Script hash did not match: ${url.pathname} !== /${hash}`))
    }
})