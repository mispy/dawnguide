import * as React from 'react'
import { observable, action, makeObservable, computed } from "mobx"

import _ from 'lodash'
import { Observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { expectAuthed } from '../common/ProgressiveEnhancement'
import { CardsEmbed } from './CardsEmbed'

export function ReviewPage() {
    const { plan } = expectAuthed()

    const cards = _.clone(plan.cardsToReview)

    return <Observer>{() => {
        return <AppLayout title="Reviews" noHeader noFooter>
            <div className="ReviewPage">
                <div className="topbar">
                    <Link to="/home">Home</Link>
                </div>

                <div className="cardsContainer">
                    <CardsEmbed cards={cards} />
                </div>
            </div>
        </AppLayout>
    }}</Observer>
}