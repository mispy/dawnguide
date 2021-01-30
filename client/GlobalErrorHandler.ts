import { observable, action, makeObservable } from "mobx"
import * as _ from 'lodash'
import type { User } from "../common/types"
import * as Sentry from '@sentry/browser'
import { SENTRY_DSN_URL } from "./settings"
import type { AxiosError } from "axios"

export class GlobalErrorHandler {
    @observable.ref unexpectedError: Error | null = null
    user?: User // Set this to get user info on sentry reports

    constructor() {
        Sentry.init({ dsn: SENTRY_DSN_URL })

        window.addEventListener("error", ev => {
            this.handleUnexpectedError(ev.error)
            ev.preventDefault()
        })
        window.addEventListener('unhandledrejection', ev => {
            this.handleUnexpectedError(ev.reason)
            ev.preventDefault()
        })

        makeObservable(this)
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
                if (user) {
                    scope.setUser({
                        id: user.id,
                        username: user.username,
                        email: user.email
                    })
                }
                Sentry.captureException(err)
            })
        }
    }
}

export const errors = new GlobalErrorHandler()