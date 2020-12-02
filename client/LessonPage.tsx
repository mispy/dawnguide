import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
// @ts-ignore
const TimeAgo = require('react-timeago').default
import Markdown from 'markdown-to-jsx'

import { Lesson } from '../common/content'
import { AppLayout } from './AppLayout'
import { AppContext } from './AppContext'
import { getReviewTime, ExerciseWithProgress } from '../common/logic'
import { ReadingLessonView } from './ReadingLessonView'
import { MeditationLessonView } from './MeditationLessonView'

export function showReviewTime(ewp: ExerciseWithProgress) {
    if (!ewp.progress)
        return "Available now"

    const time = getReviewTime(ewp.progress)

    if (time <= Date.now()) {
        return "Available now"
    } else {
        return <TimeAgo date={time} />
    }
}

function LessonView(props: { lesson: Lesson }) {
    const { lesson } = props
    if (lesson.type === 'meditation') {
        return <MeditationLessonView lesson={lesson} />
    } else {
        return <ReadingLessonView lesson={lesson} />
    }
}

export function LessonPage(props: { lesson: Lesson }) {
    const { lesson } = props

    return useObserver(() => {
        return <AppLayout title={props.lesson.title}>
            <main className="LessonPage">
                <LessonView lesson={lesson} />
            </main>
        </AppLayout>
    })
}