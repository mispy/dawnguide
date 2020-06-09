import { useObserver, useLocalStore } from "mobx-react-lite"
import * as React from 'react'
import { Concept } from "../shared/sunpedia"
import classnames from 'classnames'
import { action } from "mobx"
import { Exercise, BasicExerciseDef } from "../shared/types"
import Markdown from 'markdown-to-jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Passage } from "../shared/Passage"
import { Container } from "react-bootstrap"

export function MemoryCard(props: { concept: Concept, exercise: BasicExerciseDef, onSubmit: (remembered: boolean) => void }) {
    const { concept, exercise, onSubmit } = props
    const state = useLocalStore<{ revealed: boolean, showConcept: boolean }>(() => ({ revealed: false, showConcept: false }))

    const reveal = action(() => state.revealed = true)

    const didntRemember = action(() => { onSubmit(false); state.revealed = false; state.showConcept = false })
    const remembered = action(() => { onSubmit(true); state.revealed = false; state.showConcept = false })

    const showConcept = action(() => state.showConcept = !state.showConcept)

    return useObserver(() => <div className="MemoryCardContainer mt-2">
        <div className="container">
            <div className="MemoryCard">
                <div className="card">
                    <div className="prompt"><Markdown>{exercise.question}</Markdown></div>
                    <div className={classnames('answer', state.revealed && 'revealed')} onClick={reveal}>{!state.revealed ? "Click to reveal answer" : <Markdown>{exercise.answer}</Markdown>}</div>
                </div>
                <div className="buttons">
                    <button className="btn btn-dawn" disabled={!state.revealed} onClick={didntRemember}><FontAwesomeIcon icon={faUndoAlt} /> Didn't remember</button>
                    <button className="btn btn-dawn" disabled={!state.revealed} onClick={remembered}><FontAwesomeIcon icon={faCheck} /> Remembered</button>
                </div>
            </div>

        </div>
        <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-outline-secondary" disabled={!state.revealed} onClick={showConcept}><FontAwesomeIcon icon={faEye} /> Show concept</button>
        </div>
        {state.showConcept && <Container><Passage concept={concept} /></Container>}
    </div>)
}