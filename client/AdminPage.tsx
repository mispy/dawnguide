import { useContext, useState, useEffect } from "react"
import { AppContext } from "./AppContext"

export const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const { api } = useContext(AppContext)

  async function getUsers() {
    const conceptsWithProgress = await api.admin.getUsers()
    const reviews: Review[] = []
    for (const c of conceptsWithProgress) {
      if (c.progress && isReadyForReview(c.progress)) {
        const exercise = _.sample(c.concept.exercises)
        if (exercise) {
          reviews.push({ concept: c.concept, exercise: exercise })
        }
      }
    }
    setReviews(reviews)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return <ReviewsUI reviews={reviews} />
}