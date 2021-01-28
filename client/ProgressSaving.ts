import * as React from 'react'
import { ProgressStore, SRSProgress } from '../common/SRSProgress'
import { AppContext } from './AppContext'
import { tryParseJson } from '../common/utils'
import { autorun } from 'mobx'

// For debug access
declare global {
    interface Window {
        srs: SRSProgress
    }
}

let localSrs: SRSProgress | undefined

export function usePersistentSRS(): SRSProgress {
    const { app } = React.useContext(AppContext)

    if (localSrs) {
        return localSrs
    } else {
        if (app) {
            window.srs = app.srs
            return app.srs
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
            return localSrs
        }
    }
}