import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import _ = require("lodash")
import React = require("react")
import { AppLayout } from "./AppLayout"
import { SunpeepApi } from "./SunpeepApi"
import { observable, runInAction, action } from "mobx"
import { bind } from "decko"

import { Container } from "react-bootstrap"

function ChangeEmailSection() {
    const { api } = useContext(AppContext)
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
        <p>
            Associate a new email address to your Sunpeep account. We'll send a confirmation email to your new address. You are required to click the link in the email to finalize the change.
        </p>
        <form onSubmit={startChangeEmail}>
            <div className="form-group">
                <label>New email address</label>
                <input name="email" type="email" className="form-control" placeholder="Email" required value={state.newEmail} onChange={action(e => state.newEmail = e.currentTarget.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" className="form-control" placeholder="Password" required value={state.newEmailPassword} onChange={action(e => state.newEmailPassword = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit">
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
                <label>New password</label>
                <input name="newPassword" type="password" className="form-control" placeholder="Password" required value={state.newPassword} onChange={action(e => state.newPassword = e.currentTarget.value)} />
            </div>
            <div className="form-group">
                <label>Current password</label>
                <input name="currentPassword" type="password" className="form-control" placeholder="Password" required value={state.currentPassword} onChange={action(e => state.currentPassword = e.currentTarget.value)} />
            </div>
            <button className="btn btn-outline-secondary" type="submit">
                {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined}
                Update password
            </button>
        </form>
    </section>)
}


export function SettingsPage() {
    const { api } = useContext(AppContext)

    useEffect(() => {
        // state.loadUsers()
    }, [])

    return useObserver(() => <AppLayout>
        <main className="SettingsPage">
            <Container>
                <h1>Settings</h1>
                <ChangeEmailSection />
                <ChangePasswordSection />
            </Container>
        </main>
    </AppLayout>)
}