import { useEffect, useRef } from "react"
import { useLocalStore, observer } from "mobx-react-lite"
import { action } from "mobx"
import * as React from 'react'
import { FillblankExerciseDef } from "../shared/types"
import { Concept } from "../shared/sunpedia"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import Markdown from "markdown-to-jsx"

function paddingForFill(fill: string): number {
    if (fill.length === 0) {
        return 20
    } else if (fill.length < 3) {
        return 10
    } else {
        return 0
    }
}

export const FillblankCard = observer(function FillblankCard(props: { exercise: FillblankExerciseDef, concept: Concept, onSubmit: (remembered: boolean) => void }) {
    const { exercise, concept, onSubmit } = props
    const canonicalAnswer = exercise.possibleAnswers[0]
    const responseInput = useRef<HTMLInputElement>(null)
    const state = useLocalStore<{ response: string, current: 'unanswered' | 'correct' | 'incorrect', showAnswer: boolean }>(() => ({ response: "", current: 'unanswered', showAnswer: false }))

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
    }, [])

    const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
        state.response = e.currentTarget.value
    })

    const onAnswer = action(() => {
        const match = exercise.possibleAnswers.find(ans => state.response === ans)
        if (match) {
            state.current = 'correct'
        } else {
            state.current = 'incorrect'
        }
    })

    const onKeydown = action((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && state.response.length) {
            if (state.current === 'unanswered')
                onAnswer()
            else
                onContinue()
        }
    })

    const onContinue = action(() => {
        onSubmit(state.current === 'correct')
    })

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
                    onChange={onChange}
                    onKeyDown={onKeydown}
                    disabled={state.current !== 'unanswered'}
                    autoFocus
                />
                <button>
                    <FontAwesomeIcon icon={faChevronRight} onClick={onContinue} />
                </button>
            </fieldset>
        </div>
        {state.current === 'correct' && <p className="successFeedback"><Markdown>{exercise.successFeedback}</Markdown></p>}
        {state.current === 'incorrect' && <p className="reviseFeedback"><Markdown>{exercise.reviseFeedback}</Markdown></p>}
    </div>
})