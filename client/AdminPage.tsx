import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import { useLocalStore, useObserver } from "mobx-react-lite"
import React = require("react")
import { AppLayout } from "./AppLayout"
import { SunpeepApi } from "./SunpeepApi"
import { observable, runInAction } from "mobx"
import { User } from "../shared/types"

class AdminPageState {
    @observable users: User[] = []

    constructor(readonly api: SunpeepApi) { }

    async loadUsers() {
        const users = await this.api.admin.getUsers()
        runInAction(() => this.users = users)
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