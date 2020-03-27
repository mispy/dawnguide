import { observable, runInAction, computed } from "mobx"
import { ExerciseWithProgress, isReadyForReview } from "../shared/logic"
import { Concept, Exercise } from "../shared/sunpedia"
import _ = require("lodash")
import { SunpeepApi } from "./SunpeepApi"
import { Sunpedia } from "../shared/sunpedia"
import { UserProgressItem } from "../shared/types"

export class AppStore {
    api: SunpeepApi
    sunpedia: Sunpedia
    @observable progressItems: UserProgressItem[] = []

    constructor() {
        this.sunpedia = new Sunpedia()
        this.api = new SunpeepApi(this.sunpedia)
    }

    @computed get loading(): boolean {
        return !this.exercisesWithProgress.length
    }

    @computed get lessonsAndReviews() {
        return this.sunpedia.getLessonsAndReviews(this.progressItems)
    }

    @computed get exercisesWithProgress() {
        const progressByExerciseId = _.keyBy(this.progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>

        const exercisesWithProgress: ExerciseWithProgress[] = []
        for (const exercise of this.sunpedia.exercises) {
            const item = progressByExerciseId[exercise.id]

            exercisesWithProgress.push({
                exercise: exercise,
                progress: item
            })
        }

        return exercisesWithProgress
    }

    // A concept is available as a "lesson" if any of its exercises have no progress
    // and the conditions for unlocking it are met (currently none)
    // Generally either all or none will be, but it's conceivable that we add more
    // exercises to an existing lesson, in which case it goes back in the queue
    @computed get lessonConcepts(): Concept[] {
        return this.lessonsAndReviews.lessons
    }

    @computed get numLessons() {
        return this.lessonConcepts.length
    }

    @computed get reviews() {
        return this.lessonsAndReviews.reviews
    }

    @computed get numReviews() {
        return this.reviews.length
    }

    async loadProgress() {
        const progressItems = await this.api.getProgressItems()
        runInAction(() => this.progressItems = progressItems)
    }
}
