import * as db from './db'
import { sendReviewsEmailIfNeeded } from './reviewsEmail'
import type { EventRequest } from './requests'
import { ResponseError } from './utils'
import { ADMIN_SECRET } from './settings'
import _ from 'lodash'

/** Called every ten minutes by easycron.com */
export async function heartbeat() {
    const userIds = await db.users.allIds()

    const promises = []
    for (const id of userIds) {
        const user = await db.users.get(id)
        if (!user) continue

        promises.push(sendReviewsEmailIfNeeded(user))
    }

    await Promise.all(promises)
    return "💛"
}

/** 
 * Export the whole database to json
 * Won't scale to larger number of keys, but sufficient for now
 */
export async function databaseExport(req: EventRequest, secret: string) {
    if (!secret.length || secret !== ADMIN_SECRET) {
        throw new ResponseError("Forbidden", 403)
    }

    const dbexport: any = {}
    let result = await db.cfstore.list({})

    async function recordKey(key: string) {
        const val = await db.cfstore.get(key)
        dbexport[key] = val !== null ? Buffer.from(val) : val
    }

    const promises = []
    while (result.keys.length) {
        for (const key of result.keys) {
            // Ignore temporary data
            if (_.startsWith(key.name, 'sessions:') || _.startsWith(key.name, 'email_confirm_tokens')) {
                continue
            }

            promises.push(recordKey(key.name))
        }

        if (result.cursor) {
            result = await db.cfstore.list({ cursor: result.cursor })
        } else {
            break
        }
    }

    await Promise.all(promises)
    return dbexport
}