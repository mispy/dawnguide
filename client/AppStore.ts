import { observable, runInAction, computed } from "mobx"
import { ConceptWithProgress, isReadyForReview } from "../shared/logic"

export class AppStore {
    @observable conceptsWithProgress: ConceptWithProgress[] = []

    @computed get numLessons() {
        return this.conceptsWithProgress.length ? this.conceptsWithProgress.filter(c => c.progress === undefined || c.progress.level === 0).length : undefined
    }

    @computed get numReviews() {
        return this.conceptsWithProgress.filter(c => c.progress && isReadyForReview(c.progress)).length
    }
}
