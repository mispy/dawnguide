import React = require('react')
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import { HomePage } from "./HomePage"
import { LessonPage } from './LessonPage'
import { ReviewPage } from "./ReviewPage"
import { AdminPage } from './AdminPage'
import { AdminEmailsPage } from './AdminEmailsPage'
import { AccountPage } from './AccountPage'
import { NotificationsPage } from './NotificationsPage'
import { ContactPage } from './ContactPage'
import ScrollToTop from './ScrollToTop'
import { content } from '../common/content'

export function AppRouter() {
    return <Router>
        <ScrollToTop />
        <Switch>
            <Route path="/home">
                <HomePage />
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
            {/* <Route path="/subscription">
                <SubscriptionPage />
            </Route> */}
            <Route path="/contact">
                <ContactPage />
            </Route>
            {content.lessonsWithDrafts.map(lesson =>
                <Route key={lesson.id} path={`/${lesson.slug}`}>
                    <LessonPage lesson={lesson} />
                </Route>
            )}
            <Route path="/">
                <Redirect to="/home" />
            </Route>
            {/* TODO 404 */}
        </Switch>
    </Router>
}