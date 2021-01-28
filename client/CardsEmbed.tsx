import _ from "lodash"
import { action } from "mobx"
import { useLocalStore, useObserver } from "mobx-react-lite"
import React, { useEffect } from "react"
import type { Review } from "../common/types"
import { ExerciseView } from "../client/ExerciseView"
import { usePersistentSRS } from "../client/ProgressSaving"

export function CardsEmbed(props: { reviews: Review[] }) {
    const srs = usePersistentSRS()
    const { reviews } = props
    const state = useLocalStore<{ reviews: Review[], completedIds: string[] }>(() => ({ reviews: _.clone(reviews).reverse(), completedIds: [] }))

    const onCompleteAll = async (exerciseIds: string[]) => {
        for (const id of exerciseIds) {
            srs.update({ cardId: id, remembered: true })
        }
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