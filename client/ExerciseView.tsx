import * as React from 'react'
import { Concept } from "../shared/sunpedia"
import { Exercise, FillblankExerciseDef } from "../shared/types"
import { MemoryCard } from './MemoryCard'
import { FillblankCard } from './FillblankCard'

export function ExerciseView(props: { concept: Concept, exercise: Exercise, onSubmit: (remembered: boolean) => void }) {
    const { exercise } = props

    if (exercise.type === 'fillblank') {
        return <FillblankCard {...props} exercise={exercise as FillblankExerciseDef} />
    } else {
        return <MemoryCard {...props} />
    }
}