import db = require('../server/db')
import { JsonResponse } from '../server/utils'
import { weeks } from '../server/time'

declare const process: any
const hash = process.env.CFSCRIPT_HASH

async function main() {
    const data: any = []
    for (const user of await db.users.all()) {
        if (user.email === "foldspark@gmail.com") {
            await db.notificationSettings.update(user.id, { lastWeeklyReviewEmail: Date.now() - weeks(2) })
        }
    }
    return new JsonResponse({ success: hash, data: data })
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url)
    if (url.pathname === `/${hash}`) {
        event.respondWith(main())
    } else {
        event.respondWith(new Response(`Script hash did not match: ${url.pathname} !== /${hash}`))
    }
})