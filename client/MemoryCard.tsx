import { useEffect, useRef } from "react"
import { useObserver, useLocalStore } from "mobx-react-lite"
import React = require("react")
import { Concept, Exercise } from "../shared/concepts"
import classnames from 'classnames'
import { action } from "mobx"

interface ExerciseWithConcept {
  concept: Concept
  exercise: Exercise
}

export function MemoryCard(props: { review: ExerciseWithConcept, onSubmit: (remembered: boolean) => void }) {
  const { review, onSubmit } = props
  const { exercise } = review
  const state = useLocalStore<{ revealed: boolean }>(() => ({ revealed: false }))

  const reveal = action(() => state.revealed = true)

  const didntRemember = action(() => onSubmit(false))
  const remembered = action(() => onSubmit(true))

  return useObserver(() => <div className="MemoryCard">
    <div className="card">
      <div className="prompt">{exercise.question}</div>
      <div className={classnames('answer', state.revealed && 'revealed')} onClick={reveal}>{!state.revealed ? "Click to reveal answer" : exercise.answer}</div>
    </div>
    <div className="buttons">
      <button className="btn" disabled={!state.revealed} onClick={didntRemember}>Didn't remember</button>
      <button className="btn" disabled={!state.revealed} onClick={remembered}>Remembered</button>
    </div>
  </div>)
}