import { useEffect, useRef } from "react"
import { useLocalStore, observer } from "mobx-react-lite"
import { action } from "mobx"
import * as React from 'react'
import { FillblankExerciseDef } from "../shared/types"
import { Concept } from "../shared/sunpedia"
import classNames from "classnames"

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
    const state = useLocalStore<{ response: string, correct: null | boolean }>(() => ({ response: "", correct: null }))

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
    }, [])

    const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
        state.response = e.currentTarget.value
    })

    const onConfirm = action(() => {
        const match = exercise.possibleAnswers.find(ans => state.response === ans)
        if (match) {
            state.correct = true
        } else {
            state.correct = false
        }
    })

    const onKeydown = action((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && state.response.length) {
            onConfirm()
        }
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

    return <div className={classNames('FillblankCard', state.correct === true && 'correct', state.correct === false && 'incorrect')}>
        <div className="card">
            <p className="qline">{qline}</p>
            <input
                type="text"
                ref={responseInput}
                value={state.response}
                placeholder="Your Answer"
                onChange={onChange}
                onKeyDown={onKeydown}
                disabled={state.correct !== null}
                autoFocus
            />
        </div>
    </div>
})