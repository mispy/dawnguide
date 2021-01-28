import _ from "lodash"
import { computed, observable, makeObservable, action, runInAction } from "mobx"
import { hours, days, weeks, months } from './time'

type Timestamp = number

type ProgressStoreItem = {
    /** SRS stage from 1 to 10 */
    level: number
    /** When this card was initially learned */
    learnedAt: Timestamp
    /** When last reviewed or learned */
    reviewedAt: Timestamp
}

export type ProgressStore = {
    cards: { [cardId: string]: ProgressStoreItem }
}


const reviewDelayByLevel = [
    0,          // 0, not used
    hours(4),   // 1
    hours(8),   // 2
    days(1),    // 3
    days(2),    // 4
    days(4),    // 5
    weeks(2),   // 6
    months(1),  // 7
    months(4),  // 8
    Infinity    // 9 / Graduated
]


export function getReviewDelayByLevel(level: number): number {
    const time = reviewDelayByLevel[level]
    if (!time) {
        throw new Error(`Timing level ${level} is out of range`)
    } else {
        return time
    }
}

export class SRSProgressItem {
    constructor(readonly store: ProgressStoreItem) {
        makeObservable(this)
    }

    get level() {
        return this.store.level
    }

    get learnedAt() {
        return this.store.learnedAt
    }

    get reviewedAt() {
        return this.store.reviewedAt
    }

    @computed get mastered(): boolean {
        return this.level >= 9
    }

    @computed get nextReviewAt(): Timestamp | undefined {
        if (this.mastered) {
            return undefined
        } else {
            return this.reviewedAt + getReviewDelayByLevel(this.level)
        }
    }
}

/**
 * Encapsulates a user's progress on SRS cards across the site
 * This is a common interface only responsible for progress calculation
 * that should be agnostic as to the persistence method and content of the cards
 */
export class SRSProgress {
    store: ProgressStore
    @observable _items: { [cardId: string]: SRSProgressItem } = {}

    constructor(store?: ProgressStore) {
        this.store = store || observable({ cards: {} })
        makeObservable(this)
    }

    @computed get upcomingReviews() {
        const upcomingReviews = []
        for (const cardId in this.store.cards) {
            const item = this.expect(cardId)

            if (item.nextReviewAt) {
                upcomingReviews.push({
                    cardId: cardId,
                    nextReviewAt: item.nextReviewAt
                })
            }

        }
        return _.sortBy(upcomingReviews, r => r.nextReviewAt)
    }

    get(cardId: string): SRSProgressItem | undefined {
        const store = this.store.cards[cardId]
        const item = this._items[cardId]
        if (item) {
            return item
        } else if (store) {
            runInAction(() => {
                this._items[cardId] = new SRSProgressItem(store)
            })
            return this._items[cardId]
        } else {
            return undefined
        }
    }

    expect(cardId: string): SRSProgressItem {
        const item = this.get(cardId)
        if (!item)
            throw new Error(`Expected to have progress for card id ${cardId}`)
        else
            return item
    }

    @action update({ cardId, remembered }: { cardId: string, remembered: boolean }) {
        let item = this.store.cards[cardId]
        const now = Date.now()
        if (!item) {
            if (!remembered)
                return

            this.store.cards[cardId] = {
                level: 1,
                learnedAt: now,
                reviewedAt: now
            }
        } else {
            const level = remembered ? Math.min(item.level + 1, 9) : Math.max(item.level - 1, 1)

            this.store.cards[cardId] = {
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
    @action reconcile(store: ProgressStore) {
        for (const cardId in store.cards) {
            const incomingItem = store.cards[cardId]!
            const item = this.store.cards[cardId]
            // Favor higher level or earlier review so user can't lose progress
            if (!item || incomingItem.level > item.level || (incomingItem.level === item.level && incomingItem.reviewedAt < item.reviewedAt)) {
                this.store.cards[cardId] = incomingItem
            }
        }
    }
}