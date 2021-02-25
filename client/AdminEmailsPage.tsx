import { useEffect } from "react"
import { Observer, useLocalObservable, useObserver } from "mobx-react-lite"
import * as _ from 'lodash'
import * as React from 'react'
import { AppLayout } from "./AppLayout"
import type { ClientApi } from "./ClientApi"
import { observable, runInAction, action, makeObservable, computed } from "mobx"
import type { UserAdminReport, UserInfo } from "../common/types"
import { content } from "../common/content"

// @ts-ignore
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
            this.users = _.sortBy(users, u => -u.createdAt)
        })
    }

    async testLessonEmail(lessonId: string) {
        await this.api.admin.testLessonEmail(lessonId)
    }

    async testReviewsEmail() {
        await this.api.admin.testReviewsEmail()
    }

    async emailEveryone(lessonId: string) {
        if (window.confirm(`Really email everyone about ${lessonId}?`)) {
            await this.api.admin.emailEveryone(lessonId)
        }
    }
}

export function AdminEmailsPage() {
    const { api } = expectAuthed()
    const state = useLocalObservable(() => new AdminPageState(api))

    useEffect(() => {
        state.loadUsers()
    }, [])

    return <Observer>{() => <AdminLayout active="emails">
        <Container className="AdminEmailsPage">
            <section>
                <h3>Emails</h3>
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Lesson</th>
                            {/* <th>Last Login</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.lessons.map(lesson => <tr key={lesson.id}>
                            <td>{lesson.title}</td>
                            {/* <td></td> */}
                            <td>
                                <button className="btn btn-sm btn-outline-dawn mr-2" onClick={() => state.testLessonEmail(lesson.id)}>Send Test Email</button>
                                <button className="btn btn-sm btn-dawn" onClick={() => state.emailEveryone(lesson.id)}>Email Everyone</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <button className="btn btn-sm btn-outline-dawn" onClick={() => state.testReviewsEmail()}>Test Reviews Email</button>
            </section>
        </Container>
    </AdminLayout>}</Observer>
}