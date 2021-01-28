import * as React from 'react'
import { Observer, useLocalObservable, useObserver } from "mobx-react-lite"
import { action } from "mobx"

import * as _ from 'lodash'
import { AppContext } from "./AppContext"
import { useContext } from "react"
import type { Review } from "../common/content"
import { ExerciseView } from './ExerciseView'

export function MultiReview(props: { reviews: Review[], onComplete: () => void }) {
    const { reviews, onComplete } = props
    const state = useLocalObservable(() => ({ showLesson: false, reviews: _.clone(reviews).reverse() }))
    const { app } = useContext(AppContext)

    const onCardComplete = action((remembered: boolean) => {
        const review = state.reviews[state.reviews.length - 1]
        app.backgroundApi.submitProgress(review!.exercise.id, remembered)

        if (remembered) {
            state.reviews.pop()
            if (state.reviews.length === 0) {
                onComplete()
            }
        } else if (review?.exercise.type === 'meditation') {
            // Skip for now
            state.reviews.pop()
            if (state.reviews.length === 0) {
                onComplete()
            }
        } else {
            // Didn't remember, push this card to the back
            const review = state.reviews.pop()!
            state.reviews.unshift(review)
        }
    })

    return <Observer>{() => {
        const review = state.reviews[state.reviews.length - 1]
        if (!review) return null

        return <div className="MultiReview">
            <ExerciseView exercise={review.exercise} lesson={review.lesson} onSubmit={onCardComplete} />
        </div>
    }}</Observer>
}


// @observer
// export class ReviewsUI extends React.Component<{ reviews: ExerciseWithLesson[] }> {
//     @observable ready: boolean = false
//     @observable response: string = ""
//     @observable answerFeedback: 'correct' | 'incorrect' | null = null
//     @observable reviewsToComplete: ExerciseWithLesson[] = []
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

//         this.context.api.submitProgress(this.currentReview.Lesson.id, this.answerFeedback === 'correct')

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