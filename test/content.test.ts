
import _ from 'lodash'
import { content } from '../common/content'

describe('content', () => {
    it("has some lessons", async () => {
        expect(content.lessons.length).toBeGreaterThan(0)
    })

    it("has unique slugs for each lesson", async () => {
        const existingSlugs: { [slug: string]: boolean } = {}
        for (const lesson of content.lessons) {
            expect(lesson.slug).toBeTruthy()
            expect(existingSlugs).not.toHaveProperty(lesson.slug)
            existingSlugs[lesson.slug] = true
        }
        const slugs = _.uniq(content.lessons.map(l => l.slug).filter(s => s.length > 0))
        expect(slugs.length).toEqual(content.lessons.length)
    })
})