import * as React from 'react'
import { useObserver } from 'mobx-react-lite'
// @ts-ignore
const TimeAgo = require('react-timeago').default
import Markdown from 'markdown-to-jsx'

import { Concept } from '../shared/sunpedia'
import { AppLayout } from './AppLayout'
import { Container } from 'react-bootstrap'
import { AppContext } from './AppContext'
import { getReviewTime, ExerciseWithProgress } from '../shared/logic'
import { Passage } from '../shared/Passage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export function showReviewTime(ewp: ExerciseWithProgress) {
    if (!ewp.progress)
        return "Not yet learned"

    const time = getReviewTime(ewp.progress)

    if (time <= Date.now()) {
        return "Available now"
    } else {
        return <TimeAgo date={time} />
    }
}

export function ConceptPage(props: { concept: Concept }) {
    const { app } = React.useContext(AppContext)
    const { concept } = props

    return useObserver(() => {
        // const conceptProgress = store.conceptsWithProgressById[concept.id]
        const exercisesWithProgress = app.exercisesWithProgress.filter(ewp => ewp.exercise.conceptId === concept.id)

        return <AppLayout>
            <main className="ConceptPage">
                <Container>
                    <Passage concept={concept} />
                    {app.userStartedLearning(concept.id) ? <section className="exercises">
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
                                    <td><Markdown>{ewp.exercise.question}</Markdown></td>
                                    <td><Markdown>{ewp.exercise.answer}</Markdown></td>
                                    <td>{showReviewTime(ewp)}</td>
                                </tr>)}
                            </tbody>
                        </table>

                    </section> : <section>
                            <div className="text-right">
                                <a href={`/review/${concept.id}`} className="btn btn-dawn">Continue to review <FontAwesomeIcon icon={faArrowRight} /></a>
                            </div>
                        </section>}

                </Container>
            </main>
        </AppLayout>
    })
}