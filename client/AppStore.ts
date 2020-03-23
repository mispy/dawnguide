import { observable, runInAction, computed } from "mobx"
import { ExerciseWithProgress, isReadyForReview } from "../shared/logic"
import { Concept, Exercise } from "../shared/sunpedia"
import _ = require("lodash")
import { SunpeepApi } from "./SunpeepApi"
import { Sunpedia } from "../shared/sunpedia"

export class AppStore {
  api: SunpeepApi
  sunpedia: Sunpedia
  @observable exercisesWithProgress: ExerciseWithProgress[] = []

  constructor() {
    this.sunpedia = new Sunpedia()
    this.api = new SunpeepApi(this.sunpedia)
  }

  @computed get loading(): boolean {
    return !this.exercisesWithProgress.length
  }

  @computed get exercisesWithProgressById() {
    return _.keyBy(this.exercisesWithProgress, c => c.exercise.id)
  }

  // A concept is available as a "lesson" if any of its exercises have no progress
  // and the conditions for unlocking it are met (currently none)
  // Generally either all or none will be, but it's conceivable that we add more
  // exercises to an existing lesson, in which case it goes back in the queue
  @computed get lessonConcepts(): Concept[] {
    const conceptIdsToLearn = []
    const byConcept = _.groupBy(this.exercisesWithProgress, e => e.exercise.conceptId)
    for (const conceptId in byConcept) {
      const ewps = byConcept[conceptId]
      if (ewps.some(ewp => !ewp.progress)) {
        conceptIdsToLearn.push(conceptId)
      }
    }

    return conceptIdsToLearn.map(id => this.sunpedia.conceptById[id])
  }

  @computed get numLessons() {
    return this.lessonConcepts.length
  }

  @computed get reviews() {
    const reviews: { concept: Concept, exercise: Exercise }[] = []
    for (const e of this.exercisesWithProgress) {
      if (e.progress && isReadyForReview(e.progress)) {
        const concept = this.sunpedia.conceptById[e.exercise.conceptId]
        reviews.push({ concept: concept, exercise: e.exercise })
      }
    }
    return reviews
  }

  @computed get numReviews() {
    return this.reviews.length
  }

  async loadProgress() {
    const exercisesWithProgress = await this.api.getExercisesWithProgress()
    runInAction(() => this.exercisesWithProgress = exercisesWithProgress)
  }
}
