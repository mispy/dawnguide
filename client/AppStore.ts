import { observable, runInAction, computed } from "mobx"
import { ConceptWithProgress, isReadyForReview, ConceptProgressItem } from "../shared/logic"
import { Concept, Exercise } from "../shared/concepts"
import _ = require("lodash")

export class AppStore {
    @observable conceptsWithProgress: ConceptWithProgress[] = []

    @computed get conceptsWithProgressById() {
        return _.keyBy(this.conceptsWithProgress, c => c.concept.id)
    }

    @computed get numLessons() {
        return this.conceptsWithProgress.length ? this.conceptsWithProgress.filter(c => c.progress === undefined || c.progress.level === 0).length : undefined
    }

    @computed get numReviews() {
        return this.conceptsWithProgress.filter(c => c.progress && isReadyForReview(c.progress)).length
    }

    @computed get reviews() {
        const reviews: { concept: Concept, exercise: Exercise }[] = []
        for (const c of this.conceptsWithProgress) {
            if (c.progress && isReadyForReview(c.progress)) {
                const exercise = _.sample(c.concept.exercises)
                if (exercise) {
                    reviews.push({ concept: c.concept, exercise: exercise })
                }
            }
        }
        return reviews
    }
}
