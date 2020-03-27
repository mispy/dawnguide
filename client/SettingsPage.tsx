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

class SettingsPageState {
    @observable newEmail: string = ""
    @observable newEmailPassword: string = ""

    constructor(readonly api: SunpeepApi) { }

    @bind async changeEmail(e: React.FormEvent) {
        e.preventDefault()

        await this.api.changeEmail({ newEmail: this.newEmail, password: this.newEmailPassword })
    }
}

export function SettingsPage() {
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => new SettingsPageState(api))

    useEffect(() => {
        // state.loadUsers()
    }, [])

    return useObserver(() => <AppLayout>
        <main className="SettingsPage">
            <Container>
                <h1>Settings</h1>
                <section>
                    <h2 id="email">Email</h2>
                    <p>
                        Associate a new email address to your Sunpeep account. We'll send a confirmation email to your new address. You are required to click the link in the email to finalize the change.
                    </p>
                    <form onSubmit={state.changeEmail}>
                        <div className="form-group">
                            <label>New email address</label>
                            <input name="email" type="email" className="form-control" placeholder="Email" required value={state.newEmail} onChange={action(e => state.newEmail = e.currentTarget.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" className="form-control" placeholder="Password" required value={state.newEmailPassword} onChange={action(e => state.newEmailPassword = e.currentTarget.value)} />
                        </div>
                        <button className="btn btn-outline-secondary" type="submit">Update email address</button>
                    </form>
                </section>
            </Container>
        </main>
    </AppLayout>)
}