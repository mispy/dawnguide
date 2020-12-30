import _ from "lodash"
import { action } from "mobx"
import { useLocalStore, useObserver } from "mobx-react-lite"
import React, { useContext, useEffect } from "react"
import { Review } from "../common/types"
import { AppContext } from "./AppContext"
import { ExerciseView } from "./ExerciseView"

export function CardsEmbed(props: { reviews: Review[] }) {
    const { api } = useContext(AppContext)
    const { reviews } = props
    const state = useLocalStore<{ reviews: Review[], completedIds: string[] }>(() => ({ reviews: _.clone(reviews).reverse(), completedIds: [] }))

    const onCompleteAll = async (exerciseIds: string[]) => {
        await api.completeLesson(exerciseIds)
    }

    useEffect(() => {
        const beforeUnload = () => {
            if (state.reviews.length !== 0 && state.reviews.length !== props.reviews.length) return "Really leave without finishing reviews?"
            else return null
        }

        window.onbeforeunload = beforeUnload
        return () => { window.onbeforeunload = null }
    }, [])

    const onCardComplete = action((remembered: boolean) => {
        if (remembered) {
            const review = state.reviews.pop()
            if (!review) return

            state.completedIds.push(review.exercise.id)
            if (state.reviews.length === 0) {
                onCompleteAll(state.completedIds)
            }
        } else {
            // Didn't remember, push this card to the back
            const review = state.reviews.pop()!
            state.reviews.unshift(review)
        }
    })

    return useObserver(() => {
        const review = state.reviews[state.reviews.length - 1]
        return <div className="CardsEmbed">
            {review ? <ExerciseView lesson={review.lesson} exercise={review.exercise} onSubmit={onCardComplete} /> : undefined}
        </div>
    })
}