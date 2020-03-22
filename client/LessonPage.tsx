import React = require("react")
import { useObserver, useLocalStore } from "mobx-react"
import { observable, action, computed } from "mobx"

import { ConceptWithProgress } from "../shared/logic"

import { AppContext } from "./context"
import _ = require("lodash")
import { Link, Redirect } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { useContext } from "react"
import { MultiReview } from "./MultiReview"
import { Passage } from "./Passage"
import { Concept } from '../shared/concepts'

function readyToLearn(cwp: ConceptWithProgress) {
  return !cwp.progress || cwp.progress.level === 0
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

export function LessonPageLoaded(props: { concepts: Concept[] }) {
  const state = useLocalStore(() => new LessonPageState(props.concepts))

  function content() {
    if (state.showing === 'lesson') {
      return <div className="lesson">
        <div>
          <Passage content={state.concept.content} />
          {/* <p><strong>{state.concept.}</strong></p> */}
          {/* <Passage/> */}
          {/* <Markdown>{state.concept.introduction}</Markdown> */}
          {/* <MDXProvider components={{ ref: Reference }}><Content/></MDXProvider> */}
          <button className="btn" onClick={state.startReview}>Continue to review</button>
        </div>
      </div>
    } else if (state.showing === 'reviews') {
      return <MultiReview reviews={state.reviews} onComplete={state.completeReview} />
    } else {
      return <div className="d-flex justify-content-center">
        <div>
          <div className="text-center mb-2">
            Lesson complete!
                    </div>
          <div>
            <Link className="btn" to="/home">Home</Link>
            {state.conceptIndex < state.concepts.length - 1 && <button className="btn ml-2" onClick={state.nextLesson}>Next Lesson</button>}
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
  const { store } = useContext(AppContext)

  function content() {
    const isLoading = !store.conceptsWithProgress.length

    if (isLoading)
      return <div>Loading...</div>

    const learnableConcepts = store.conceptsWithProgress.filter(c => readyToLearn(c))
    if (!learnableConcepts.length) {
      // Nothing ready to learn
      return <Redirect to="/home" />
    }

    return <LessonPageLoaded concepts={learnableConcepts.map(c => c.concept)} />
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