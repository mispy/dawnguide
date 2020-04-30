import db = require('./db')
import { Sunpedia } from '../shared/sunpedia'
import { sendReviewsEmailIfNeeded } from './reviewsEmail'
import { weeks } from './time'

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