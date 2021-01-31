import _ from "lodash"
import { computed, makeObservable } from "mobx"
import { content, ReadingLesson } from "../common/content"
import type { SRSProgress } from "../common/SRSProgress"
import type { CardToReview } from "./types"

/** 
 * Combines the (content-agnostic) SRSProgress calculations with
 * the actual content to be reviewed
 **/
export class LearnyPlan {
    constructor(readonly srs: SRSProgress, readonly disabledLessons: { [lessonId: string]: boolean }) {
        makeObservable(this)
    }

    @computed get learnies(): Learny[] {
        return content.lessons.filter(l => l.type === 'reading').map(l => new Learny(this, l as ReadingLesson))
    }

    @computed get upcomingReviews(): CardToReview[] {
        return _.flatten(this.learnies.map(l => l.upcomingReviews))
    }

    @computed get availableReviews() {
        return this.upcomingReviews.filter(c => c.nextReviewAt <= Date.now())
    }

    @computed get nextLesson() {
        return this.learnies.find(l => !l.learned)?.lesson
    }
}

/** 
 * A learny represents what we know about a user's learning progress
 * associated with a given lesson.
 */
export class Learny {
    constructor(readonly plan: LearnyPlan, readonly lesson: ReadingLesson) {
        makeObservable(this)
    }

    @computed get disabled() {
        return this.plan.disabledLessons[this.lesson.id]
    }

    @computed get ewps() {
        const ewps = []
        for (const exercise of this.lesson.exercises) {
            ewps.push({
                exercise: exercise,
                progress: this.plan.srs.get(exercise.id)
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

    @computed get upcomingReviews(): CardToReview[] {
        if (this.disabled)
            return []

        const reviews = []
        for (const ewp of this.ewps) {
            if (ewp.progress && ewp.progress.nextReviewAt) {
                reviews.push({
                    ...ewp.exercise,
                    nextReviewAt: ewp.progress.nextReviewAt
                })
            }
        }
        return reviews
    }

    @computed get nextReview(): CardToReview | undefined {
        return this.upcomingReviews[0]
    }

    @computed get learned() {
        return this.meanReviewLevel > 0
    }

    @computed get mastered() {
        return this.meanReviewLevel === 9
    }
}