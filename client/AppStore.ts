import { observable, runInAction, computed, action, toJS } from "mobx"
import { ExerciseWithProgress, getReviewTime } from "../common/logic"
import { Lesson, Review } from "../common/content"
import * as _ from 'lodash'
import { ClientApi } from "./ClientApi"
import { content } from "../common/content"
import { UserProgressItem, User, Exercise } from "../common/types"
import * as Sentry from '@sentry/browser'
import { SENTRY_DSN_URL } from "./settings"
import { AxiosError } from "axios"
import { Learny } from "./Learny"

export type ReviewWithTime = {
    lesson: Lesson
    exercise: Exercise
    when: number
}

export type LessonWithProgress = {
    lesson: Lesson
    learned: boolean
    fracProgress: number
}


export class AppStore {
    api: ClientApi
    backgroundApi: ClientApi
    @observable user: User
    @observable.ref progressItems: UserProgressItem[] | null = null
    @observable.ref unexpectedError?: Error

    constructor(user: User) {
        this.user = user

        this.api = new ClientApi()
        this.backgroundApi = this.api.with({ nprogress: false })

        const w = window as any
        w.user = toJS(user)

        Sentry.init({ dsn: SENTRY_DSN_URL })

        window.addEventListener("error", ev => {
            this.handleUnexpectedError(ev.error)
            ev.preventDefault()
        })
        window.addEventListener('unhandledrejection', ev => {
            this.handleUnexpectedError(ev.reason)
            ev.preventDefault()
        })
    }

    async loadProgress() {
        const progressItems = await this.api.getProgressItems()
        runInAction(() => this.progressItems = progressItems)
    }

    async reloadUser() {
        const user = await this.api.getCurrentUser()
        runInAction(() => this.user = user)
    }

    @computed get loading(): boolean {
        // return true
        return this.progressItems === null
    }

    @computed get lessonsAndReviews() {
        if (this.progressItems === null)
            return { lessons: [], reviews: [] }

        return content.getLessonsAndReviews(this.progressItems)
    }

    @computed get progressByExerciseId() {
        return _.keyBy(this.progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>
    }

    @computed get exercisesWithProgress() {
        const exercisesWithProgress: ExerciseWithProgress[] = []
        for (const exercise of content.exercises) {
            const item = this.progressByExerciseId[exercise.id]

            exercisesWithProgress.push({
                exercise: exercise,
                progress: item
            })
        }

        return exercisesWithProgress
    }

    @computed get learnies() {
        return content.lessons.map(lesson => {
            const ewps = this.exercisesWithProgress.filter(ewp => ewp.exercise.lessonId === lesson.id)
            return new Learny(lesson, ewps)
        })
    }

    @computed get learnyByLessonId() {
        return _.keyBy(this.learnies, p => p.lesson.id)
    }

    // A Lesson is available as a "lesson" if any of its exercises have no progress
    // and the conditions for unlocking it are met (currently none)
    // Generally either all or none will be, but it's conceivable that we add more
    // exercises to an existing lesson, in which case it goes back in the queue
    @computed get lessonLessons(): Lesson[] {
        return this.lessonsAndReviews.lessons
    }

    @computed get nextLesson(): Lesson | undefined {
        return this.lessonLessons[0]
    }

    @computed get numLessons(): number {
        return this.lessonLessons.length
    }

    @computed get reviews(): Review[] {
        return this.lessonsAndReviews.reviews
    }

    @computed get numReviews(): number {
        return this.reviews.length
    }

    @computed get nextReview(): Review | undefined {
        return this.reviews[0]
    }

    @computed get upcomingReviews() {
        const reviews = this.exercisesWithProgress.map(ex => {
            return {
                lesson: content.expectLesson(ex.exercise.lessonId),
                exercise: ex.exercise,
                when: ex.progress ? getReviewTime(ex.progress) : Infinity
            }
        }).filter(d => isFinite(d.when))

        return _.sortBy(reviews, d => d.when)
    }

    /**
     * Global error handling when all else fails. Our last stand against the darkness.
     */
    @action.bound handleUnexpectedError(err: Error) {
        const maybeAxios = err as AxiosError
        if (maybeAxios.response?.status === 401) {
            const current = `${window.location.pathname}${window.location.search}`
            window.location.replace(`/login?then=${encodeURIComponent(current)}`)
            return
        }

        console.error(err)
        this.unexpectedError = err

        if (SENTRY_DSN_URL) {
            Sentry.withScope(scope => {
                const { user } = this

                scope.setUser({
                    id: user.id,
                    username: user.username,
                    email: user.email
                })

                Sentry.captureException(err)
            })
        }
    }
}
