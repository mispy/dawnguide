import * as db from '../server/db'
import { runScript, StreamingTextResponse } from '../server/utils'

async function main(res: StreamingTextResponse) {
    const users = await db.users.all()

    for (const user of users) {
        if (["foo"].includes(user.email)) {
            await db.notificationSettings.update(user.id, { emailAboutNewDrafts: true })
            res.log(user.email)
        }
    }
    res.close()
}

runScript(event => {
    const res = new StreamingTextResponse()
    event.waitUntil(main(res))
    event.respondWith(res)
})