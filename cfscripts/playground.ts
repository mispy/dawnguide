import db = require('../server/db')
import { JsonResponse } from '../server/utils'

async function main() {
    const users = []
    for (const user of await db.users.all()) {
        users.push(user)
    }
    return new JsonResponse(users)
}

addEventListener('fetch', event => {
    event.respondWith(main())
})