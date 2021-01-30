import { useLocalObservable, Observer } from "mobx-react-lite"
import { action, observable, makeObservable } from "mobx"
import * as React from 'react'
import type { FillblankExerciseDef } from "../common/types"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faTimes } from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-regular-svg-icons"

class MemoryCardState {
    @observable revealed: boolean = false

    constructor() {
        makeObservable(this)
    }

    @action.bound reveal() {
        this.revealed = true
    }

    @action.bound reset() {
        this.revealed = false
    }
}

export const MemoryCard = (props: { exercise: FillblankExerciseDef, onSubmit: (remembered: boolean) => void }) => {
    const { exercise } = props
    const canonicalAnswer = exercise.possibleAnswers[0]!
    const { state } = useLocalObservable(() => ({ state: new MemoryCardState() }))

    // Reset state when changing to another exercise
    React.useEffect(() => {
        state.reset()
    }, [props.exercise])

    return <Observer>{() => {
        // Fancy styling for cloze deletions
        const parts = exercise.question.split(/_+/)
        const qline: (React.ReactElement | string)[] = []
        for (let i = 0; i < parts.length; i++) {
            qline.push(parts[i]!)
            if (i !== parts.length - 1) {
                qline.push(<span className="cloze" key={i} style={{ minWidth: canonicalAnswer.length * 9 }}>{state.revealed ? canonicalAnswer : ""}</span>)
                qline.push(" ")
            }
        }

        return <div className={classNames('MemoryCard', state.revealed ? 'revealed' : '')}>
            <p className="qline">{qline}</p>
            <footer>
                {!state.revealed && <button className="reveal" onClick={state.reveal}>
                    <FontAwesomeIcon icon={faEye} /> Show answer
                </button>}
                {state.revealed && <>
                    <button className="forgot" onClick={() => props.onSubmit(false)}>
                        <FontAwesomeIcon icon={faTimes} /> Forgotten
                    </button>
                    <button className="remembered" onClick={() => props.onSubmit(true)}>
                        <FontAwesomeIcon icon={faCircle} /> Remembered
                    </button>
                </>}
            </footer>
        </div>
    }}</Observer>
}