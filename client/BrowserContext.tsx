import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import * as React from 'react'
import type { AuthedState } from "../client/AuthedState"
import { InteractiveState } from '../client/InteractiveState'

type BrowserContextType = {
    authed?: AuthedState
    interactive?: InteractiveState
}

export const BrowserContext: React.Context<BrowserContextType> = React.createContext({})

export const BrowserContextProvider = (props: { authed?: AuthedState, children: any }) => {
    const { authed } = props
    const state = useLocalObservable(() => ({ authed } as BrowserContextType))

    if (authed) {
        // Go straight to interactive
        runInAction(() => state.interactive = new InteractiveState(authed))
    } else {
        React.useEffect(() => {
            runInAction(() => state.interactive = new InteractiveState())
        }, [])
    }

    return <BrowserContext.Provider value={state}>
        {props.children}
    </BrowserContext.Provider>
}