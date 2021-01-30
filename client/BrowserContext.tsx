import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import * as React from 'react'
import type { AuthedState } from "../client/AuthedState"
import { InteractiveState } from '../client/InteractiveState'

export const BrowserContext: React.Context<{ authed?: AuthedState, interactive?: InteractiveState }> = React.createContext({})

export const BrowserContextProvider = (props: { authed?: AuthedState, children: any }) => {
    const state = useLocalObservable(() => ({ authed: props.authed } as { authed?: AuthedState, interactive?: InteractiveState }))

    if (props.authed) {
        // Go straight to interactive
        runInAction(() => state.interactive = new InteractiveState())
    } else {
        React.useEffect(() => {
            runInAction(() => state.interactive = new InteractiveState())
        }, [])
    }

    return <BrowserContext.Provider value={state}>
        {props.children}
    </BrowserContext.Provider>
}