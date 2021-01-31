import _ from "lodash"
import { computed, observable, makeObservable } from "mobx"
import type { Lesson } from "../common/content"
import type { ExerciseWithProgress } from "../common/logic"
import type { SRSProgress } from "../common/SRSProgress"

/** 
 * A learny represents what we know about a user's learning progress
 * associated with a given lesson.
 */
export class Learny {
    @observable disabled: boolean
    constructor(readonly lesson: Lesson, readonly srs: SRSProgress, disabled: boolean) {
        this.disabled = disabled
        makeObservable(this)
    }

    @computed get ewps(): ExerciseWithProgress[] {
        const ewps = []
        for (const exercise of this.lesson.exercises) {
            ewps.push({
                exercise: exercise,
                progress: this.srs.get(exercise.id)
            })
        }
        return ewps
    }

    @computed get meanReviewLevel(): number {
        return _.mean(this.ewps.map(ewp => ewp.progress?.level || 0))
    }

    @computed get masteryLevel(): number {
        return Math.floor(this.meanReviewLevel)
    }

    @computed get masteryPercent(): number {
        return (this.meanReviewLevel / 9) * 100
    }

    @computed get upcomingReviews() {
        if (this.disabled)
            return []

        const lessonCardIds = this.lesson.exercises.map(e => e.id)
        return this.srs.upcomingReviews.filter(r => lessonCardIds.includes(r.cardId))
    }

    @computed get nextReview() {
        if (this.disabled)
            return undefined

        const review = this.upcomingReviews[0]
        if (review) {
            return {
                lesson: this.lesson,
                exercise: this.ewps.find(e => e.exercise.id === review.cardId)!.exercise,
                when: review.nextReviewAt
            }
        } else {
            return undefined
        }
    }

    @computed get peeked() {
        // TODO
        return true
    }

    @computed get learned() {
        return this.meanReviewLevel > 0
    }

    @computed get mastered() {
        return this.meanReviewLevel === 9
    }
}