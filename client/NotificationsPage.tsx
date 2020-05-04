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
import { Link } from "react-router-dom"
import { SettingsLayout } from "./SettingsLayout"

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

export function NotificationsPage() {
    return <SettingsLayout active="notifications">
        <div className="NotificationsPage">
            <NotificationsSection />
        </div>
    </SettingsLayout>
}