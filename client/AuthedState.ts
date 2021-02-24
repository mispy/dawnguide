import { observable, runInAction, computed, action, toJS, makeObservable, autorun } from "mobx"
import type { Lesson } from "../common/content"
import * as _ from 'lodash'
import { ClientApi } from "./ClientApi"
import type { UserInfo, UserProgress } from "../common/types"
import * as Sentry from '@sentry/browser'
import { SENTRY_DSN_URL } from "./settings"
import type { AxiosError } from "axios"
import { SRSProgress, SRSProgressStore } from "../common/SRSProgress"
import { errors } from "./GlobalErrorHandler"
import { tryParseJson, overwrite } from "../common/utils"
import { LearnyPlan } from "../common/Learny"

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

export class AuthedUser {
    constructor(readonly userInfo: UserInfo) {
    }
}

export class AuthedState {
    backgroundApi: ClientApi = new ClientApi()
    api: ClientApi = this.backgroundApi.with({ nprogress: true })
    @observable user: UserInfo
    @observable disabledLessons: UserProgress['disabledLessons']
    @observable.ref unexpectedError: Error | null = null
    srs: SRSProgress = new SRSProgress()
    plan: LearnyPlan

    constructor(user: UserInfo, progress: UserProgress) {
        this.user = user
        this.disabledLessons = progress.disabledLessons
        this.srs.overwriteWith(progress.progressStore)
        makeObservable(this)

        // Inform error handler about user context
        errors.user = user

        // If there's any pending non-GET request in background, ask for confirmation
        // before leaving the page
        window.addEventListener("beforeunload", e => {
            if (this.backgroundApi.http.pendingRequests.some(r => r.config.method !== 'GET')) {
                e.preventDefault()
                e.returnValue = ''
            }
        })

        // Pull in any progress that might've happened before the user signed up / logged in
        const store = tryParseJson(localStorage.getItem('localProgressStore')) as SRSProgressStore
        if (store && store.items) {
            const { changedItems } = this.srs.reconcile(store.items)
            if (!_.isEmpty(changedItems)) {
                // Something changed, better tell the server about it too
                this.backgroundApi.reconcileProgress(changedItems)

                // Clear the local storage so it doesn't get assigned to some other user account too
                localStorage.removeItem('localProgressStore')
            }
        }

        // Push SRS changes to the API
        let lastSync = Date.now()
        autorun(() => {
            const { updates } = this.srs
            for (let i = updates.length - 1; i >= 0; i--) {
                const { cardId, remembered, reviewedAt } = updates[i]!
                if (reviewedAt <= lastSync) {
                    break
                } else {
                    this.backgroundApi.srsUpdate(cardId, remembered)
                }
            }

            lastSync = Date.now()
        })

        this.plan = new LearnyPlan(this.srs, this.disabledLessons)
    }

    async loadProgress() {
        const progress = await this.backgroundApi.getProgress()
        runInAction(() => {
            overwrite(this.disabledLessons, progress.disabledLessons)
            this.srs.overwriteWith(progress.progressStore)
        })
    }

    async reloadUser() {
        const user = await this.api.getCurrentUser()
        runInAction(() => this.user = user)
    }

    @computed get admin() {
        return this.user.email === "mispy@mispy.me"
    }

    /** Can this user pick the option to receive drafts? */
    @computed get canReceiveDrafts() {
        return this.user.subscription || this.user.specialStatus
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
