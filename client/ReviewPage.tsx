import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { concepts } from "../shared/concepts"

import { ReviewsUI } from "./ReviewUI"
import _ = require("lodash")

export const ReviewPage = () => {
    const reviews = concepts.map(c => ({ concept: c, exercise: c.exercises[0] }))
    return <ReviewsUI reviews={reviews} />
}