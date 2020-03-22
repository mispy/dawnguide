import React = require("react")
import { observer, useLocalStore, useObserver } from "mobx-react"
import { observable, action, computed, autorun, IReactionDisposer, runInAction } from "mobx"

import _ = require("lodash")
import { Exercise, Concept } from "../shared/concepts"
import { matchesAnswerPermissively } from '../shared/logic'
import { AppContext } from "./context"
import { Link, Redirect } from "react-router-dom"
import { MemoryCard } from "./MemoryCard"
import { useContext } from "react"

interface ExerciseWithConcept {
    concept: Concept
    exercise: Exercise
}

export function MultiReview(props: { reviews: ExerciseWithConcept[], onComplete: () => void }) {
    const { reviews, onComplete } = props
    const state = useLocalStore(() => ({ reviewIndex: 0 }))
    const { api } = useContext(AppContext)

    const onCardComplete = action((remembered: boolean) => {
        api.submitProgress(reviews[state.reviewIndex].concept.id, remembered)

        if (state.reviewIndex >= props.reviews.length - 2) {
            onComplete()
        } else {
            state.reviewIndex += 1
        }
    })

    return useObserver(() => <div className="MultiReview">
        <MemoryCard review={reviews[state.reviewIndex]} onSubmit={onCardComplete} />
    </div>)
}


// @observer
// export class ReviewsUI extends React.Component<{ reviews: ExerciseWithConcept[] }> {
//     @observable ready: boolean = false
//     @observable response: string = ""
//     @observable answerFeedback: 'correct' | 'incorrect' | null = null
//     @observable reviewsToComplete: ExerciseWithConcept[] = []
//     responseInput = React.createRef<HTMLInputElement>()
//     static contextType = AppContext
//     declare context: React.ContextType<typeof AppContext>

//     @computed get currentReview() {
//         return _.last(this.reviewsToComplete)!
//     }

//     @computed get complete() {
//         return this.ready && this.reviewsToComplete.length === 0
//     }

//     @action.bound submitResponse() {
//         if (matchesAnswerPermissively(this.response, this.currentReview.exercise.answer)) {
//             this.answerFeedback = 'correct'
//         } else {
//             this.answerFeedback = 'incorrect'
//         }

//         this.context.api.submitProgress(this.currentReview.concept.id, this.answerFeedback === 'correct')

//     }

//     @action.bound next() {
//         if (this.answerFeedback === 'incorrect') {
//             this.reviewsToComplete = _.shuffle(this.reviewsToComplete)
//         } else {
//             this.reviewsToComplete.pop()
//         }

//         this.answerFeedback = null
//         this.response = ""

//     }

//     @action.bound onChange(e: React.ChangeEvent<HTMLInputElement>) {
//         this.response = e.target.value
//     }

//     @action.bound onKeyDown(e: KeyboardEvent) {
//         if (e.key === "Enter") {
//             if (this.answerFeedback) {
//                 this.next()
//             } else if (!this.complete) {
//                 this.responseInput.current!.focus()
//             }
//         }
//     }

//     dispose?: IReactionDisposer
//     componentDidMount() {
//         this.dispose = autorun(() => {
//             const reviewsToComplete = _.shuffle(this.props.reviews)
//             runInAction(() => { this.ready = true; this.reviewsToComplete = reviewsToComplete })
//         })
//         window.addEventListener('keydown', this.onKeyDown)
//         if (this.responseInput.current)
//             this.responseInput.current.focus()
//     }

//     componentWillUnmount() {
//         if (this.dispose) this.dispose()
//         window.removeEventListener('keydown', this.onKeyDown)
//     }

//     render() {
//         if (this.complete) {
//             return <Redirect to="/home" />
//         }

//         return <>
//             <div className="ReviewsUI">
//                 <div className="topbar">
//                     <Link to="/home">Home</Link>
//                 </div>
//                 <div className="reviewContainer">
//                     {this.currentReview && <MemoryCard review={this.currentReview} onSubmit={() => ''} />}
//                 </div>
//             </div>
//         </>
//     }
// }