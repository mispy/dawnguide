import React = require('react')
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"
import { useContext } from 'react'

import { HomePage } from "./HomePage"
import { LessonPage } from "./LessonPage"
import { ReviewPage } from "./ReviewPage"
import { SubscriptionPage } from "./SubscriptionPage"
import { ConceptPage } from './ConceptPage'
import { AppContext } from './AppContext'
import { AdminPage } from './AdminPage'
import { AdminEmailsPage } from './AdminEmailsPage'
import { AccountPage } from './AccountPage'
import { NotificationsPage } from './NotificationsPage'
import { ContactPage } from './ContactPage'

export function AppRouter() {
    const { sunpedia } = useContext(AppContext)

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
            <Route path="/admin/emails">
                <AdminEmailsPage />
            </Route>
            <Route path="/admin">
                <AdminPage />
            </Route>
            <Route path="/settings">
                <Redirect to="/account" />
            </Route>
            <Route path="/account">
                <AccountPage />
            </Route>
            <Route path="/notifications">
                <NotificationsPage />
            </Route>
            <Route path="/subscription">
                <SubscriptionPage />
            </Route>
            <Route path="/contact">
                <ContactPage />
            </Route>
            {sunpedia.concepts.map(concept =>
                <Route key={concept.id} path={`/concept/${concept.id}`}>
                    <ConceptPage concept={concept} />
                </Route>
            )}
            {/* TODO 404 */}
        </Switch>
    </Router>
}