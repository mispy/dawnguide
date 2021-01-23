
import { SRSProgress } from '../common/SRSProgress'

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

    it("has progresses in level", async () => {
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
})