
import { content } from '../common/content'
import { asPublic } from './helpers'

describe('public site pages', () => {
    it('renders all the public pages', async () => {
        for (const path of ['/', '/login', '/signup', '/reset-password']) {
            const res = await asPublic.get(path)
            expect(res.status).toEqual(200)
        }

        for (const lesson of content.lessons) {
            const res = await asPublic.get(`/${lesson.slug}`)
            expect(res.status).toEqual(200)

            const html = await res.text()
            expect(html).toContain(lesson.title)
        }
    })
})