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
    const { store } = useContext(AppContext)
    return <ReviewsUI reviews={store.reviews} />
}