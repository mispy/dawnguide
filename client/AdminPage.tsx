import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import _ = require("lodash")
import React = require("react")
import { AppLayout } from "./AppLayout"
import { DawnguideApi } from "./DawnguideApi"
import { observable, runInAction, action } from "mobx"
import { User } from "../shared/types"

// @ts-ignore
import TimeAgo from "react-timeago"
import { Container } from "react-bootstrap"

class AdminPageState {
    @observable users: User[] = []

    constructor(readonly api: DawnguideApi) { }

    async loadUsers() {
        const users = await this.api.admin.getUsers()
        runInAction(() => {
            this.users = _.sortBy(users, u => -u.createdAt)
        })
    }

    async deleteUser(id: string) {
        await this.api.admin.deleteUser(id)
        runInAction(() => {
            this.users = this.users.filter(u => u.id !== id)
        })
    }
}

export function AdminPage() {
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => new AdminPageState(api))

    useEffect(() => {
        state.loadUsers()
    }, [])

    return useObserver(() => <AppLayout>
        <main className="AdminPage">
            <Container>
                <h3>Users</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Signed Up</th>
                            {/* <th>Last Login</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.users.map(user => <tr key={user.id}>
                            <td>{user.email}</td>
                            <td><TimeAgo date={user.createdAt} /></td>
                            {/* <td></td> */}
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => state.deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </Container>
        </main>
    </AppLayout>)
}

// export const AdminPage = () => {
//   const [users, setUsers] = useState<User[]>([])
//   const { api } = useContext(AppContext)

//   async function getUsers() {
//     const conceptsWithProgress = await api.admin.getUsers()
//     const reviews: Review[] = []
//     for (const c of conceptsWithProgress) {
//       if (c.progress && isReadyForReview(c.progress)) {
//         const exercise = _.sample(c.concept.exercises)
//         if (exercise) {
//           reviews.push({ concept: c.concept, exercise: exercise })
//         }
//       }
//     }
//     setReviews(reviews)
//   }

//   useEffect(() => {
//     getUsers()
//   }, [])

//   return <ReviewsUI reviews={reviews} />
// }