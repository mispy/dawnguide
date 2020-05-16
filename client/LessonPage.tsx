import * as React from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import { observable, action, computed } from "mobx"

import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext } from "react"
import { Passage } from "../shared/Passage"
import { Concept } from '../shared/sunpedia'
import { MemoryCard, ExerciseWithConcept } from './MemoryCard'
import { Container } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


export function LessonPage() {
    const { app } = useContext(AppContext)

    function content() {
        if (app.loading)
            return <div>Loading...</div>

        if (!app.lessonConcepts.length) {
            // Nothing ready to learn
            return <Redirect to="/home" />
        } else {
            return <Redirect to={`/${app.lessonConcepts[0].id}`} />
        }
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