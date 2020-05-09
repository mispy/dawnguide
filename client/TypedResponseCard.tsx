import { useEffect, useRef } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { action } from "mobx"
import * as React from 'react'

export function TypedResponseCard(props: { question: string, answer: string, onSubmit: (response: string) => void }) {
    const { question, answer, onSubmit } = props
    const responseInput = useRef<HTMLInputElement>(null)
    const state = useLocalStore<{ response: string }>(() => ({ response: "" }))

    useEffect(() => {
        if (responseInput.current)
            responseInput.current.focus()
    }, [])

    const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
        state.response = e.currentTarget.value
    })

    const onKeydown = action((e: React.KeyboardEvent<HTMLInputElement>) => {
        onSubmit(state.response)
    })

    return useObserver(() => <div className="TypedResponseCard">
        <p>{question}</p>
        <input
            type="text"
            ref={responseInput}
            value={state.response}
            placeholder="Your Response"
            onChange={onChange}
            // onKeyDown={this.onResponseKeyDown}
            // disabled={!!this.answerFeedback}
            autoFocus
        />
    </div>)
}