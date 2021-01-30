import * as React from 'react'
import { ProgressStore, SRSProgress } from '../common/SRSProgress'
import { AppContext } from './AppContext'
import { tryParseJson } from '../common/utils'
import { autorun } from 'mobx'
import type { AppStore } from './AppStore'
import type { User } from '../common/types'

// For debug access
declare global {
    interface Window {
        srs: SRSProgress
    }
}

let localSrs: SRSProgress | undefined

export function usePersistentSRS(): { srs: SRSProgress, user?: User } {
    const { app } = React.useContext(AppContext)

    if (localSrs) {
        return { srs: localSrs }
    } else {
        if (app) {
            window.srs = app.srs
            return { srs: app.srs, user: app.user }
        } else {
            localSrs = new SRSProgress()
            const store = tryParseJson(localStorage.getItem('localProgressStore'))
            if (store) {
                localSrs.reconcile(store as ProgressStore)
            }

            // Save changes to local storage
            autorun(() => {
                localStorage.setItem('localProgressStore', localSrs!.jsonStr)
            })

            window.srs = localSrs
            return { srs: localSrs }
        }
    }
}