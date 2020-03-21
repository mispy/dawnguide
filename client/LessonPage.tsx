import React = require("react")
import { observer, useObserver, useLocalStore } from "mobx-react"
import { observable, action, computed } from "mobx"

import { ConceptWithProgress } from "../shared/logic"

import { ReviewsUI } from "./ReviewsUI"
import { AppContext } from "./context"
import _ = require("lodash")
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { AppStore } from "./AppStore"
import { useContext } from "react"
import { Concept } from "../shared/concepts"
import { MultiReview } from "./MultiReview"


function readyToLearn(cwp: ConceptWithProgress) {
    return !cwp.progress || cwp.progress.level === 0
}

class LessonPageState {
    @observable reviewing: boolean = true
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
}

export function LessonPageLoaded(props: { concept: Concept }) {
    const state = useLocalStore(() => new LessonPageState(props.concept))

    const startReview = action(() => {
        state.reviewing = true
    })

    return useObserver(() => <div className="LessonPage">
        <div className="topbar">
            <Link to="/home">Home</Link>
        </div>

        {state.reviewing ? <MultiReview reviews={state.reviews} /> : <div className="lesson">
            <div>
                <p><strong>{props.concept.title}</strong></p>
                <p>{props.concept.introduction}</p>
                <button className="btn btn-success" onClick={startReview}>Continue to review</button>
            </div>
        </div >}
    </div >)
}

export function LessonPage() {
    const { store } = useContext(AppContext)

    function content() {
        const isLoading = !store.conceptsWithProgress.length

        if (isLoading)
            return <div>Loading...</div>

        const cwp = store.conceptsWithProgress.find(c => readyToLearn(c))
        if (!cwp) {
            // Nothing ready to learn
            return <Redirect to="/home" />
        }

        return <LessonPageLoaded concept={cwp.concept} />
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