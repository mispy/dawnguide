import React from "react"
import { IS_SERVER } from "./settings"
/// #if CLIENT
import { BrowserContext } from "../client/BrowserContext"
import { errors } from "../client/GlobalErrorHandler"
/// #endif

export function useProgressiveEnhancement() {
    /// #if CLIENT
    const { authed, interactive } = React.useContext(BrowserContext)
    /// #endif

    if (IS_SERVER) {
        return {}
    } else if (!interactive) {
        // To make sure initial client render matches SSR, present the same context as server
        // before interactivity is confirmed
        // TODO can global error handler run on server as well?
        return { errors }
    } else {
        return {
            authed,
            user: authed?.user,
            js: interactive,
            srs: authed?.srs || interactive.localSrs,
            errors
        }
    }
}

/** Expect functionality that's available when user is logged in */
export function expectAuthed() {
    const { authed, js, errors } = useProgressiveEnhancement()
    if (!authed || !js || !errors) {
        throw new Error(`Expected to be in interactive authed context with logged in user`)
    }
    return {
        authed: authed,
        user: authed.user,
        api: authed.api,
        srs: authed.srs,
        backgroundApi: authed.backgroundApi,
        js: js,
        errors: errors
    }
}