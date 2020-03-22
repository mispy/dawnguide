import { observable, runInAction, computed } from "mobx"
import { ConceptWithProgress, isReadyForReview } from "../shared/logic"
import { Concept, Exercise } from "../shared/sunpedia"
import _ = require("lodash")
import { SunpeepApi } from "./SunpeepApi"
import { Sunpedia } from "../shared/sunpedia"

export class AppStore {
  api: SunpeepApi
  sunpedia: Sunpedia
  @observable conceptsWithProgress: ConceptWithProgress[] = []

  constructor() {
    this.sunpedia = new Sunpedia()
    this.api = new SunpeepApi(this.sunpedia)
  }

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

  async loadProgress() {
    const conceptsWithProgress = await this.api.getConceptsWithProgress()
    runInAction(() => this.conceptsWithProgress = conceptsWithProgress)
  }
}
