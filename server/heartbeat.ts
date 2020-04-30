import db = require('./db')
import { Sunpedia } from '../shared/sunpedia'
import { sendReviewsEmailIfNeeded } from './reviewsEmail'

export async function heartbeat() {
    const sunpedia = new Sunpedia()
    const userIds = await db.users.allIds()

    for (const id of userIds) {
        const user = await db.users.get(id)
        if (!user) continue

        await sendReviewsEmailIfNeeded(user)
    }

    return "💛"
}