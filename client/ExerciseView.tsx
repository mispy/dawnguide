import * as React from 'react'
import { Lesson } from "../common/content"
import { Exercise } from "../common/types"
import { FillblankCard } from './FillblankCard'
import { MeditationCard } from './MeditationCard'

export function ExerciseView(props: { lesson: Lesson, exercise: Exercise, onSubmit: (remembered: boolean) => void }) {
    const { lesson, exercise } = props

    const card = (() => {
        if (exercise.type === 'fillblank') {
            return <FillblankCard {...props} exercise={exercise} />
        } else if (lesson.type === 'meditation') {
            return <MeditationCard onSubmit={props.onSubmit} lesson={lesson} />
        } else {
            throw new Error(`Unknown exercise type ${exercise.type}`)
        }
    })()

    return <div className="ExerciseView">
        {card}
    </div>
}