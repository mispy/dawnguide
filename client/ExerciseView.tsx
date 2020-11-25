import * as React from 'react'
import { Lesson } from "../common/content"
import { Exercise, FillblankExerciseDef, BasicExerciseDef } from "../common/types"
import { MemoryCard } from './MemoryCard'
import { FillblankCard } from './FillblankCard'

export function ExerciseView(props: { lesson: Lesson, exercise: Exercise, onSubmit: (remembered: boolean) => void }) {
    const { exercise } = props

    if (exercise.type === 'fillblank') {
        return <FillblankCard {...props} exercise={exercise as FillblankExerciseDef} />
    } else {
        return <MemoryCard {...props} exercise={exercise as BasicExerciseDef} />
    }
}