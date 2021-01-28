import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
// @ts-ignore
const TimeAgo = require('react-timeago').default

import type { Lesson } from '../common/content'
import { Container } from 'react-bootstrap'
/// #if CLIENT
import { AppContext } from '../client/AppContext'
/// #endif
import { CardsEmbed } from '../common/CardsEmbed'
import type { ExerciseWithProgress } from '../common/logic'
import type { FillblankExerciseDef } from '../common/types'
import { Markdown } from '../common/Markdown'
import { Bibliography, transformRefs } from '../common/Bibliography'
import type { Learny } from '../client/Learny'
import classNames from 'classnames'
import { ClientOnly } from './ClientOnly'
import { ServerOnly } from './ServerOnly'

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

    let learny: Learny | null = null
    if (typeof AppContext !== "undefined") {
        const { app } = React.useContext(AppContext)
        if (app) {
            learny = app.learnyByLessonId[lesson.id]!
        }
    }

    return useObserver(() => {
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
                {<section>
                    <ServerOnly>
                        <div className="CardsEmbed">
                            Interactive reviews require javascript.
                        </div>
                    </ServerOnly>
                    <ClientOnly>
                        <CardsEmbed reviews={lesson.exercises.map(e => ({ lesson: lesson, exercise: e }))} />
                    </ClientOnly>
                </section>}
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
            {learny?.learned && <section className="exercises">
                <h2>Exercises</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Next Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {learny.ewps.filter(e => e.exercise.type === 'fillblank').map(ewp => {
                            const exercise = ewp.exercise as FillblankExerciseDef
                            return <tr key={ewp.exercise.id}>
                                <td>{exercise.question}</td>
                                <td>
                                    {exercise.possibleAnswers[0]}
                                </td>
                                <td>{showReviewTime(ewp)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </section>}
        </Container>
    })
}