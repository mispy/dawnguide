import { ProgressStore, SRSProgress } from '../common/SRSProgress'
import { tryParseJson } from '../common/utils'
import { autorun } from 'mobx'

/** 
 * This provides an interface to functionality that's only available
 * in an interactive client-side js context, i.e. after SSR and after
 * initial hydration render.
 **/
export class InteractiveState {
    window: Window & typeof globalThis
    localSrs: SRSProgress

    constructor() {
        this.window = window

        this.localSrs = new SRSProgress()
        const store = tryParseJson(localStorage.getItem('localProgressStore'))
        if (store) {
            this.localSrs.reconcile(store as ProgressStore)
        }

        // Save changes to local storage
        autorun(() => {
            localStorage.setItem('localProgressStore', this.localSrs.jsonStr)
        })

        // makeObservable(this)
    }
}

