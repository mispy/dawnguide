import * as React from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import { observable, action, computed } from "mobx"

import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext, useEffect } from "react"
import { Lesson } from '../shared/content'
import { ExerciseView } from './ExerciseView'
import { Review } from '../shared/types'

function LessonReviews(props: { reviews: Review[], onComplete: () => void }) {
    const { api } = useContext(AppContext)
    const { reviews, onComplete } = props
    const state = useLocalStore<{ reviews: Review[], completedIds: string[] }>(() => ({ reviews: _.clone(reviews).reverse(), completedIds: [] }))

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
            {review ? <ExerciseView lesson={review.lesson} exercise={review.exercise} onSubmit={onCardComplete} /> : undefined}
        </div>
    })
}

class LessonPageState {
    @observable showing: 'reviews' | 'complete' = 'reviews'
    @observable exerciseIndex: number = 0

    constructor(readonly lesson: Lesson) {
    }

    @computed get exercise() {
        return this.lesson.exercises[this.exerciseIndex]
    }

    @computed get reviews() {
        return this.lesson.exercises.map(e => {
            return {
                lesson: this.lesson,
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

function InitialReviewPageLoaded(props: { lesson: Lesson }) {
    const { app } = useContext(AppContext)
    const state = useLocalStore(() => new LessonPageState(props.lesson))

    function content() {
        if (state.showing === 'reviews') {
            return <LessonReviews reviews={state.reviews} onComplete={state.completeReview} />
        } else {
            const nextLesson = app.lessonLessons.find(c => c !== props.lesson)

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

export function InitialReviewPage(props: { lesson: Lesson }) {
    const { app } = useContext(AppContext)
    const { lesson } = props

    function content() {
        if (app.loading)
            return <></>

        if (app.learnyByLessonId[lesson.id].learned) {
            // User already did initial exercises for this Lesson
            return <Redirect to="/home" />
        }

        return <InitialReviewPageLoaded lesson={lesson} />
    }

    return useObserver(() => {
        return <AppLayout noHeader noFooter>
            {content()}
        </AppLayout>
    })
}