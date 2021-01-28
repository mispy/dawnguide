import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
import type { Lesson } from '../common/content'
import { AppLayout } from './AppLayout'
import { LessonView } from '../common/LessonView'

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