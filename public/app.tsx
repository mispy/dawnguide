import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'

import '../client/app.sass'
import { AppRouter } from '../client/AppRouter'
import { AppContext } from '../client/AppContext'
import { AppStore } from '../client/AppStore'
import { useMemo } from 'react'

function App() {
    const context = useMemo(() => {
        const app = new AppStore()

        return {
            app: app,
            api: app.api,
            sunpedia: app.sunpedia
        }
    }, [])

    _.extend(window, context)

    return <AppContext.Provider value={context}>
        <AppRouter />
    </AppContext.Provider>
}

ReactDOM.render(<App />, document.getElementById("root"))

declare const module: any
if (module.hot) {
    module.hot.accept()
}