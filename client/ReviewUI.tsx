import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"

import { lessons, Lesson } from "./lessons"

@observer
export class ReviewsUI extends React.Component<{ reviews: Lesson[] }> {
    @observable reviewIndex: number = 0
    @observable answer: string = ""

    @computed get currentReview() {
        return this.props.reviews[this.reviewIndex]
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
        const review = this.currentReview

        return <>
            <div className="ReviewUI">
                <button>&lt;</button>
                <div>
                    <p>{review.question}</p>
                    <input type="text" value={this.answer} onInput={this.onInput} onKeyDown={this.onKeyDown} />
                </div>
                <button>&gt;</button>
            </div>
        </>
    }
}