import _ from "lodash"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import { Observer, useLocalObservable } from "mobx-react-lite"
import React from "react"
import type { FillblankExerciseDef, Card } from "../common/types"
import { MemoryCard } from "./MemoryCard"
import type { SRSProgress } from "../common/SRSProgress"
import ReactTimeago from "react-timeago"
import Hanamaru from "../client/Hanamaru"
import { useProgressiveEnhancement } from "../common/ProgressiveEnhancement"

class CardsEmbedState {
    @observable remainingCards: Card[]

    constructor(readonly srs: SRSProgress, readonly allCards: Card[]) {
        this.remainingCards = _.clone(allCards)
        makeObservable(this)
    }

    @computed get learned() {
        return this.allCards.every(c => this.srs.get(c.id))
    }

    @computed get readyForReview() {
        return !!(this.nextReviewAt && this.nextReviewAt <= Date.now())
    }

    @computed get complete() {
        return this.remainingCards.length === 0
        // return this.learned && !this.readyForReview
    }

    @computed get nextCard() {
        return this.complete ? undefined : this.remainingCards[0]
    }

    /** Find the earliest scheduled next review for one of these cards */
    @computed get nextReviewAt(): number | undefined {
        const upcomingReviews = this.srs.upcomingReviews
        const review = upcomingReviews.filter(r => this.allCards.find(c => c.id === r.cardId))[0]
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

            this.srs.update({ cardId: card.id, remembered: true })

            // if (this.remainingCards.length === 0) {
            //     this.onCompleteAll()
            // }
        } else {
            // Didn't remember, push this card to the back
            const review = this.remainingCards.shift()!
            this.remainingCards.push(review)
        }
    }
}

export function CardsEmbed(props: { cards: Card[], initial?: true }) {
    const { srs, user } = useProgressiveEnhancement()
    if (!srs)
        return null

    const { state } = useLocalObservable(() => ({ state: new CardsEmbedState(srs, props.cards) }))

    return <Observer>{() => {
        // We want the embed to have a fixed height that encompasses all the material
        // it needs to show, but no more than that
        const cardLengths = props.cards.map(r => r.question.length)
        const longestLength = _.sortBy(cardLengths, c => -c)[0] || 100
        const height = 350 + Math.max(0, Math.ceil((longestLength / 40) - 3)) * 24

        return <div className="CardsEmbed card" style={{ height: height }}>
            {state.nextCard && <>
                {props.initial && state.allCards.length === state.remainingCards.length
                    ? <header>Let's remember this using the <a href="/spaced-learning">spacing effect</a></header>
                    : <header>{state.remainingCards.length} cards to review</header>}
                <MemoryCard exercise={state.nextCard} onSubmit={state.completeCurrentCard} />
            </>}
            {state.complete && <div className="complete">
                <div>
                    <Hanamaru />
                    {props.cards.length} cards completed
                        {user && <p>Saved to your account {user.email}</p>}
                    {!user && <p><a href="/login">Log in</a> to save your progress</p>}
                    {state.nextReviewAt && <p>Review scheduled: <ReactTimeago date={state.nextReviewAt} /></p>}
                    {!state.nextReviewAt && <>
                        {props.initial && <><p>There are no further reviews scheduled.<br />You've completely mastered this section!</p></>}
                        {!props.initial && <><p>There are no further reviews scheduled for these cards.<br />You've completely mastered them!</p></>}
                    </>}
                </div>
            </div>}
        </div>
    }}</Observer>

}