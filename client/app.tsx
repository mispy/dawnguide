import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './app.sass'
import { AppRouter } from './AppRouter'
import { AppContext } from './AppContext'
import { AppStore } from './AppStore'
import { useMemo } from 'react'
import { User } from '../shared/types'

// These props come from AppPage on the server
function App(props: { user: User }) {
    const context = useMemo(() => {
        const app = new AppStore(props.user)

        return {
            app: app,
            api: app.api,
            sunpedia: app.sunpedia,
            user: app.user
        }
    }, [])

    return <AppContext.Provider value={context}>
        <AppRouter />
    </AppContext.Provider>
}

declare const module: any
if (module.hot) {
    module.hot.accept()
}

declare const window: any
window.initApp = (user: User) => {
    ReactDOM.render(<App user={user} />, document.getElementById("root"))
}