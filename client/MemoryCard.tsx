import { useEffect, useRef } from "react"
import { useObserver, useLocalStore } from "mobx-react"
import React = require("react")
import { Concept, Exercise } from "../shared/concepts"

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
        <p>{exercise.question}</p>
        <div>{state.revealed ? "Click to reveal answer" : exercise.answer}</div>
    </div>)
}