import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import _ = require("lodash")
import React = require("react")
import { AppLayout } from "./AppLayout"
import { ClientApi } from "./ClientApi"
import { observable, runInAction, action } from "mobx"
import { User } from "../shared/types"

// @ts-ignore
import { Container } from "react-bootstrap"

class AdminPageState {
    @observable users: User[] = []

    constructor(readonly api: ClientApi) { }

    async loadUsers() {
        const users = await this.api.admin.getUsers()
        runInAction(() => {
            this.users = _.sortBy(users, u => -u.createdAt)
        })
    }

    async testConceptEmail(conceptId: string) {
        await this.api.admin.testConceptEmail(conceptId)
        // await this.api.admin.deleteUser(id)
        // runInAction(() => {
        //     this.users = this.users.filter(u => u.id !== id)
        // })
    }

    async emailAllUsers(conceptId: string) {
        // await this.api.admin.emailAllUsersNewConcept(conceptId)
        // await this.api.admin.deleteUser(id)
        // runInAction(() => {
        //     this.users = this.users.filter(u => u.id !== id)
        // })
    }
}

export function AdminEmailsPage() {
    const { api, sunpedia } = useContext(AppContext)
    const state = useLocalStore(() => new AdminPageState(api))

    useEffect(() => {
        state.loadUsers()
    }, [])

    return useObserver(() => <AppLayout>
        <main className="AdminEmailsPage mt-4">
            <Container>
                <h3>Concepts</h3>
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Concept</th>
                            {/* <th>Last Login</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sunpedia.concepts.map(concept => <tr key={concept.id}>
                            <td>{concept.title}</td>
                            {/* <td></td> */}
                            <td>
                                <button className="btn btn-sm btn-outline-dawn mr-2" onClick={() => state.testConceptEmail(concept.id)}>Send Test Email</button>
                                <button className="btn btn-sm btn-dawn" onClick={() => state.emailAllUsers(concept.id)}>Email Everyone</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </Container>
        </main>
    </AppLayout>)
}