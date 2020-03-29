import http from './http'
import { SENDGRID_SECRET_KEY } from './settings'
import * as db from './db'
import { days } from './time'
import { Sunpedia } from '../shared/sunpedia'
import { absurl } from './utils'

type EmailMessage = {
    to: string
    from?: string
    subject: string
    text: string
}

export async function sendMail(msg: EmailMessage) {
    const body = {
        "personalizations": [
            { "to": [{ "email": msg.to }] }
        ],
        "from": { "email": msg.from || "Dawnguide <dawnguide@example.com>" },
        "subject": msg.subject,
        "content": [{ "type": "text/plain", "value": msg.text }]
    }

    await http.postJson("https://api.sendgrid.com/v3/mail/send", body, {
        headers: {
            Authorization: `Bearer ${SENDGRID_SECRET_KEY}`
        }
    })
}

export async function sendLearningReminder(user: db.User) {
    const now = Date.now()
    const json = await db.getJson<{ sentAt: number }>(`learning_reminder:${user.id}`)
    const lastSent = json?.sentAt || user.createdAt

    // if (lastSent > now - days(7)) {
    //     // Not time for reminder yet
    //     return
    // }

    const progressItems = await db.progressItems.allFor(user.id)
    const sunpedia = new Sunpedia()
    const { lessons, reviews } = sunpedia.getLessonsAndReviews(progressItems)

    await sendMail({
        // to: user.email,
        to: "misprime@gmail.com",
        subject: "Your Lessons and Reviews Update",
        text: `Hello, you have ${lessons.length} lessons and ${reviews.length} reviews ready! Check them out here: ${absurl('/home')}`
    })

    await db.putJson(`learning_reminder:${user.id}`, { sentAt: now })
}

export async function sendLearningReminders() {
    const promises = []

    for (const user of await db.users.all()) {
        promises.push(sendLearningReminder(user))
    }

    await Promise.all(promises)
}