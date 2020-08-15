import * as React from 'react'
import { Lesson } from "../shared/content"
import { Exercise, FillblankExerciseDef, BasicExerciseDef } from "../shared/types"
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