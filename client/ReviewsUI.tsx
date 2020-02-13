import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed, autorun, IReactionDisposer, runInAction } from "mobx"

import _ = require("lodash")
import { Exercise, Concept } from "../shared/concepts"
import { matchesAnswerPermissively } from '../shared/logic'
import { AppContext } from "./context"
import { Link, Redirect } from "react-router-dom"

interface ExerciseWithConcept {
    concept: Concept
    exercise: Exercise
}

@observer
export class ReviewsUI extends React.Component<{ reviews: ExerciseWithConcept[] }> {
    @observable ready: boolean = false
    @observable response: string = ""
    @observable answerFeedback: 'correct' | 'incorrect' | null = null
    @observable reviewsToComplete: ExerciseWithConcept[] = []
    responseInput = React.createRef<HTMLInputElement>()
    static contextType = AppContext
    declare context: React.ContextType<typeof AppContext>


    @computed get currentReview() {
        return _.last(this.reviewsToComplete)!
    }

    @computed get complete() {
        return this.ready && this.reviewsToComplete.length === 0
    }

    @action.bound submitResponse() {
        if (matchesAnswerPermissively(this.response, this.currentReview.exercise.answer)) {
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

    dispose?: IReactionDisposer
    componentDidMount() {
        this.dispose = autorun(() => {
            const reviewsToComplete = _.shuffle(this.props.reviews)
            runInAction(() => { this.ready = true; this.reviewsToComplete = reviewsToComplete })
        })
        window.addEventListener('keydown', this.onKeyDown)
        if (this.responseInput.current)
            this.responseInput.current.focus()
    }

    componentWillUnmount() {
        if (this.dispose) this.dispose()
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        if (this.complete) {
            return <Redirect to="/home" />
        }

        return <>
            <div className="ReviewsUI">
                <div className="topbar">
                    <Link to="/home">Home</Link>
                </div>
                <div className="reviewContainer">
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
                            autoFocus
                        />
                    </div>}
                </div>
            </div>
        </>
    }
}