import _ from "lodash"
import { computed } from "mobx"
import { Lesson } from "../shared/content"
import { ExerciseWithProgress, getReviewTime } from "../shared/logic"

/** 
 * A learny represents what we know about a user's learning progress
 * associated with a given lesson.
 */
export class Learny {
    constructor(readonly lesson: Lesson, readonly ewps: ExerciseWithProgress[]) {
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

    @computed get nextReview() {
        const reviews = this.ewps.map(ex => {
            return {
                lesson: this.lesson,
                exercise: ex.exercise,
                when: ex.progress ? getReviewTime(ex.progress) : Infinity
            }
        }).filter(d => isFinite(d.when))

        return _.sortBy(reviews, d => d.when)[0]
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