
import { asPublic, APITester } from './helpers'

describe('auth', () => {
    it("doesn't allow public access to authed endpoints", async () => {
        const res = await asPublic.get("/api/notificationSettings")
        expect(res.status).toBe(401)
    })

    it('allows signup', async () => {
        const res = await asPublic.post("/signup", { email: "2k@example.com", password: "gosh password,," })
        expect(res.status).toBe(302)
        const cookie = res.headers.get('Set-Cookie')
        expect(cookie).not.toBeNull()

        const asAuthed = new APITester()
        asAuthed.cookie = cookie as string

        const res2 = await asAuthed.get("/api/notificationSettings")
        expect(res2.status).toBe(200)
    })
})