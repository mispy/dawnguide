
import { autorun } from 'mobx'
import { SRSProgress } from '../common/SRSProgress'
import * as time from '../common/time'
import MockDate from 'mockdate'

describe('SRSProgress', () => {
    it("learns a new card", () => {
        const srs = new SRSProgress()
        srs.update({ cardId: 'foo', remembered: true })

        const item = srs.expect('foo')
        expect(item.level).toBe(1)
        expect(item.learnedAt).toBeGreaterThan(Date.now() - 10000)
        expect(item.reviewedAt).toBeGreaterThan(Date.now() - 10000)
    })

    it("doesn't learn a card if no reason to", () => {
        const srs = new SRSProgress()
        srs.update({ cardId: 'foo', remembered: false })

        expect(srs.get('foo')).toBeUndefined()
    })

    it("progresses in level when it's time for a review", () => {
        const srs = new SRSProgress()
        srs.update({ cardId: 'kittens', remembered: true })
        const item = srs.expect('kittens')
        expect(item.level).toBe(1)

        // Not scheduled, no change expected
        srs.update({ cardId: 'kittens', remembered: true })
        expect(item.level).toBe(1)

        // Now it should change
        MockDate.set(item.nextReviewAt!)
        srs.update({ cardId: 'kittens', remembered: true })
        expect(item.level).toBe(2)
    })


    it("falls in level when scheduled review not remembered, to a minimum of 1", () => {
        const srs = new SRSProgress()

        srs.update({ cardId: 'kittens', remembered: true })
        const item = srs.expect('kittens')
        expect(item.level).toBe(1)

        MockDate.set(item.nextReviewAt!)
        srs.update({ cardId: 'kittens', remembered: true })
        expect(item.level).toBe(2)

        MockDate.set(item.nextReviewAt!)
        srs.update({ cardId: 'kittens', remembered: false })
        expect(item.level).toBe(1)

        MockDate.set(item.nextReviewAt!)
        srs.update({ cardId: 'kittens', remembered: false })
        expect(item.level).toBe(1)
    })

    it("has a maximum level of 9 and doesn't schedule reviews beyond that", () => {
        const srs = new SRSProgress()
        srs.update({ cardId: 'squirrels', remembered: true })
        const item = srs.expect('squirrels')

        while (item.nextReviewAt) {
            MockDate.set(item.nextReviewAt)
            srs.update({ cardId: 'squirrels', remembered: true })
        }

        expect(item.level).toBe(9)
        expect(srs.upcomingReviews.length).toBe(0)
    })

    it("plans upcoming reviews", () => {
        const srs = new SRSProgress()
        srs.update({ cardId: 'mochi', remembered: true })
        srs.update({ cardId: 'sushi', remembered: true })
        srs.update({ cardId: 'bao', remembered: true })

        const reviews = srs.upcomingReviews
        expect(reviews.length).toBe(3)
        expect(reviews[0]!.cardId).toBe('mochi')
        expect(reviews[1]!.cardId).toBe('sushi')
        expect(reviews[2]!.cardId).toBe('bao')
    })

    it("increases the time between reviews as level grows", () => {
        const now = Date.now()
        const srs = new SRSProgress()
        srs.update({ cardId: 'mochi', remembered: true })

        const firstReviewAt = srs.upcomingReviews[0]!.nextReviewAt
        expect(firstReviewAt - now).toBeGreaterThanOrEqual(time.hours(4))
        expect(firstReviewAt - now).toBeLessThan(time.hours(5))

        MockDate.set(firstReviewAt)
        srs.update({ cardId: 'mochi', remembered: true })
        const secondReviewAt = srs.upcomingReviews[0]!.nextReviewAt
        expect(secondReviewAt - firstReviewAt).toBeGreaterThanOrEqual(time.hours(8))
        expect(secondReviewAt - firstReviewAt).toBeLessThan(time.hours(9))
    })

    it("reconciles two progress stores without losing progress", () => {
        const srs1 = new SRSProgress()
        srs1.update({ cardId: 'mochi', remembered: true })
        srs1.update({ cardId: 'sushi', remembered: true })
        srs1.update({ cardId: 'waffles', remembered: true })

        MockDate.set(srs1.expect('waffles').nextReviewAt!)
        srs1.update({ cardId: 'waffles', remembered: true })

        const srs2 = new SRSProgress()
        srs2.update({ cardId: 'mochi', remembered: true })
        srs2.update({ cardId: 'sushi', remembered: true })
        srs2.update({ cardId: 'waffles', remembered: true })

        MockDate.set(srs2.expect('mochi').nextReviewAt!)
        srs2.update({ cardId: 'mochi', remembered: true })

        srs1.reconcile(srs2.store.items)
        const mochi = srs1.expect('mochi')
        expect(mochi.level).toBe(2)
        expect(mochi.reviewedAt).toEqual(srs2.expect('mochi').reviewedAt)

        const sushi = srs1.expect('sushi')
        expect(sushi.level).toBe(1)
        expect(sushi.reviewedAt).toBeLessThanOrEqual(srs2.expect('sushi').reviewedAt)

        const waffles = srs1.expect('waffles')
        expect(waffles.level).toBe(2)
        expect(waffles.reviewedAt).toBeLessThanOrEqual(srs2.expect('waffles').reviewedAt)
    })

    it("has mobx reactivity for srs updates", () => {
        const srs = new SRSProgress()

        let level: number | undefined
        autorun(() => level = srs.get('mochi')?.level)
        expect(level).toBeUndefined()

        srs.update({ cardId: 'mochi', remembered: true })
        expect(level).toEqual(1)

        MockDate.set(srs.expect('mochi').nextReviewAt!)
        srs.update({ cardId: 'mochi', remembered: true })
        expect(level).toEqual(2)
    })
})