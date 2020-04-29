import db = require('../server/db')

async function main() {
    for (const key of await db.findKeys(`users:`)) {
        const userId = key.split('users:')[1]


        disableNotificationEmails ?: true
        emailAboutNewConcepts ?: true
        emailAboutWeeklyReviews ?: true
        db.putJson(`user_notification_settings:${userId}`, {
            disableNotificationEmails: false
        })
    }
}

addEventListener('fetch', event => {
    event.respondWith(main())
})