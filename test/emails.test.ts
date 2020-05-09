
import { heartbeat } from '../server/systemController'
import { testMailsSent } from '../server/mail'
import * as db from '../server/db'

afterEach(() => {
    while (testMailsSent.length)
        testMailsSent.pop()
})

describe('emails', () => {
    it('sends lesson and review emails', async () => {

        await db.users.create({
            username: "fluffles",
            email: "fluffles@gmail.com",
            password: "imfluffles"
        })

        await heartbeat()

        expect(testMailsSent.length).toBe(1)
        console.log(testMailsSent)

        // expect(matchesAnswerPermissively("wafflez", "waffles")).toBe(true)
        // expect(matchesAnswerPermissively("wafflezzz", "waffles")).toBe(false)
    })
})