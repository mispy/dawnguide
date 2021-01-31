import { computed } from "mobx"
import { content } from "./content"
import type { SRSProgress } from "./SRSProgress"
import type { CardToReview } from "./types"

/** 
 * Combines the (content-agnostic) SRSProgress calculations with
 * the actual content to be reviewed
 **/
export class ReviewPlan {
    constructor(readonly srs: SRSProgress) { }


    @computed get upcomingReviews(): CardToReview[] {
        const reviews = []
        for (const r of this.srs.upcomingReviews) {
            const card = content.getExercise(r.cardId)
            if (!card) continue

            reviews.push({
                ...card,
                nextReviewAt: r.nextReviewAt
            })
        }
        return reviews
    }

    @computed get cardsToReview() {
        return this.upcomingReviews.filter(c => c.nextReviewAt <= Date.now())
    }
}