
import { heartbeat } from '../server/systemController'
import { testMailsSent } from '../server/mail'
import * as db from '../server/db'
import * as time from '../common/time'
import { api } from './helpers'
import { content } from '../common/content'

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

        const weekAgo = Date.now() - time.weeks(1)

        // Make sure user has some reviews to do
        const lesson = content.lessons[0]!
        const toSave = lesson.exercises.map(ex => {
            return {
                userId: user.id,
                exerciseId: ex.id,
                level: 1,
                learnedAt: weekAgo,
                reviewedAt: weekAgo
            }
        })
        await db.progressItems.saveAll(user.id, toSave)

        await heartbeat()

        // Newly created user won't receive an immediate reminder email
        expect(testMailsSent.length).toBe(0)

        // Imagine the user was created a week ago
        await db.notificationSettings.update(user.id, {
            lastWeeklyReviewEmail: Date.now() - time.weeks(1)
        })

        await heartbeat()

        // Now heartbeat will have sent an email
        expect(testMailsSent.length).toBe(1)
        const msg = testMailsSent[0]!
        expect(msg.to).toBe("fluffles@gmail.com")
        expect(msg.subject).toBe("Your Lessons and Reviews Update")

        // But it won't send another one yet
        await heartbeat()
        expect(testMailsSent.length).toBe(1)

        // We don't keep sending emails if the user hasn't logged in since our last couple
        await db.notificationSettings.update(user.id, {
            lastWeeklyReviewEmail: weekAgo
        })

        await db.users.update(user.id, {
            lastSeenAt: weekAgo - time.weeks(1)
        })

        await heartbeat()
        expect(testMailsSent.length).toBe(1)
    })
})