import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import _ = require("lodash")
import React = require("react")
import { AppLayout } from "./AppLayout"
import { observable, runInAction, action } from "mobx"
import { Container } from "react-bootstrap"
import { User, UserNotificationSettings } from "../shared/types"
import { ClientApi } from "./ClientApi"

function ChangeUsernameSection() {
    const { api, user } = useContext(AppContext)
    const state = useLocalStore(() => ({ newUsername: "", loading: false }))

    async function changeUsername(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.changeUsername({ newUsername: state.newUsername })
            runInAction(() => user.username = state.newUsername)
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return useObserver(() => <section>
        <h2 id="username">Username</h2>
        <p>Your current username is <strong>{user.username}</strong></p>
        <p>Change your username. Your username must be alphanumeric (underscores are okay) and between 3 and 20 characters.</p>
        <form onSubmit={changeUsername}>
            <div className="form-group">
                <label htmlFor="newUsername">New username</label>
                <input name="newUsername" id="newUsername" type="text" className="form-control" placeholder="Username" required value={state.newUsername} onChange={action(e => state.newUsername = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit" disabled={state.loading}>
                {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined}
                Update username
            </button>
        </form>
    </section>)
}

function ChangeEmailSection() {
    const { api, user } = useContext(AppContext)
    const state = useLocalStore(() => ({ newEmail: "", newEmailPassword: "", loading: false }))

    async function startChangeEmail(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.startChangeEmail({ newEmail: state.newEmail, password: state.newEmailPassword })
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return useObserver(() => <section>
        <h2 id="email">Email</h2>
        <p>Your current email address is <strong>{user.email}</strong></p>
        <p>
            Associate a new email address to your Dawnguide account. We'll send a confirmation email to your new address. You are required to click the link in the email to finalize the change.
        </p>
        <form onSubmit={startChangeEmail}>
            <div className="form-group">
                <label htmlFor="newEmail">New email address</label>
                <input name="newEmail" id="newEmail" type="email" className="form-control" placeholder="Email" required value={state.newEmail} onChange={action(e => state.newEmail = e.currentTarget.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="emailChangePassword">Password</label>
                <input name="password" id="emailChangePassword" type="password" className="form-control" placeholder="Password" required value={state.newEmailPassword} onChange={action(e => state.newEmailPassword = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit" disabled={state.loading}>
                {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined}
                Update email address
            </button>
        </form>
    </section>)
}

function ChangePasswordSection() {
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => ({ newPassword: "", currentPassword: "", loading: false }))

    async function changePassword(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.changePassword({ newPassword: state.newPassword, currentPassword: state.currentPassword })
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return useObserver(() => <section>
        <h2 id="password">Password</h2>
        <p>
            A group of angry possums trying to break into your account? Update your password here to keep them away!
            {/* We'll send a confirmation email to your new address. You are required to click the link in the email to finalize the change. */}
        </p>
        <form onSubmit={changePassword}>
            <div className="form-group">
                <label htmlFor="newPassword">New password</label>
                <input name="newPassword" id="newPassword" type="password" className="form-control" placeholder="Password" required value={state.newPassword} onChange={action(e => state.newPassword = e.currentTarget.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="changePasswordCurrentPassword">Current password</label>
                <input name="currentPassword" id="changePasswordCurrentPassword" type="password" className="form-control" placeholder="Password" required value={state.currentPassword} onChange={action(e => state.currentPassword = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit" disabled={state.loading}>
                {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined}
                Update password
            </button>
        </form>
    </section>)
}


class NotificationsSectionState {
    @observable settings?: UserNotificationSettings

    constructor(readonly api: ClientApi) { }

    async loadSettings() {
        const settings = await this.api.getNotificationSettings()
        runInAction(() => {
            this.settings = settings
        })
    }

    @action update(changes: Partial<UserNotificationSettings>) {
        Object.assign(this.settings, changes)
        this.api.updateNotificationSettings(changes)
    }
}
function NotificationsSection() {
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => new NotificationsSectionState(api))

    useEffect(() => {
        state.loadSettings()
    }, [])

    function renderLoaded(settings: UserNotificationSettings) {
        return <>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.emailAboutNewConcepts} disabled={settings.disableNotificationEmails}
                    onChange={e => state.update({ emailAboutNewConcepts: e.currentTarget.checked })} id="emailAboutNewConcepts" />
                <label className="form-check-label" htmlFor="emailAboutNewConcepts">
                    New concept emails
                    <aside className="text-secondary">Get an email when we release a new concept to learn</aside>
                </label>
            </div><br />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.emailAboutWeeklyReviews} disabled={settings.disableNotificationEmails}
                    onChange={e => state.update({ emailAboutWeeklyReviews: e.currentTarget.checked })} id="emailAboutWeeklyReviews" />
                <label className="form-check-label" htmlFor="emailAboutWeeklyReviews">
                    Weekly review emails
                    <aside className="text-secondary">Get an email each week if you have reviews to complete</aside>
                </label>
            </div><br />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.disableNotificationEmails}
                    onChange={e => state.update({ disableNotificationEmails: e.currentTarget.checked })} id="disableNotificationEmails" />
                <label className="form-check-label" htmlFor="disableNotificationEmails">
                    Disable all non-transactional emails
                    <aside className="text-secondary">Dawnguide will never send you notification emails</aside>
                </label>
            </div>
        </>
    }

    return useObserver(() => <section>
        <h2 id="notifications">Notifications</h2>
        {state.settings ? renderLoaded(state.settings) : "Loading..."}
    </section>)
}

export function SettingsPage() {
    const { api } = useContext(AppContext)

    return useObserver(() => <AppLayout>
        <main className="SettingsPage">
            <Container>
                <h1>Settings</h1>
                <ChangeUsernameSection />
                <ChangeEmailSection />
                <ChangePasswordSection />
                <NotificationsSection />
            </Container>
        </main>
    </AppLayout>)
}