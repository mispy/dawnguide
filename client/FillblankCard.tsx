import { useEffect, useRef } from "react"
import { useLocalStore, observer } from "mobx-react-lite"
import { action, observable } from "mobx"
import * as React from 'react'
import { FillblankExerciseDef } from "../shared/types"
import { Concept } from "../shared/sunpedia"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import Markdown from "markdown-to-jsx"

class FillblankState {
    @observable response: string = ""
    @observable current: 'unanswered' | 'correct' | 'incorrect' = 'unanswered'

    constructor(readonly exercise: FillblankExerciseDef, readonly onSubmit: (remembered: boolean) => void) { }

    @action.bound changeResponse(e: React.ChangeEvent<HTMLInputElement>) {
        this.response = e.currentTarget.value
    }

    @action.bound checkAnswer() {
        if (!this.response.length)
            return

        const match = this.exercise.possibleAnswers.find(ans => this.response === ans)
        if (match) {
            this.current = 'correct'
        } else {
            this.current = 'incorrect'
        }
    }

    @action.bound finish() {
        this.onSubmit(this.current === 'correct')
    }
}


export const FillblankCard = observer(function FillblankCard(props: { exercise: FillblankExerciseDef, concept: Concept, onSubmit: (remembered: boolean) => void }) {
    const { exercise, concept, onSubmit } = props
    const canonicalAnswer = exercise.possibleAnswers[0]
    const responseInput = useRef<HTMLInputElement>(null)
    const state = useLocalStore(() => new FillblankState(exercise, onSubmit))

    const windowKeydown = action((e: KeyboardEvent) => {
        if (e.key == "Enter") {
            if (responseInput.current === document.activeElement) {
                state.checkAnswer()
            } else {
                if (state.current === "unanswered") {
                    responseInput.current?.focus()
                } else {
                    state.finish()
                }
            }
        }
    })
    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()

        window.addEventListener('keydown', windowKeydown)
        return () => window.removeEventListener('keydown', windowKeydown)
    }, [])

    const parts = exercise.question.split("____")
    const qline = []
    for (let i = 0; i < parts.length; i++) {
        qline.push(parts[i])
        if (i !== parts.length - 1) {
            qline.push(<span className="fillblank" key={i} style={{ minWidth: canonicalAnswer.length * 7 }}>&#8203;{state.response}&#8203;</span>)
            qline.push(" ")
        }
    }

    return <div className={classNames('FillblankCard', state.current)}>
        <div className="card">
            <p className="qline">{qline}</p>
            <fieldset>
                <input
                    type="text"
                    ref={responseInput}
                    value={state.response}
                    placeholder="Your Answer"
                    onChange={state.changeResponse}
                    disabled={state.current !== 'unanswered'}
                    autoFocus
                />
                <button>
                    <FontAwesomeIcon icon={faChevronRight} onClick={state.finish} />
                </button>
            </fieldset>
        </div>
        {state.current === 'correct' && <p className="successFeedback"><Markdown>{exercise.successFeedback}</Markdown></p>}
        {state.current === 'incorrect' && <p className="reviseFeedback"><Markdown>{exercise.reviseFeedback}</Markdown></p>}
    </div>
})