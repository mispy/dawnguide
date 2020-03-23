import { useObserver, useLocalStore } from "mobx-react-lite"
import React = require("react")
import { Concept } from "../shared/sunpedia"
import classnames from 'classnames'
import { action } from "mobx"
import { Exercise } from "../shared/types"
import Markdown from 'markdown-to-jsx'

interface ExerciseWithConcept {
  concept: Concept
  exercise: Exercise
}

export function MemoryCard(props: { review: ExerciseWithConcept, onSubmit: (remembered: boolean) => void }) {
  const { review, onSubmit } = props
  const { exercise } = review
  const state = useLocalStore<{ revealed: boolean }>(() => ({ revealed: false }))

  const reveal = action(() => state.revealed = true)

  const didntRemember = action(() => { onSubmit(false); state.revealed = false })
  const remembered = action(() => { onSubmit(true); state.revealed = false })

  return useObserver(() => <div className="MemoryCard">
    <div className="card">
      <div className="prompt"><Markdown>{exercise.question}</Markdown></div>
      <div className={classnames('answer', state.revealed && 'revealed')} onClick={reveal}>{!state.revealed ? "Click to reveal answer" : <Markdown>{exercise.answer}</Markdown>}</div>
    </div>
    <div className="buttons">
      <button className="btn" disabled={!state.revealed} onClick={didntRemember}>Didn't remember</button>
      <button className="btn" disabled={!state.revealed} onClick={remembered}>Remembered</button>
    </div>
  </div>)
}