import { useEffect, useRef } from "react"
import { useLocalStore, observer } from "mobx-react-lite"
import { action } from "mobx"
import * as React from 'react'
import { FillblankExerciseDef } from "../shared/types"
import { Concept } from "../shared/sunpedia"

export const FillblankCard = observer(function FillblankCard(props: { exercise: FillblankExerciseDef, concept: Concept, onSubmit: (remembered: boolean) => void }) {
    const { exercise, concept, onSubmit } = props
    const responseInput = useRef<HTMLInputElement>(null)
    const state = useLocalStore<{ response: string }>(() => ({ response: "" }))

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
    }, [])

    const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value)
        state.response = e.currentTarget.value
    })

    const onKeydown = action((e: React.KeyboardEvent<HTMLInputElement>) => {
        onSubmit(!!state.response)
    })

    const parts = exercise.question.split("____")
    const qline = parts.join(state.response || "____")

    return <div className="FillblankCard">
        <p>{qline}</p>
        <input
            type="text"
            ref={responseInput}
            value={state.response}
            placeholder="Your Answer"
            onChange={onChange}
            // onKeyDown={this.onResponseKeyDown}
            // disabled={!!this.answerFeedback}
            autoFocus
        />
    </div>
})