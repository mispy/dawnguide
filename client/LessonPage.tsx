import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { lessons } from "./lessons"
import { ReviewsUI } from "./ReviewUI"

@observer
export class LessonPage extends React.Component {
    @observable lessonIndex: number = 0
    @observable reviewPrompt: boolean = false
    @observable mode: 'learn' | 'review' = 'learn'

    @computed get lessons() {
        return lessons.slice(0, 5)
    }

    @action.bound prev() {
        if (this.reviewPrompt) {
            this.reviewPrompt = false
            return
        }

        this.lessonIndex = Math.max(0, this.lessonIndex - 1)
    }

    @action.bound next() {
        if (this.reviewPrompt) {
            this.mode = 'review'
            return
        }

        if (this.lessonIndex === this.lessons.length - 1) {
            // Finished lesson batch, prompt to continue to review
            this.reviewPrompt = true
            return
        }

        this.lessonIndex = Math.min(this.lessons.length - 1, this.lessonIndex + 1)
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
            return <ReviewsUI reviews={this.lessons} />
        }

        const lesson = this.lessons[this.lessonIndex]

        return <>
            <div className="LessonPage">
                <div className="lesson">
                    <button>&lt;</button>
                    <div>
                        <p>{lesson.question}</p>
                        <p>{lesson.answer}</p>
                    </div>
                    <button>&gt;</button>
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