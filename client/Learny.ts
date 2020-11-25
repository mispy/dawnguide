import _ from "lodash"
import { computed, observable } from "mobx"
import { Lesson } from "../common/content"
import { ExerciseWithProgress, getReviewTime } from "../common/logic"
import { UserLesson } from "../common/types"

/** 
 * A learny represents what we know about a user's learning progress
 * associated with a given lesson.
 */
export class Learny {
    @observable userLesson: UserLesson
    constructor(readonly lesson: Lesson, userLesson: UserLesson, readonly ewps: ExerciseWithProgress[]) {
        this.userLesson = userLesson
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
        if (this.userLesson.disabled)
            return undefined

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