import { observable, runInAction, computed, action, toJS, makeObservable, autorun } from "mobx"
import type { Lesson, Review } from "../common/content"
import * as _ from 'lodash'
import { ClientApi } from "./ClientApi"
import { content } from "../common/content"
import type { UserProgressItem, User, Exercise, UserProgress } from "../common/types"
import * as Sentry from '@sentry/browser'
import { SENTRY_DSN_URL } from "./settings"
import type { AxiosError } from "axios"
import { Learny } from "./Learny"
import { ProgressStore, SRSProgress } from "../common/SRSProgress"
import { errors } from "./GlobalErrorHandler"

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

declare global {
    interface Window {
        authed: AuthedState
    }
}

export class AuthedState {
    api: ClientApi
    backgroundApi: ClientApi
    @observable user: User
    @observable progress: UserProgress
    @observable.ref unexpectedError: Error | null = null
    srs: SRSProgress = new SRSProgress()
    learnies: Learny[] = []

    constructor(user: User, progress: UserProgress) {
        this.user = user
        errors.user = user
        this.progress = progress
        window.authed = this

        this.backgroundApi = new ClientApi()
        this.api = this.backgroundApi.with({ nprogress: true })

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

        window.addEventListener("beforeunload", e => {
            // If there's any pending non-GET request in background, ask for confirmation
            // before leaving the page
            if (this.backgroundApi.http.pendingRequests.some(r => r.config.method !== 'GET')) {
                e.preventDefault()
                e.returnValue = ''
            }
        })

        for (const lesson of content.lessons) {
            this.learnies.push(new Learny(lesson, this.srs, false))
        }

        makeObservable(this)
    }

    async loadProgress() {
        // Do it in the background if we already have progress data
        const req = this.progress.progressItems ? this.backgroundApi.getProgress() : this.api.getProgress()
        const progress = await req
        runInAction(() => {
            this.progress = progress

            for (const lessonId in progress.userLessons) {
                const learny = this.learnyByLessonId[lessonId]
                if (learny) {
                    learny.disabled = !!progress.userLessons[lessonId]!.disabled
                }
            }

            const store: ProgressStore = { cards: {} }
            for (const item of progress.progressItems) {
                store.cards[item.exerciseId] = {
                    level: item.level,
                    learnedAt: item.learnedAt,
                    reviewedAt: item.reviewedAt
                }
            }
            this.srs.reconcile(store)
        })
    }

    async reloadUser() {
        const user = await this.api.getCurrentUser()
        runInAction(() => this.user = user)
    }

    learnyForLesson(lessonId: string): Learny {
        const learny = this.learnyByLessonId[lessonId]
        if (!learny) {
            throw new Error(`Unknown lesson id ${lessonId}`)
        }
        return learny
    }

    getLessonAfter(lessonId: string): Lesson | undefined {
        const learny = this.learnyForLesson(lessonId)
        const index = this.learnies.indexOf(learny)
        for (let i = index + 1; i < this.learnies.length; i++) {
            const maybeNext = this.learnies[i]!
            if (!maybeNext.learned) {
                return maybeNext.lesson
            }
        }
        return undefined
    }

    @computed get lessonsAndReviews() {
        return content.getLessonsAndReviews(this.progress.userLessons, this.progress.progressItems)
    }

    @computed get progressByExerciseId() {
        return _.keyBy(this.progress.progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>
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
        const reviews = []
        for (const r of this.srs.upcomingReviews) {
            const exercise = content.getExercise(r.cardId)
            if (!exercise) continue

            const lesson = content.expectLesson(exercise.lessonId)
            reviews.push({
                lesson: lesson,
                exercise: exercise,
                when: r.nextReviewAt
            })
        }

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