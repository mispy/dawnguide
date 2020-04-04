import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'

import '../client/app.sass'
import { AppRouter } from '../client/AppRouter'
import { AppContext } from '../client/AppContext'
import { AppStore } from '../client/AppStore'
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

    _.extend(window, context)

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