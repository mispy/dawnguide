
import { heartbeat } from '../server/systemController'
import { testMailsSent } from '../server/mail'
import * as db from '../server/db'
import { weeks } from '../server/time'

afterEach(() => {
    while (testMailsSent.length)
        testMailsSent.pop()
})

describe('emails', () => {
    it('sends lesson and review emails', async () => {

        const user = await db.users.create({
            username: "fluffles",
            email: "fluffles@gmail.com",
            password: "imfluffles"
        })

        await heartbeat()

        // Newly created user won't receive an immediate reminder email
        expect(testMailsSent.length).toBe(0)


        await db.notificationSettings.update(user.id, {
            lastWeeklyReviewEmail: Date.now() - weeks(1)
        })

        await heartbeat()

        // Now heartbeat will have sent an email
        expect(testMailsSent.length).toBe(1)

        const msg = testMailsSent[0]
        expect(msg.to).toBe("fluffles@gmail.com")
        expect(msg.subject).toBe("Your Lessons and Reviews Update")

        // But it won't send another one yet
        await heartbeat()
        expect(testMailsSent.length).toBe(1)
    })
})