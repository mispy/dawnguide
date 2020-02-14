import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { concepts, Concept, Exercise } from "../shared/concepts"

import { ReviewsUI } from "./ReviewsUI"
import _ = require("lodash")
import { useState, useContext, useEffect } from "react"
import { AppContext } from "./context"
import { ConceptWithProgress, isReadyForReview } from "../shared/logic"

interface Review {
    concept: Concept,
    exercise: Exercise
}

export const ReviewPage = () => {
    const [reviews, setReviews] = useState<Review[] | null>(null)
    const { api } = useContext(AppContext)

    async function getReviews() {
        const conceptsWithProgress = await api.getConceptsWithProgress()
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
        getReviews()
    }, [])

    return reviews === null ? <div>Loading</div> : <ReviewsUI reviews={reviews} />
}