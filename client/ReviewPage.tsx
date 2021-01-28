import * as React from 'react'
import { observable, action, makeObservable } from "mobx"

import * as _ from 'lodash'
import { useContext } from "react"
import { AppContext } from "./AppContext"
import { Observer, useLocalObservable } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { MultiReview } from "./MultiReview"
import { AppLayout } from "./AppLayout"

class ReviewsState {
    @observable complete: boolean = false

    constructor() {
        makeObservable(this)
    }

    @action.bound completeReview() {
        this.complete = true
    }
}

export function ReviewPage() {
    const { app } = useContext(AppContext)
    const state = useLocalObservable(() => new ReviewsState())

    function content() {
        if (!app.reviews.length)
            return <div>Nothing to review!</div>

        if (state.complete)
            return <div className="d-flex justify-content-center">
                <div>
                    <div className="text-center mb-2">
                        All reviews complete!
        </div>
                    <div>
                        <Link className="btn btn-dawn" to="/home">Home</Link>
                    </div>
                </div>
            </div>

        return <MultiReview reviews={_.shuffle(app.reviews)} onComplete={state.completeReview} />
    }

    return <Observer>{() =>
        <AppLayout title="Reviews" noHeader noFooter>
            <div className="LessonPage">
                <div className="topbar">
                    <Link to="/home">Home</Link>
                </div>

                {content()}
            </div>
        </AppLayout>
    }</Observer>
}