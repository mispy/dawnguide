import React = require("react")
import { observable, action, computed } from "mobx"

import _ = require("lodash")
import { useContext } from "react"
import { AppContext } from "./AppContext"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { MultiReview } from "./MultiReview"
import { AppLayout } from "./AppLayout"

class ReviewsState {
  @observable complete: boolean = false

  @action.bound completeReview() {
    this.complete = true
  }
}

export function ReviewPage() {
  const { store } = useContext(AppContext)
  const state = useLocalStore(() => new ReviewsState())

  function content() {
    if (store.loading)
      return <div>Loading...</div>

    if (!store.reviews.length)
      return <div>Nothing to review!</div>

    if (state.complete)
      return <div className="d-flex justify-content-center">
        <div>
          <div className="text-center mb-2">
            All reviews complete!
        </div>
          <div>
            <Link className="btn btn-sun" to="/home">Home</Link>
          </div>
        </div>
      </div>

    return <MultiReview reviews={store.reviews} onComplete={state.completeReview} />
  }

  return useObserver(() =>
    <AppLayout noHeader>
      <div className="LessonPage">
        <div className="topbar">
          <Link to="/home">Home</Link>
        </div>

        {content()}
      </div>
    </AppLayout>
  )
}