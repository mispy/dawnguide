import _ from "lodash"
import { action, computed, makeObservable, observable } from "mobx"
import { Observer, useLocalObservable } from "mobx-react-lite"
import React from "react"
import type { FillblankExerciseDef, Review } from "../common/types"
import { usePersistentSRS } from "../client/ProgressSaving"
import { MemoryCard } from "./MemoryCard"
import type { SRSProgress } from "../common/SRSProgress"
import ReactTimeago from "react-timeago"
import Hanamaru from "../client/Hanamaru"

class CardsEmbedState {
    @observable remainingCards: Review[]
    @observable rememberedIds: string[] = []

    constructor(readonly srs: SRSProgress, readonly allCards: Review[]) {
        this.remainingCards = _.clone(allCards)
        makeObservable(this)
    }

    /** Find the earliest scheduled next review for one of these cards */
    @computed get nextReviewAt(): number | undefined {
        const upcomingReviews = this.srs.upcomingReviews
        const review = upcomingReviews.filter(r => this.allCards.find(c => c.exercise.id === r.cardId))[0]
        if (review) {
            return review.nextReviewAt
        } else {
            return undefined
        }
    }

    @action.bound completeCurrentCard(remembered: boolean) {
        if (remembered) {
            const card = this.remainingCards.shift()
            if (!card) return

            this.rememberedIds.push(card.exercise.id)
            if (this.remainingCards.length === 0) {
                this.onCompleteAll()
            }
        } else {
            // Didn't remember, push this card to the back
            const review = this.remainingCards.shift()!
            this.remainingCards.push(review)
        }
    }

    @action.bound onCompleteAll() {
        for (const id of this.rememberedIds) {
            this.srs.update({ cardId: id, remembered: true })
        }
    }
}

export function CardsEmbed(props: { reviews: Review[] }) {
    const { srs, user } = usePersistentSRS()
    const { state } = useLocalObservable(() => ({ state: new CardsEmbedState(srs, props.reviews) }))

    return <Observer>{() => {
        // We want the embed to have a fixed height that encompasses all the material
        // it needs to show, but no more than that
        const cardLengths = props.reviews.map(r => (r.exercise as FillblankExerciseDef).question.length)
        const longestLength = _.sortBy(cardLengths, c => -c)[0] || 100
        const height = longestLength * 4

        const card = state.remainingCards.length > 0 ? state.remainingCards[0] : undefined
        return <div className="CardsEmbed card" style={{ height: height }}>
            {card
                ? <MemoryCard lesson={card.lesson} exercise={card.exercise} onSubmit={state.completeCurrentCard} />
                : <div className="complete">
                    <div>
                        <Hanamaru />
                        {props.reviews.length} cards completed
                        {user && <p>Saved to your account {user.email}</p>}
                        {!user && <p><a href="/login">Log in</a> to save your progress</p>}
                        {state.nextReviewAt && <p>Review scheduled: <ReactTimeago date={state.nextReviewAt} /></p>}
                        {!state.nextReviewAt && <><p>There are no further reviews scheduled.<br />You've completely mastered this section!</p></>}
                    </div>
                </div>}
        </div>
    }}</Observer>

}