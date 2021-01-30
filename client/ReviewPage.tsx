import * as React from 'react'
import { observable, action, makeObservable } from "mobx"

import _ from 'lodash'
import { Observer, useLocalObservable } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { MultiReview } from "./MultiReview"
import { AppLayout } from "./AppLayout"
import { expectAuthed } from '../common/ProgressiveEnhancement'

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
    const { authed } = expectAuthed()
    const state = useLocalObservable(() => new ReviewsState())

    function content() {
        if (!authed.reviews.length)
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

        return <MultiReview reviews={_.shuffle(authed.reviews)} onComplete={state.completeReview} />
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