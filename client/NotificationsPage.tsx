import { useEffect } from "react"
import { Observer, useLocalObservable } from "mobx-react-lite"
import _ from 'lodash'
import * as React from 'react'
import { observable, runInAction, action, makeObservable } from "mobx"
import type { UserNotificationSettings } from "../common/types"
import type { ClientApi } from "./ClientApi"
import { SettingsLayout } from "./SettingsLayout"
import { expectAuthed } from "../common/ProgressiveEnhancement"

class NotificationsSectionState {
    @observable settings: UserNotificationSettings | null = null

    constructor(readonly api: ClientApi) {
        makeObservable(this)
    }

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
    const { authed, api } = expectAuthed()
    const state = useLocalObservable(() => new NotificationsSectionState(api))

    useEffect(() => {
        state.loadSettings()
    }, [])

    function renderLoaded(settings: UserNotificationSettings) {
        return <>
            {authed.canReceiveDrafts && <><div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.emailAboutNewDrafts} disabled={settings.disableNotificationEmails}
                    onChange={e => state.update({ emailAboutNewDrafts: e.currentTarget.checked })} id="emailAboutNewDrafts" />
                <label className="form-check-label" htmlFor="emailAboutNewDrafts">
                    New draft emails
                    <aside className="text-secondary">Get a preview email to give feedback on draft content before it is released</aside>
                </label>
            </div><br /></>}
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.emailAboutNewConcepts} disabled={settings.disableNotificationEmails}
                    onChange={e => state.update({ emailAboutNewConcepts: e.currentTarget.checked })} id="emailAboutNewConcepts" />
                <label className="form-check-label" htmlFor="emailAboutNewConcepts">
                    New lesson emails
                    <aside className="text-secondary">Get an email when we release a new lesson to learn</aside>
                </label>
            </div><br />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={settings.emailAboutWeeklyReviews} disabled={settings.disableNotificationEmails}
                    onChange={e => state.update({ emailAboutWeeklyReviews: e.currentTarget.checked })} id="emailAboutWeeklyReviews" />
                <label className="form-check-label" htmlFor="emailAboutWeeklyReviews">
                    Review reminder emails
                    <aside className="text-secondary">Get a reminder email when you have reviews to complete</aside>
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

    return <Observer>{() => <section>
        <h2 id="notifications">Notifications</h2>
        {state.settings ? renderLoaded(state.settings) : "Loading..."}
    </section>}</Observer>
}

export function NotificationsPage() {
    return <SettingsLayout active="notifications">
        <div className="NotificationsPage">
            <NotificationsSection />
        </div>
    </SettingsLayout>
}