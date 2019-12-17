import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { lessons } from "./lessons"
import { ReviewsUI } from "./ReviewUI"

export const ReviewPage = () => {
    return <ReviewsUI reviews={lessons} />
}