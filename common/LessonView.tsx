import React from "react"
import { Lesson } from "./content"
import { MeditationLessonView } from "./MeditationLessonView"
import { ReadingLessonView } from "./ReadingLessonView"

export function LessonView(props: { lesson: Lesson }) {
    const { lesson } = props
    if (lesson.type === 'meditation') {
        return <MeditationLessonView lesson={lesson} />
    } else {
        return <ReadingLessonView lesson={lesson} />
    }
}
