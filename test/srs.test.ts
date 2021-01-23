
import { SRSProgress } from '../common/SRSProgress'
import * as time from '../common/time'

describe('SRSProgress', () => {
    it("learns a new card", async () => {
        const progress = new SRSProgress()
        progress.update({ cardId: 'foo', remembered: true })

        const item = progress.expect('foo')
        expect(item.level).toBe(1)
        expect(item.learnedAt).toBeGreaterThan(Date.now() - 10000)
        expect(item.reviewedAt).toBeGreaterThan(Date.now() - 10000)
    })

    it("doesn't learn a card if no reason to", async () => {
        const progress = new SRSProgress()
        progress.update({ cardId: 'foo', remembered: false })

        expect(progress.byCardId).not.toHaveProperty('foo')
    })

    it("has a minimum level of 1", async () => {
        const progress = new SRSProgress()
        progress.update({ cardId: 'foo', remembered: true })
        progress.update({ cardId: 'foo', remembered: false })

        const item = progress.expect('foo')
        expect(item.level).toBe(1)
    })

    it("progresses in level", async () => {
        const progress = new SRSProgress()
        progress.update({ cardId: 'foo', remembered: true })
        progress.update({ cardId: 'foo', remembered: true })

        const item = progress.expect('foo')
        expect(item.level).toBe(2)
    })

    it("has a maximum level of 9", async () => {
        const progress = new SRSProgress()
        for (let i = 0; i < 100; i++) {
            progress.update({ cardId: 'foo', remembered: true })
        }

        const item = progress.expect('foo')
        expect(item.level).toBe(9)
    })

    it("plans upcoming reviews", async () => {
        const progress = new SRSProgress()
        progress.update({ cardId: 'mochi', remembered: true })
        progress.update({ cardId: 'sushi', remembered: true })
        progress.update({ cardId: 'bao', remembered: true })

        const reviews = progress.upcomingReviews
        expect(reviews.length).toBe(3)
        expect(reviews[0]!.cardId).toBe('mochi')
        expect(reviews[1]!.cardId).toBe('sushi')
        expect(reviews[2]!.cardId).toBe('bao')
    })

    it("increases the time between reviews as level grows", async () => {
        const now = Date.now()
        const progress = new SRSProgress()
        progress.update({ cardId: 'mochi', remembered: true })

        const firstReviewAt = progress.upcomingReviews[0]!.nextReviewAt
        expect(firstReviewAt - now).toBeGreaterThanOrEqual(time.hours(4))
        expect(firstReviewAt - now).toBeLessThan(time.hours(5))

        progress.update({ cardId: 'mochi', remembered: true })
        const secondReviewAt = progress.upcomingReviews[0]!.nextReviewAt
        expect(secondReviewAt - now).toBeGreaterThanOrEqual(time.hours(8))
        expect(secondReviewAt - now).toBeLessThan(time.hours(9))
    })

    it("doesn't include a mastered card in reviews", async () => {
        const progress = new SRSProgress()
        for (let i = 0; i < 100; i++) {
            progress.update({ cardId: 'hello world', remembered: true })
        }

        expect(progress.upcomingReviews.length).toBe(0)
    })
})