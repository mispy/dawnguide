import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
// @ts-ignore
const TimeAgo = require('react-timeago').default
import Markdown from 'markdown-to-jsx'

import { Lesson } from '../shared/content'
import { AppLayout } from './AppLayout'
import { Container } from 'react-bootstrap'
import { AppContext } from './AppContext'
import { getReviewTime, ExerciseWithProgress } from '../shared/logic'
import { Passage } from '../shared/Passage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

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

export function LessonPage(props: { lesson: Lesson }) {
    const { app } = React.useContext(AppContext)
    const { lesson: Lesson } = props

    return useObserver(() => {
        // const LessonProgress = store.LessonsWithProgressById[Lesson.id]
        const exercisesWithProgress = app.exercisesWithProgress.filter(ewp => ewp.exercise.lessonId === Lesson.id)

        return <AppLayout title={props.lesson.title}>
            <main className="LessonPage">
                <Container>
                    <Passage lesson={Lesson} />
                    {app.userStartedLearning(Lesson.id) ? <section className="exercises">
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
                                {exercisesWithProgress.map(ewp => <tr key={ewp.exercise.id}>
                                    <td>{ewp.exercise.question}</td>
                                    <td>
                                        {ewp.exercise.type === 'fillblank'
                                            ? ewp.exercise.possibleAnswers[0]
                                            : <Markdown>{ewp.exercise.answer}</Markdown>}

                                    </td>
                                    <td>{showReviewTime(ewp)}</td>
                                </tr>)}
                            </tbody>
                        </table>

                    </section> : <section>
                            <div className="text-right">
                                <Link to={`/review/${Lesson.id}`} className="btn btn-dawn">Review {Lesson.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></Link>
                            </div>
                        </section>}

                </Container>
            </main>
        </AppLayout>
    })
}