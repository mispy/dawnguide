import React = require("react")
import { useObserver, useLocalStore } from "mobx-react-lite"
import { observable, action, computed } from "mobx"

import { AppContext } from "./AppContext"
import _ = require("lodash")
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext } from "react"
import { Passage } from "../shared/Passage"
import { Concept } from '../shared/sunpedia'
import { MemoryCard, ExerciseWithConcept } from './MemoryCard'
import { Container } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function LessonReviews(props: { reviews: ExerciseWithConcept[], onComplete: () => void }) {
    const { reviews, onComplete } = props
    const state = useLocalStore<{ reviews: ExerciseWithConcept[], completedIds: string[] }>(() => ({ reviews: _.clone(reviews).reverse(), completedIds: [] }))
    const { api } = useContext(AppContext)

    const onCompleteAll = async (exerciseIds: string[]) => {
        await api.completeLesson(exerciseIds)
        onComplete()
    }

    const onCardComplete = action((remembered: boolean) => {
        if (remembered) {
            const review = state.reviews.pop()
            if (!review) return

            state.completedIds.push(review.exercise.id)
            if (state.reviews.length === 0) {
                onCompleteAll(state.completedIds)
            }
        } else {
            // Didn't remember, shuffle the cards
            state.reviews = _.shuffle(state.reviews)
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
    @observable showing: 'lesson' | 'reviews' | 'complete' = 'lesson'
    @observable conceptIndex: number = 0
    @observable exerciseIndex: number = 0

    constructor(readonly concepts: Concept[]) {
    }

    @computed get concept() {
        return this.concepts[this.conceptIndex]
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

    @action.bound nextLesson() {
        this.conceptIndex += 1
        this.exerciseIndex = 0
        this.showing = 'lesson'
    }
}

function LessonPageLoaded(props: { concepts: Concept[] }) {
    const state = useLocalStore(() => new LessonPageState(props.concepts))

    function content() {
        if (state.showing === 'lesson') {
            return <Container className="lesson">
                <div>
                    <Passage concept={state.concept} />
                    {/* <Passage/> */}
                    {/* <Markdown>{state.concept.introduction}</Markdown> */}
                    {/* <MDXProvider components={{ ref: Reference }}><Content/></MDXProvider> */}
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-dawn" onClick={state.startReview}>Continue to review <FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                </div>
            </Container>
        } else if (state.showing === 'reviews') {
            return <LessonReviews reviews={state.reviews} onComplete={state.completeReview} />
        } else {
            return <div className="d-flex justify-content-center">
                <div>
                    <div className="text-center mb-2">
                        Lesson complete!
          </div>
                    <div>
                        <Link className="btn btn-dawn" to="/home">Home</Link>
                        {state.conceptIndex < state.concepts.length - 1 && <button className="btn btn-dawn ml-2" onClick={state.nextLesson}>Next Lesson</button>}
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

export function LessonPage() {
    const { app } = useContext(AppContext)

    function content() {
        const isLoading = !app.exercisesWithProgress.length

        if (isLoading)
            return <div>Loading...</div>

        if (!app.lessonConcepts.length) {
            // Nothing ready to learn
            return <Redirect to="/home" />
        }

        return <LessonPageLoaded concepts={app.lessonConcepts} />
    }

    return useObserver(() => {
        return <AppLayout noHeader>
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