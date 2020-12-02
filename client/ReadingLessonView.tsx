import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
// @ts-ignore
const TimeAgo = require('react-timeago').default

import { Lesson } from '../common/content'
import { Container } from 'react-bootstrap'
import { AppContext } from './AppContext'
import { getReviewTime, ExerciseWithProgress } from '../common/logic'
import { Passage } from '../common/Passage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { FillblankExerciseDef } from '../common/types'

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

export function ReadingLessonView(props: { lesson: Lesson }) {
    const { app } = React.useContext(AppContext)
    const { lesson } = props
    const learny = app.learnyByLessonId[lesson.id]!

    return useObserver(() => {
        return <Container>
            <Passage lesson={lesson} />
            {learny.learned ? <section className="exercises">
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
            </section> : <section>
                    <div className="text-right">
                        <Link to={`/review/${lesson.slug}`} className="btn btn-dawn">Review {lesson.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </div>
                </section>}

        </Container>
    })
}