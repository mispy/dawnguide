import db = require('../server/db')
import { runScript, StreamingTextResponse } from '../server/utils'

async function main(res: StreamingTextResponse) {
    const users = await db.users.all()

    for (const user of users) {
        const u = user as any
        if (u.cryptedPassword) {
            await db.userSecrets.set(u.id, { hashedPassword: u.cryptedPassword })
            delete u['cryptedPassword']
            await db.users.save(u)
        }
    }

    res.log(`Migration complete`)
    res.close()
}

runScript(event => {
    const res = new StreamingTextResponse()
    event.waitUntil(main(res))
    event.respondWith(res)
})