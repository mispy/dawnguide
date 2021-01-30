import * as React from 'react'
// @ts-ignore
const TimeAgo = require('react-timeago').default

import type { Lesson } from '../common/content'
import { Container } from 'react-bootstrap'
/// #if CLIENT
import { CardsEmbed } from '../client/CardsEmbed'
/// #endif
import type { ExerciseWithProgress } from '../common/logic'
import { Markdown } from '../common/Markdown'
import { Bibliography, transformRefs } from '../common/Bibliography'
import classNames from 'classnames'
import { useProgressiveEnhancement } from './ProgressiveEnhancement'
import { Observer } from 'mobx-react-lite'

export function showReviewTime(ewp: ExerciseWithProgress) {
    if (!ewp.progress)
        return "Available now"

    const time = ewp.progress.nextReviewAt

    if (!time || time <= Date.now()) {
        return "Available now"
    } else {
        return <TimeAgo date={time} />
    }
}

export function ReadingLessonView(props: { lesson: Lesson }) {
    const { lesson } = props
    const [lessonText, referenceIds] = transformRefs(lesson.text)
    const referencesInText = referenceIds.map(id => lesson.expectReference(id))

    return <Observer>{() => {
        const { js } = useProgressiveEnhancement()

        return <Container>
            <div className={classNames("LessonView", "Passage", lesson.subtitle && 'hasSubtitle')}>
                <h1>
                    {lesson.title}
                </h1>
                <Markdown>{lessonText}</Markdown>
                {'steps' in lesson.def ? <section id="steps">
                    <Markdown>{lesson.def.steps}</Markdown>
                </section> : undefined}
                { }
                <section>
                    {!js && <div className="CardsEmbed">
                        This interactive section requires javascript.
                    </div>}
                    {js && <CardsEmbed reviews={lesson.exercises.map(e => ({ lesson: lesson, exercise: e }))} />}
                </section>
                <div className="authorship">
                    Written by {lesson.author}
                </div>
                {lesson.furtherReading ? <section id="furtherReading">
                    <h2>Further Reading</h2>
                    <Markdown>{lesson.furtherReading}</Markdown>
                </section> : undefined}
                {lesson.notes ? <section id="notes">
                    <h2>Notes</h2>
                    <Markdown>{lesson.notes}</Markdown>
                </section> : undefined}
                {referencesInText.length ? <section id="references">
                    <h2>References</h2>
                    <Bibliography references={referencesInText} />
                </section> : undefined}
            </div>
        </Container>
    }}</Observer>
}