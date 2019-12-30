import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

import { concepts } from "./concepts"
import { ReviewsUI } from "./ReviewUI"
import _ = require("lodash")

@observer
export class LessonPage extends React.Component {
    @observable conceptIndex: number = 0
    @observable reviewPrompt: boolean = false
    @observable mode: 'learn' | 'review' = 'learn'

    @computed get concepts() {
        return concepts.slice(0, 5)
    }

    @computed get currentConcept() {
        return this.concepts[this.conceptIndex]
    }

    @action.bound prev() {
        if (this.reviewPrompt) {
            this.reviewPrompt = false
            return
        }

        this.conceptIndex = Math.max(0, this.conceptIndex - 1)
    }

    @action.bound next() {
        if (this.reviewPrompt) {
            this.mode = 'review'
            return
        }

        if (this.conceptIndex === this.concepts.length - 1) {
            // Finished lesson batch, prompt to continue to review
            this.reviewPrompt = true
            return
        }

        this.conceptIndex = Math.min(this.concepts.length - 1, this.conceptIndex + 1)
    }

    @action.bound onKeyup(ev: KeyboardEvent) {
        if (ev.key == "ArrowRight") {
            this.next()
        } else if (ev.key == "ArrowLeft") {
            this.prev()
        }
    }

    componentDidMount() {
        window.addEventListener('keyup', this.onKeyup)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.onKeyup)
    }

    render() {
        if (this.mode === 'review') {
            const reviews = this.concepts.map(c => ({ concept: c, exercise: c.exercises[0] }))
            return <ReviewsUI reviews={reviews} />
        }

        return <>
            <div className="LessonPage">
                <div className="lesson">
                    <button className="btn prev">
                        <FontAwesomeIcon icon={faAngleLeft} onClick={this.prev} />
                    </button>
                    <div>
                        <p><strong>{this.currentConcept.title}</strong></p>
                        <p>{this.currentConcept.introduction}</p>
                    </div>
                    <button className="btn next" onClick={this.next}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
            {this.reviewPrompt && <div className="LessonsEndOverlay">
                <div>
                    <h1>Now that you have learned five new items, it is time to quiz you on the material</h1>
                    <div>
                        <button className="btn" onClick={this.prev}>Need more time</button>
                        <button className="btn" onClick={this.next}>Start the quiz</button>
                    </div>
                </div>
            </div>}
        </>
    }
}