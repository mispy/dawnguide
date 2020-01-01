import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import _ = require("lodash")
import { Exercise, Concept } from "../shared/concepts"
import { AppContext } from "./context"

interface ExerciseWithConcept {
    concept: Concept
    exercise: Exercise
}

@observer
export class ReviewsUI extends React.Component<{ reviews: ExerciseWithConcept[] }> {
    @observable response: string = ""
    @observable answerFeedback: 'correct' | 'incorrect' | null = null
    @observable reviewsToComplete: ExerciseWithConcept[] = []
    responseInput = React.createRef<HTMLInputElement>()
    static contextType = AppContext
    declare context: React.ContextType<typeof AppContext>

    constructor(props: { reviews: ExerciseWithConcept[] }) {
        super(props)
        this.reviewsToComplete = _.shuffle(props.reviews)
    }

    @computed get currentReview() {
        return _.last(this.reviewsToComplete)!
    }

    @computed get complete() {
        return this.reviewsToComplete.length === 0
    }

    @action.bound submitResponse() {
        if (this.response.toLowerCase() === this.currentReview.exercise.answer.toLowerCase()) {
            this.answerFeedback = 'correct'
        } else {
            this.answerFeedback = 'incorrect'
        }

        this.context.api.submitProgress(this.currentReview.concept.id, this.answerFeedback === 'correct')

    }

    @action.bound next() {
        if (this.answerFeedback === 'incorrect') {
            this.reviewsToComplete = _.shuffle(this.reviewsToComplete)
        } else {
            this.reviewsToComplete.pop()
        }

        this.answerFeedback = null
        this.response = ""

        if (this.reviewsToComplete.length) {
            setTimeout(() => this.responseInput.current!.focus())
        }
    }

    @action.bound onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.response = e.target.value
    }

    @action.bound onKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            if (this.answerFeedback) {
                this.next()
            } else if (!this.complete) {
                this.responseInput.current!.focus()
            }
        }
    }

    @action.bound onResponseKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.stopPropagation()
            e.preventDefault()
            this.submitResponse()
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        if (this.responseInput.current)
            this.responseInput.current.focus()
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        if (this.complete) {
            return <div className="ReviewsUI">
                Complete!
            </div>
        }

        return <>
            <div className="ReviewsUI">
                {this.currentReview && <div>
                    <p>{this.currentReview.exercise.question}</p>
                    <input
                        type="text"
                        ref={this.responseInput}
                        className={this.answerFeedback || undefined}
                        value={this.response}
                        placeholder="Your Response"
                        onChange={this.onChange}
                        onKeyDown={this.onResponseKeyDown}
                        disabled={!!this.answerFeedback}
                    />
                </div>}
            </div>
        </>
    }
}