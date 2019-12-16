import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { lessons } from "./lessons"

@observer
export class LessonPage extends React.Component {
    @observable lessonIndex: number = 0

    @computed get lessons() {
        return lessons
    }

    @action.bound prevLesson() {
        this.lessonIndex = Math.max(0, this.lessonIndex - 1)
    }

    @action.bound nextLesson() {
        this.lessonIndex = Math.min(this.lessons.length - 1, this.lessonIndex + 1)
    }

    @action.bound onKeydown(ev: KeyboardEvent) {
        if (ev.key == "ArrowRight") {
            this.nextLesson()
        } else if (ev.key == "ArrowLeft") {
            this.prevLesson()
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeydown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeydown)
    }

    render() {
        const lesson = this.lessons[this.lessonIndex]

        return <>
            <div className="LessonPage" style={{ marginTop: "8rem", textAlign: "center" }}>
                <button>&lt;</button>
                <div>
                    <p>{lesson.question}</p>
                    <p>{lesson.answer}</p>
                </div>
                <button>&gt;</button>
            </div>
        </>
    }
}