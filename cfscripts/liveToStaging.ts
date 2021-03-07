import * as db from '../server/db'
import { runScript, StreamingTextResponse } from '../server/utils'

declare const global: any

async function importdb(res: StreamingTextResponse) {
    if (!global.LIVE_ADMIN_SECRET) {
        res.log("Can't download from live db without LIVE_ADMIN_SECRET")
        res.close()
        return
    }

    res.log(`Fetching live db...`)
    const dbres = await fetch(`https://dawnguide.com/export/${global.LIVE_ADMIN_SECRET}`)
    const json = await dbres.json()

    res.log(`Deleting keys that don't exist in live dump...`)

    let result = await db.cfstore.list({})
    const deletePromises = []
    while (result.keys.length) {
        for (const key of result.keys) {
            if (!(key.name in json)) {
                deletePromises.push(db.cfstore.delete(key.name))
            }
        }

        if (result.cursor) {
            result = await db.cfstore.list({ cursor: result.cursor })
        } else {
            break
        }
    }
    await Promise.all(deletePromises)

    res.log(`Writing live dump to KV store...`)

    const importPromises = []
    for (const key in json) {
        importPromises.push(db.cfstore.put(key, Buffer.from(json[key])))
    }
    await Promise.all(importPromises)

    res.log(`Done!`)

    res.close()
}

runScript(event => {
    const res = new StreamingTextResponse()
    event.waitUntil(importdb(res))
    event.respondWith(res)
})