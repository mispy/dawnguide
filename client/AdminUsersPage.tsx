import { useEffect } from "react"
import { Observer, useLocalObservable } from "mobx-react-lite"
import * as _ from 'lodash'
import * as React from 'react'
import type { ClientApi } from "./ClientApi"
import { observable, runInAction, makeObservable } from "mobx"
import type { UserInfo, UserAdminReport } from "../common/types"

// @ts-ignore
import TimeAgo from "react-timeago"
import { Container } from "react-bootstrap"
import { expectAuthed } from "../common/ProgressiveEnhancement"
import { AdminLayout } from "./AdminLayout"

class AdminPageState {
    @observable users: UserAdminReport[] = []

    constructor(readonly api: ClientApi) {
        makeObservable(this)
    }

    async loadUsers() {
        const users = await this.api.admin.getUsers()
        runInAction(() => {
            this.users = _.sortBy(users, u => -u.meanLevel)
        })
    }

    async deleteUser(user: UserInfo) {
        if (window.confirm(`Really delete ${user.email}?`)) {
            await this.api.admin.deleteUser(user.id)
            runInAction(() => {
                this.users = this.users.filter(u => u.id !== user.id)
            })
        }
    }
}

export function AdminUsersPage() {
    const { api } = expectAuthed()
    const state = useLocalObservable(() => new AdminPageState(api))

    useEffect(() => {
        state.loadUsers()
    }, [])

    return <Observer>{() => <AdminLayout active="users">
        <main className="AdminPage">
            <Container>
                <section>
                    <h3>Users</h3>
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Signed Up</th>
                                <th>Last Seen</th>
                                <th>Lessons Studied</th>
                                <th>Mean Level</th>
                                <th>Notifications</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.users.map(user => {
                                const notifs = user.notificationSettings
                                let notifStatus = "Disabled"
                                if (!notifs.disableNotificationEmails) {
                                    if (notifs.emailAboutNewConcepts && notifs.emailAboutWeeklyReviews) {
                                        notifStatus = "Everything"
                                    } else if (notifs.emailAboutNewConcepts) {
                                        notifStatus = "New Lessons Only"
                                    } else {
                                        notifStatus = "Reviews Only"
                                    }
                                }
                                return <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td><TimeAgo date={user.createdAt} /></td>
                                    <td><TimeAgo date={user.lastSeenAt} /></td>
                                    <td>{user.lessonsStudied}</td>
                                    <td>{user.meanLevel.toFixed(2)}</td>
                                    <td>{notifStatus}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => state.deleteUser(user)}>Delete</button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </section>
            </Container>
        </main>
    </AdminLayout>}</Observer>
}