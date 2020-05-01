import db = require('./db')
import { Sunpedia } from '../shared/sunpedia'
import { sendReviewsEmailIfNeeded } from './reviewsEmail'
import { weeks } from './time'
import { SessionRequest, EventRequest } from './requests'
import { ResponseError } from './utils'
import { ADMIN_SECRET } from './settings'

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


function isAdmin(user: db.User) {
    return user.email === "foldspark@gmail.com" && user.emailConfirmed
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
        dbexport[key] = await db.cfstore.get(key)
    }

    const promises = []
    while (result.keys.length) {
        for (const key of result.keys) {
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