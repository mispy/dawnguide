import { observable, runInAction, computed, action } from "mobx"
import { ExerciseWithProgress } from "../shared/logic"
import { Concept } from "../shared/sunpedia"
import _ = require("lodash")
import { DawnguideApi } from "./DawnguideApi"
import { Sunpedia } from "../shared/sunpedia"
import { UserProgressItem } from "../shared/types"

export class AppStore {
    api: DawnguideApi
    sunpedia: Sunpedia
    @observable.ref progressItems: UserProgressItem[] = []
    @observable.ref unexpectedError?: Error

    constructor() {
        this.sunpedia = new Sunpedia()
        this.api = new DawnguideApi(this.sunpedia)

        window.addEventListener("error", ev => {
            this.handleUnexpectedError(ev.error)
            ev.preventDefault()
        })
        window.addEventListener('unhandledrejection', ev => {
            this.handleUnexpectedError(ev.reason)
            ev.preventDefault()
        })
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

    /**
     * Global error handling when all else fails. Our last stand against the darkness.
    */
    @action.bound handleUnexpectedError(err: Error) {
        console.error(err)
        this.unexpectedError = err
    }
}
