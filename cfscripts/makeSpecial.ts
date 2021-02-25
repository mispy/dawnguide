import db = require('../server/db')
import { runScript, StreamingTextResponse } from '../server/utils'

async function main(res: StreamingTextResponse) {
    const users = await db.users.all()

    for (const user of users) {
        if (process.env.CUTIES?.split(",").includes(user.email)) {
            res.log(user.email + ' - cute')
            await db.users.update(user.id, { specialStatus: 'cute' })
            await db.notificationSettings.update(user.id, { emailAboutNewDrafts: true })
        } else if (user.subscription) {
            res.log(user.email + ' - subscriber')
            await db.notificationSettings.update(user.id, { emailAboutNewDrafts: true })
        }
    }
    res.close()
}

runScript(event => {
    const res = new StreamingTextResponse()
    event.waitUntil(main(res))
    event.respondWith(res)
})