import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import * as _ from 'lodash'

import './app.sass'
import { AppRouter } from './AppRouter'
import { SunpeepApi } from './SunpeepApi'
import { AppContext } from './context'
import { AppStore } from './AppStore'

@observer
class App extends React.Component {
    render() {
        const api = new SunpeepApi()
        const context = {
            api: api,
            store: new AppStore(api)
        }

        _.extend(window, context)

        return <AppContext.Provider value={context}>
            <AppRouter />
        </AppContext.Provider>
    }
}

ReactDOM.render(<App />, document.getElementById("root"))

declare const module: any
if (module.hot) {
    module.hot.accept()
}