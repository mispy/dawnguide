import db = require('../server/db')
import { JsonResponse } from '../server/utils'

declare const process: any
const hash = process.env.CFSCRIPT_HASH
declare const global: any
const secret = global.LIVE_ADMIN_SECRET

function sendMessage(message: string, writer: WritableStreamDefaultWriter) {
    // defaultWriter is of type WritableStreamDefaultWriter
    const encoder = new TextEncoder()

    writer.write(encoder.encode(message))
}


async function importdb(writable: WritableStream) {
    const writer = writable.getWriter()
    sendMessage("fetching...\n", writer)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    await fetch(`https://dawnguide.com/export/${secret}`)
    sendMessage("done!", writer)
    // sendMessage(JSON.stringify(await res.json()), writer)
    writer.close()
}

async function main(event: FetchEvent) {
    if (!secret) {
        return new Response("Can't download from live db without LIVE_ADMIN_SECRET", { status: 400 })
    }

    const { readable, writable } = new TransformStream()


    // const json = await res.json()
    // return new JsonResponse(json)

    event.waitUntil(importdb(writable))
    event.respondWith(new Response(readable))
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url)



    if (url.pathname === `/${hash}`) {
        main(event)
    } else {
        event.respondWith(new Response(`Script hash did not match: ${url.pathname} !== /${hash}`))
    }
})