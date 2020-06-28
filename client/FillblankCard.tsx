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
import { matchesAnswerPermissively } from "../shared/logic"

type FillblankProps = { exercise: FillblankExerciseDef, concept: Concept, onSubmit: (remembered: boolean) => void }

class FillblankState {
    @observable response: string = ""
    @observable current: 'unanswered' | 'correct' | 'incorrect' = 'unanswered'
    @observable props: FillblankProps

    constructor(props: FillblankProps) {
        this.props = props
    }

    @action.bound changeResponse(e: React.ChangeEvent<HTMLInputElement>) {
        this.response = e.currentTarget.value
    }

    @action.bound continue() {
        if (this.current === 'unanswered') {
            this.checkAnswer()
        } else {
            this.finish()
        }
    }

    @action.bound checkAnswer() {
        if (!this.response.length)
            return

        const match = this.props.exercise.possibleAnswers.find(ans => matchesAnswerPermissively(this.response, ans))
        if (match) {
            this.response = this.props.exercise.possibleAnswers[0]
            this.current = 'correct'
        } else {
            this.current = 'incorrect'
        }

        // Fix bug in firefox where you can't press enter to progress
        requestAnimationFrame(() => {
            (document.activeElement as HTMLInputElement)?.blur()
        })
    }

    @action.bound finish() {
        this.props.onSubmit(this.current === 'correct')
        this.response = ""
        this.current = 'unanswered'
    }
}


export const FillblankCard = observer(function FillblankCard(props: FillblankProps) {
    const { exercise } = props
    const canonicalAnswer = exercise.possibleAnswers[0]
    const responseInput = useRef<HTMLInputElement>(null)
    const store = useLocalStore(() => ({ state: new FillblankState(props) }))
    const { state } = store

    const windowKeydown = action((e: KeyboardEvent) => {
        const { state } = store
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
        window.addEventListener('keydown', windowKeydown)
        return () => window.removeEventListener('keydown', windowKeydown)
    }, [])

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
        state.props = props
    })

    const parts = exercise.question.split(/_+/)
    const qline = []
    for (let i = 0; i < parts.length; i++) {
        qline.push(parts[i])
        if (i !== parts.length - 1) {
            qline.push(<span className="fillblank" key={i} style={{ minWidth: canonicalAnswer.length * 9 }}>&#8203;{state.response}&#8203;</span>)
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
                <button onClick={state.continue}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </fieldset>
        </div>
        {state.current === 'correct' && exercise.successFeedback && <p className="successFeedback"><Markdown>{exercise.successFeedback}</Markdown></p>}
        {state.current === 'incorrect' && exercise.reviseFeedback && <p className="reviseFeedback"><Markdown>{exercise.reviseFeedback}</Markdown></p>}
    </div>
})