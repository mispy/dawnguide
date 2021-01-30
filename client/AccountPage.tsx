import { useContext } from "react"
import { Observer, useLocalObservable } from "mobx-react-lite"
import * as _ from 'lodash'
import * as React from 'react'
import { runInAction, action } from "mobx"
import { SettingsLayout } from "./SettingsLayout"
import { expectAuthed } from "../common/ProgressiveEnhancement"

function ChangeUsernameSection() {
    const { api, user } = expectAuthed()
    const state = useLocalObservable(() => ({ newUsername: "", loading: false }))

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

    return <Observer>{() => <section>
        <h2 id="name">Name</h2>
        <p>Your current name is <strong>{user.username}</strong></p>
        <p>This name is currently just used for addressing you in emails and such. You can update it here.</p>
        <form onSubmit={changeUsername}>
            <div className="form-group">
                <label htmlFor="newUsername">New name</label>
                <input name="newUsername" id="newUsername" type="text" className="form-control" required value={state.newUsername} onChange={action(e => state.newUsername = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit" disabled={state.loading}>
                {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined}
                Update name
            </button>
        </form>
    </section>}</Observer>
}

function ChangeEmailSection() {
    const { api, user } = expectAuthed()
    const state = useLocalObservable(() => ({ newEmail: "", newEmailPassword: "", loading: false }))

    async function startChangeEmail(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.startChangeEmail({ newEmail: state.newEmail, password: state.newEmailPassword })
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return <Observer>{() => <section>
        <h2 id="email">Email</h2>
        <p>Your current email address is <strong>{user.email}</strong></p>
        <p>
            Associate a new email address to your Dawnguide account. We'll send a confirmation email to your new address. You need to click the link in the email to finalize the change.
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
    </section>}</Observer>
}

function ChangePasswordSection() {
    const { api } = expectAuthed()
    const state = useLocalObservable(() => ({ newPassword: "", currentPassword: "", loading: false }))

    async function changePassword(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.changePassword({ newPassword: state.newPassword, currentPassword: state.currentPassword })
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return <Observer>{() => <section>
        <h2 id="password">Password</h2>
        <p>
            A group of angry possums trying to break into your account? Update your password here to keep them away!
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
    </section>}</Observer>
}

export function AccountPage() {
    return <SettingsLayout active="account">
        <div className="AccountPage">
            <ChangeUsernameSection />
            <ChangeEmailSection />
            <ChangePasswordSection />
        </div>
    </SettingsLayout>
}