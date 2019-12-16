import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { lessons, Lesson } from "./lessons"

@observer
export class ReviewUI extends React.Component {
    @observable reviewIndex: number = 0
    @observable answer: string = ""

    @computed get lessons() {
        return lessons
    }

    @action.bound submitAnswer() {
        console.log(this.answer)
        this.reviewIndex += 1
    }

    @action.bound onInput(e: React.ChangeEvent<HTMLInputElement>) {
        this.answer = e.target.value
    }

    @action.bound onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            this.submitAnswer()
        }
    }

    render() {
        const lesson = this.lessons[this.reviewIndex]

        return <>
            <div className="ReviewUI">
                <button>&lt;</button>
                <div>
                    <p>{lesson.question}</p>
                    <input type="text" value={this.answer} onInput={this.onInput} onKeyDown={this.onKeyDown} />
                </div>
                <button>&gt;</button>
            </div>
        </>
    }
}