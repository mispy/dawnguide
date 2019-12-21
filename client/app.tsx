import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import * as _ from 'lodash'

import './app.scss'
import { AppRouter } from './AppRouter'
import { SunpeepApi } from './SunpeepAPI'
import { AppContext } from './context'

@observer
class App extends React.Component {
    render() {
        const context = {
            api: new SunpeepApi()
        }
        return <AppContext.Provider value={context}>
            <AppRouter />
        </AppContext.Provider>
    }
}

ReactDOM.render(<App />, document.getElementById("root"))