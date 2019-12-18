import React = require('react')
import { observer } from "mobx-react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import { HomePage } from "./HomePage"
import { LessonPage } from "./LessonPage"
import { ReviewPage } from "./ReviewPage"
import { SubscriptionPage } from "./SubscriptionPage"

@observer
export class AppRouter extends React.Component {
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
                <Route path="/account/subscribe">
                    <SubscriptionPage />
                </Route>
                {/* TODO 404 */}
            </Switch>
        </Router>
    }
}