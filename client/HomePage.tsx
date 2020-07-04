import * as React from 'react'
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { showReviewTime } from "./ConceptPage"
import { DebugTools } from "./DebugTools"
import { IS_PRODUCTION } from "./settings"
import { Concept, Review } from '../shared/sunpedia'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function NextLessonCard(props: { lesson: Concept | undefined }) {
    const { lesson } = props

    if (!lesson) {
        return <div>

        </div>
    } else {
        return <Link to={`/${lesson.id}`} className="NextLessonCard">
            <h4>Next Lesson</h4>
            <div>
                <div className="keyFinding">
                    {lesson.keyFinding}
                </div>
                <h5>
                    {lesson.title} <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }

}

function NextReviewCard(props: { reviews: Review[] }) {
    const { reviews } = props

    const concepts = _.uniq(reviews.map(r => r.concept))

    if (!concepts.length) {
        return <div>

        </div>
    } else {

        let practiceLine
        if (concepts.length === 1) {
            practiceLine = <>Refresh your understanding of {concepts[0].name}</>
        } else if (concepts.length === 2) {
            practiceLine = <>Refresh your understanding of {concepts[0].name} and {concepts[1].name}</>
        } else {
            practiceLine = <>Refresh your understanding of {concepts[0].name}, {concepts[1].name}, and more</>
        }

        return <Link to={`/review`} className="NextReviewCard">
            <h4>Next Review</h4>
            <div>
                <div className="keyFinding">
                    {practiceLine}
                </div>
                <h5>
                    Go to reviews <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }

}

export function HomePage() {
    const { app, sunpedia } = useContext(AppContext)

    return useObserver(() => <AppLayout>
        <main className="HomePage">
            {!app.loading && <Container className="mt-2">
                <div className="row mb-4">
                    <div className="col-md-6 mt-2">
                        <NextLessonCard lesson={app.nextLesson} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <NextReviewCard reviews={app.reviews} />
                    </div>
                </div>
                {app.exercisesWithProgress.length ? <>
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Concept</th>
                                <th>Exercise</th>
                                <th>Level</th>
                                <th>Next Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {app.exercisesWithProgress.map(item => <tr key={item.exercise.id}>
                                <td><Link className="text-link" to={`/${item.exercise.conceptId}`}>{sunpedia.conceptById[item.exercise.conceptId].title}</Link></td>
                                <td style={{ maxWidth: '300px' }}>{item.exercise.question}</td>
                                <td>{item.progress ? item.progress.level : 0}</td>
                                <td>{app.reviews.some(r => r.exercise.id === item.exercise.id) ? "Available now" : showReviewTime(item)}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </> : undefined}
                {!IS_PRODUCTION ? <DebugTools /> : undefined}
            </Container>}
        </main>
    </AppLayout>)
}