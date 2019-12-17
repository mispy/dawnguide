import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import * as _ from 'lodash'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

import './index.scss'
import { HomePage } from './HomePage'
import { LessonPage } from './LessonPage'
import { ReviewPage } from './ReviewPage'
import { SubscriptionPage } from './SubscriptionPage'

@observer
class App extends React.Component {
    render() {
        return <Router>
            <Switch>
                <Route path="/home">
                    <HomePage />
                </Route>
                <Route path="/lesson">
                    <LessonPage />
                </Route>
                <Route path="/review">
                    <ReviewPage />
                </Route>
                <Route path="/account/subscription">
                    <SubscriptionPage />
                </Route>
                {/* TODO 404 */}
            </Switch>
        </Router>
    }
}

ReactDOM.render(<App />, document.getElementById("root"))