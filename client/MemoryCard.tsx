import { useEffect, useRef } from "react"
import { useObserver, useLocalStore } from "mobx-react"
import React = require("react")
import { Concept, Exercise } from "../shared/concepts"
import classnames from 'classnames'

interface ExerciseWithConcept {
    concept: Concept
    exercise: Exercise
}

export function MemoryCard(props: { review: ExerciseWithConcept, onSubmit: (response: string) => void }) {
    const { review, onSubmit } = props
    const { exercise } = review
    const responseInput = useRef<HTMLInputElement>(null)
    const state = useLocalStore<{ revealed: boolean }>(() => ({ revealed: false }))

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
    }, [])

    return useObserver(() => <div className="MemoryCard">
        <div className="card">
            <div className="prompt">{exercise.question}</div>
            <div className={classnames('answer', state.revealed && 'revealed')}>{!state.revealed ? "Click to reveal answer" : exercise.answer}</div>
        </div>
        <div className="buttons">
            <button className="btn" disabled>Didn't remember</button>
            <button className="btn" disabled>Remembered</button>
        </div>
    </div>)
}