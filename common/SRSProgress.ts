import _ from "lodash"
import { computed } from "mobx"
import { getTimeFromLevel } from './time'


type Timestamp = number

type CardProgressItem = {
    /** SRS stage from 1 to 10 */
    level: number
    /** When this card was initially learned */
    learnedAt: Timestamp
    /** When last reviewed or learned */
    reviewedAt: Timestamp
}

type ProgressStore = {
    cards: { [cardId: string]: CardProgressItem }
}

/**
 * Encapsulates a user's progress on SRS cards across the site
 * This is a common interface that should be usable whether you're
 * logged in or not, with persistence handled elsewhere
 */
export class SRSProgress {
    progress: ProgressStore = {
        cards: {}
    }

    constructor() {

    }

    @computed get upcomingReviews() {
        const upcomingReviews = []
        for (const cardId in this.progress.cards) {
            const item = this.expect(cardId)
            const time = getTimeFromLevel(item.level)

            if (time && isFinite(time)) {
                upcomingReviews.push({
                    cardId: cardId,
                    nextReviewAt: item.reviewedAt + time
                })
            }

        }
        return _.sortBy(upcomingReviews, r => r.nextReviewAt)
    }

    expect(cardId: string): CardProgressItem {
        const item = this.progress.cards[cardId]
        if (!item)
            throw new Error(`Expected to have progress for card id ${cardId}`)
        else
            return item
    }

    update({ cardId, remembered }: { cardId: string, remembered: boolean }) {
        let item = this.progress.cards[cardId]
        const now = Date.now()
        if (!item) {
            if (!remembered)
                return

            this.progress.cards[cardId] = {
                level: 1,
                learnedAt: now,
                reviewedAt: now
            }
        } else {
            const level = remembered ? Math.min(item.level + 1, 9) : Math.max(item.level - 1, 1)

            this.progress.cards[cardId] = {
                level: level,
                learnedAt: item.learnedAt,
                reviewedAt: now
            }
        }
    }

    /**
     * Update this progress tracker to include all the progress from another one,
     * resolving any conflicts along the way
     */
    reconcile(progress: ProgressStore) {
        for (const cardId in progress.cards) {
            const incomingItem = progress.cards[cardId]!
            const item = this.progress.cards[cardId]
            // Favor higher level or earlier review so user can't lose progress
            if (!item || incomingItem.level > item.level || (incomingItem.level === item.level && incomingItem.reviewedAt < item.reviewedAt)) {
                this.progress.cards[cardId] = incomingItem
            }
        }
    }
}