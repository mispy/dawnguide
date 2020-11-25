import { useObserver, useLocalStore } from "mobx-react-lite"
import * as React from 'react'
import { Lesson } from "../common/content"
import classnames from 'classnames'
import { action } from "mobx"
import { Exercise, BasicExerciseDef } from "../common/types"
import Markdown from 'markdown-to-jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Passage } from "../common/Passage"
import { Container } from "react-bootstrap"

export function MemoryCard(props: { lesson: Lesson, exercise: BasicExerciseDef, onSubmit: (remembered: boolean) => void }) {
    const { lesson, exercise, onSubmit } = props
    const state = useLocalStore<{ revealed: boolean, showLesson: boolean }>(() => ({ revealed: false, showLesson: false }))

    const reveal = action(() => state.revealed = true)

    const didntRemember = action(() => { onSubmit(false); state.revealed = false; state.showLesson = false })
    const remembered = action(() => { onSubmit(true); state.revealed = false; state.showLesson = false })

    const showLesson = action(() => state.showLesson = !state.showLesson)

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
            <button className="btn btn-outline-secondary" disabled={!state.revealed} onClick={showLesson}><FontAwesomeIcon icon={faEye} /> Show Lesson</button>
        </div>
        {state.showLesson && <Container><Passage lesson={lesson} /></Container>}
    </div>)
}