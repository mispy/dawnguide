import { SRSProgressStore, SRSProgress } from '../common/SRSProgress'
import { tryParseJson } from '../common/utils'
import { autorun } from 'mobx'
import type { AuthedState } from './AuthedState'

/** 
 * This provides an interface to functionality that's available
 * in an interactive client-side js context, i.e. after SSR and after
 * initial hydration render.
 **/
export class InteractiveState {
    window: Window & typeof globalThis
    srs: SRSProgress

    constructor(readonly authed?: AuthedState) {
        this.window = window

        if (authed) {
            this.srs = authed.srs
        } else {
            // No progress from server provided, read from local storage
            this.srs = new SRSProgress()

            const store = tryParseJson(localStorage.getItem('localProgressStore')) as Partial<SRSProgressStore>
            if (store && store.items) {
                this.srs.overwriteWith(store as SRSProgressStore)
            }

            // Save changes to local storage
            autorun(() => {
                localStorage.setItem('localProgressStore', this.srs.jsonStr)
            })
        }

        // makeObservable(this)
    }
}

