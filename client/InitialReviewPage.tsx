import * as React from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import { observable, action, computed } from "mobx"

import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext, useEffect } from "react"
import { Concept } from '../shared/sunpedia'
import { MemoryCard, ExerciseWithConcept } from './MemoryCard'

function LessonReviews(props: { reviews: ExerciseWithConcept[], onComplete: () => void }) {
    const { api } = useContext(AppContext)
    const { reviews, onComplete } = props
    const state = useLocalStore<{ reviews: ExerciseWithConcept[], completedIds: string[] }>(() => ({ reviews: _.clone(reviews).reverse(), completedIds: [] }))

    const onCompleteAll = async (exerciseIds: string[]) => {
        await api.completeLesson(exerciseIds)
        onComplete()
    }

    useEffect(() => {
        const beforeUnload = () => {
            if (state.reviews.length !== 0 && state.reviews.length !== props.reviews.length) return "Really leave without finishing reviews?"
            else return null
        }

        window.onbeforeunload = beforeUnload
        return () => { window.onbeforeunload = null }
    }, [])

    const onCardComplete = action((remembered: boolean) => {
        if (remembered) {
            const review = state.reviews.pop()
            if (!review) return

            state.completedIds.push(review.exercise.id)
            if (state.reviews.length === 0) {
                onCompleteAll(state.completedIds)
            }
        } else {
            // Didn't remember, push this card to the back
            const review = state.reviews.pop()!
            state.reviews.unshift(review)
        }
    })

    return useObserver(() => {
        const review = state.reviews[state.reviews.length - 1]
        return <div className="LessonReviews">
            {review ? <MemoryCard review={review} onSubmit={onCardComplete} /> : undefined}
        </div>
    })
}

class LessonPageState {
    @observable showing: 'reviews' | 'complete' = 'reviews'
    @observable exerciseIndex: number = 0

    constructor(readonly concept: Concept) {
    }

    @computed get exercise() {
        return this.concept.exercises[this.exerciseIndex]
    }

    @computed get reviews() {
        return this.concept.exercises.map(e => {
            return {
                concept: this.concept,
                exercise: e
            }
        })
    }

    @action.bound startReview() {
        this.showing = 'reviews'
    }

    @action.bound completeReview() {
        this.showing = 'complete'
    }
}

function InitialReviewPageLoaded(props: { concept: Concept }) {
    const { app } = useContext(AppContext)
    const state = useLocalStore(() => new LessonPageState(props.concept))

    function content() {
        if (state.showing === 'reviews') {
            return <LessonReviews reviews={state.reviews} onComplete={state.completeReview} />
        } else {
            const nextLesson = app.lessonConcepts.find(c => c !== props.concept)

            return <div className="d-flex justify-content-center">
                <div>
                    <div className="text-center mb-2">
                        Lesson complete!
          </div>
                    <div>
                        <Link className="btn btn-dawn" to="/home">Home</Link>
                        {nextLesson && <Link to={`/${nextLesson.id}`} className="btn btn-dawn ml-2">Next Lesson</Link>}
                    </div>
                </div>
            </div>
        }
    }

    return useObserver(() => <div className="LessonPage">
        <div className="topbar">
            <Link to="/home">Home</Link>
        </div>

        {content()}
    </div >)
}

export function InitialReviewPage(props: { concept: Concept }) {
    const { app } = useContext(AppContext)
    const { concept } = props

    function content() {
        if (app.loading)
            return <div>Loading...</div>

        if (app.userStartedLearning(concept.id)) {
            // User already did initial exercises for this concept
            return <Redirect to="/home" />
        }

        return <InitialReviewPageLoaded concept={concept} />
    }

    return useObserver(() => {
        return <AppLayout noHeader noFooter>
            {content()}
        </AppLayout>
    })
}

    // @observer
    // export class LessonPage extends React.Component {
    //     @observable conceptIndex: number = 0
    //     @observable reviewPrompt: boolean = false
    //     @observable mode: 'learn' | 'review' = 'learn'

    //     static contextType = AppContext
    //     declare context: React.ContextType<typeof AppContext>



    //     @action.bound prev() {
    //         if (this.reviewPrompt) {
    //             this.reviewPrompt = false
    //             return
    //         }

    //         this.conceptIndex = Math.max(0, this.conceptIndex - 1)
    //     }

    //     @action.bound next() {
    //         if (this.reviewPrompt) {
    //             this.mode = 'review'
    //             return
    //         }

    //         if (this.conceptIndex === this.concepts.length - 1) {
    //             // Finished lesson batch, prompt to continue to review
    //             this.reviewPrompt = true
    //             return
    //         }

    //         this.conceptIndex = Math.min(this.concepts.length - 1, this.conceptIndex + 1)
    //     }

    //     @action.bound onKeyup(ev: KeyboardEvent) {
    //         if (ev.key == "ArrowRight") {
    //             this.next()
    //         } else if (ev.key == "ArrowLeft") {
    //             this.prev()
    //         }
    //     }

    //     componentDidMount() {
    //         window.addEventListener('keyup', this.onKeyup)
    //     }

    //     componentWillUnmount() {
    //         window.removeEventListener('keyup', this.onKeyup)
    //     }

    //     content() {
    //         if (!this.conceptsWithProgress.length) {
    //             return "Loading..."
    //         }

    //         if (this.concepts.length === 0) {
    //             // Nothing new to learn
    //             return <Redirect to="/home" />
    //         }

    //         if (this.mode === 'review') {
    //             const reviews = this.concepts.map(c => ({ concept: c, exercise: c.exercises[0] }))
    //             return <ReviewsUI reviews={reviews} />
    //         }


    //     }

    //     render() {
    //         return <AppLayout noHeader>
    //             {this.content()}
    //         </AppLayout>
    //     }
    // }