import db = require('./db')
import { Sunpedia } from '../shared/sunpedia'

export async function heartbeat() {
    // const sunpedia = new Sunpedia()
    // const userIds = await db.users.allIds()

    // for (const id of userIds) {
    //     const user = await db.users.get(id)
    //     if (!user) continue

    //     const settings = await db.notificationSettings.get(id)
    //     if (settings.disableNotificationEmails || !settings.emailAboutWeeklyReviews)
    //         continue

    //     const progressItems = await db.progressItems.allFor(id)
    //     const { lessons, reviews } = sunpedia.getLessonsAndReviews(progressItems)


    // }

    return "💛"
}