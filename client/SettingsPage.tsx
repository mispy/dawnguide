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

    async function changeEmail(e: React.FormEvent) {
        e.preventDefault()

        runInAction(() => state.loading = true)
        try {
            await api.changeEmail({ newEmail: state.newEmail, password: state.newEmailPassword })
        } finally {
            runInAction(() => state.loading = false)
        }
    }

    return useObserver(() => <section>
        <h2 id="email">Email</h2>
        <p>
            Associate a new email address to your Sunpeep account. We'll send a confirmation email to your new address. You are required to click the link in the email to finalize the change.
        </p>
        <form onSubmit={changeEmail}>
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
            </Container>
        </main>
    </AppLayout>)
}