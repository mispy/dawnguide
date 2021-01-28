import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import * as _ from 'lodash'
import * as React from 'react'
import { AppLayout } from "./AppLayout"
import { ClientApi } from "./ClientApi"
import { observable, runInAction, action, makeObservable } from "mobx"
import { User } from "../common/types"
import { content } from "../common/content"

// @ts-ignore
import { Container } from "react-bootstrap"

class AdminPageState {
    @observable users: User[] = []

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
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => new AdminPageState(api))

    useEffect(() => {
        state.loadUsers()
    }, [])

    return useObserver(() => <AppLayout>
        <main className="AdminEmailsPage mt-4">
            <Container>
                <h3>Lessons</h3>
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
            </Container>
        </main>
    </AppLayout>)
}