import * as React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import { HomePage } from "./HomePage"
import { LessonPage } from './LessonPage'
import { ReviewPage } from "./ReviewPage"
import { AdminUsersPage } from './AdminUsersPage'
import { AdminEmailsPage } from './AdminEmailsPage'
import { AccountPage } from './AccountPage'
import { NotificationsPage } from './NotificationsPage'
import { ContactPage } from './ContactPage'
import ScrollToTop from './ScrollToTop'
import { content } from '../common/content'
import { SubscriptionPage } from './SubscriptionPage'
import { MemoriesPage } from './MemoriesPage'

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
                <AdminUsersPage />
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
            <Route path="/memories">
                <MemoriesPage />
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