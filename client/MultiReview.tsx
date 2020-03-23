import React = require("react")
import { useLocalStore, useObserver } from "mobx-react-lite"
import { action } from "mobx"

import _ = require("lodash")
import { Exercise } from "../shared/types"
import { AppContext } from "./AppContext"
import { MemoryCard } from "./MemoryCard"
import { useContext } from "react"
import { Concept } from "../shared/sunpedia"

interface ExerciseWithConcept {
  concept: Concept
  exercise: Exercise
}

export function MultiReview(props: { reviews: ExerciseWithConcept[], onComplete: () => void }) {
  const { reviews, onComplete } = props
  const state = useLocalStore(() => ({ reviews: _.clone(reviews).reverse() }))
  const { api } = useContext(AppContext)

  const onCardComplete = action((remembered: boolean) => {
    const review = state.reviews[state.reviews.length - 1]
    api.submitProgress(review.exercise.id, remembered)

    if (remembered) {
      state.reviews.pop()
      if (state.reviews.length === 0) {
        onComplete()
      }
    } else {
      // Didn't remember, shuffle the cards
      state.reviews = _.shuffle(state.reviews)
    }
  })

  return useObserver(() => {
    return <div className="MultiReview">
      <MemoryCard review={state.reviews[state.reviews.length - 1]} onSubmit={onCardComplete} />
    </div>
  })
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