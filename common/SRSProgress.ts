import _ from "lodash"
import { computed, observable, action, makeObservable } from "mobx"
import { hours, days, weeks, months } from './time'
import { overwrite } from "./utils"

type Timestamp = number

export type SRSProgressStoreItem = {
    /** An id of something being learned */
    cardId: string
    /** SRS stage from 1 to 10 */
    level: number
    /** When this card was initially learned */
    learnedAt: Timestamp
    /** When last reviewed or learned */
    reviewedAt: Timestamp
}

export type SRSProgressStore = {
    items: SRSProgressStoreItem[]
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
    constructor(readonly srs: SRSProgress, readonly cardId: string) {
        makeObservable(this)
    }

    @computed get storeItem() {
        return this.srs.storeItemsByCardId[this.cardId]!
    }

    get level() {
        return this.storeItem.level
    }

    get learnedAt() {
        return this.storeItem.learnedAt
    }

    get reviewedAt() {
        return this.storeItem.reviewedAt
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

export type SRSProgressItemScheduled = SRSProgressItem & { nextReviewAt: Timestamp }

/**
 * Encapsulates a user's progress on SRS cards across the site
 * This is a common interface only responsible for progress calculation
 * that should be agnostic as to the persistence method and content of the cards
 */
export class SRSProgress {
    @observable store: SRSProgressStore = { items: [] }
    @observable updates: { cardId: string, remembered: boolean, reviewedAt: Timestamp }[] = []

    constructor(store?: SRSProgressStore) {
        makeObservable(this)
        if (store) {
            this.overwriteWith(store)
        }
    }

    @computed get allItems() {
        return this.store.items.map(d => this.expect(d.cardId))
    }

    @computed get storeItemsByCardId(): Record<string, SRSProgressStoreItem> {
        return _.keyBy(this.store.items, d => d.cardId)
    }

    @computed get upcomingReviews(): SRSProgressItemScheduled[] {
        return _.sortBy(
            this.allItems.filter(r => r.nextReviewAt) as SRSProgressItemScheduled[],
            r => r.nextReviewAt
        )
    }

    @computed get availableReviews() {
        return this.upcomingReviews.filter(r => r.nextReviewAt <= Date.now())
    }

    has(cardId: string) {
        return !!this.storeItemsByCardId[cardId]
    }

    get(cardId: string): SRSProgressItem | undefined {
        return this.has(cardId) ? new SRSProgressItem(this, cardId) : undefined
    }

    expect(cardId: string): SRSProgressItem {
        const item = this.get(cardId)
        if (!item)
            throw new Error(`Expected to have progress for card id ${cardId}`)
        else
            return item
    }

    @action set(cardId: string, state: Omit<SRSProgressStoreItem, 'cardId'>) {
        const storeItem = this.storeItemsByCardId[cardId]
        if (storeItem) {
            Object.assign(storeItem, state)
        } else {
            this.store.items.push(Object.assign({ cardId }, state))
        }
    }

    @computed get jsonStr() {
        return JSON.stringify(this.store)
    }

    @action update({ cardId, remembered }: { cardId: string, remembered: boolean }) {
        const item = this.get(cardId)
        const now = Date.now()

        if (!item && !remembered) {
            // Didn't remember something we already have no progress for
            return
        } else if (item && (!item.nextReviewAt || item.nextReviewAt > now)) {
            // Only want to alter progress if there was actually a review scheduled
            return
        }

        if (!item) {
            // Reviewed a card for the first time

            this.set(cardId, {
                level: 1,
                learnedAt: now,
                reviewedAt: now
            })
        } else {
            const level = remembered ? Math.min(item.level + 1, 9) : Math.max(item.level - 1, 1)

            this.set(cardId, {
                level: level,
                learnedAt: item.learnedAt,
                reviewedAt: now
            })
        }

        this.updates.push({ cardId, remembered, reviewedAt: now })
    }

    /**
     * Overwrite progress with new state
     */
    @action overwriteWith(store: SRSProgressStore) {
        overwrite(this.store, store)
    }

    /**
     * Update this progress tracker with progress from another one
     * This favors the existing state as the "correct" one, and only updates if
     * it seems likely that the user might lose progress otherwise
     */
    @action reconcile(incomingItems: SRSProgressStoreItem[]): { changedItems: SRSProgressStoreItem[] } {
        const changedItems: SRSProgressStoreItem[] = []
        for (const incomingItem of incomingItems) {
            const storeItem = this.storeItemsByCardId[incomingItem.cardId]
            // Favor higher level + future or equal level + past
            if (!storeItem ||
                (incomingItem.level > storeItem.level && incomingItem.reviewedAt > storeItem.reviewedAt) ||
                (incomingItem.level === storeItem.level && incomingItem.reviewedAt < storeItem.reviewedAt)) {
                this.set(incomingItem.cardId, incomingItem)
                changedItems.push(this.expect(incomingItem.cardId).storeItem)
            }
        }
        return { changedItems }
    }
}