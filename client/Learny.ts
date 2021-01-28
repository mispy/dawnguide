import _ from "lodash"
import { computed, observable, makeObservable } from "mobx"
import { Lesson } from "../common/content"
import { ExerciseWithProgress, getReviewTime } from "../common/logic"
import { SRSProgress } from "../common/SRSProgress"
import { UserLesson } from "../common/types"

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

    @computed get nextReview() {
        if (this.disabled)
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