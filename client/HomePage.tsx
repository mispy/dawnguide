import * as React from 'react'
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { showReviewTime } from "./LessonPage"
import { DebugTools } from "./DebugTools"
import { IS_PRODUCTION } from "./settings"
import { Lesson, content } from '../shared/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { ReviewWithTime } from './AppStore'
import ReactTimeago from 'react-timeago'

function NextLessonCard(props: { lesson: Lesson | undefined }) {
    const { lesson } = props

    if (!lesson) {
        return <div className="NextLessonCard complete">
            <h4>All lessons complete! ⭐️</h4>
            <div>
                <p>When we write a new one, it'll be available here.</p>
            </div>
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

function NextReviewCard(props: { reviews: ReviewWithTime[] }) {
    const { reviews } = props

    const Lessons = _.uniq(reviews.map(r => r.lesson))

    const now = Date.now()

    if (!reviews.length) {
        // TODO either no learned Lessons, or mastered all Lessons
        return <div>

        </div>
    } else if (reviews[0].when > now) {
        return <div className="NextReviewCard">
            <h4>You're up to date on reviews</h4>
            <div>
                <p>The next review is <ReactTimeago date={reviews[0].when} />.<br /><br />It will be about {Lessons[0].name}.</p>
            </div>
        </div>
    } else {

        let practiceLine
        if (Lessons.length === 1) {
            practiceLine = <>Refresh your understanding of {Lessons[0].name}</>
        } else if (Lessons.length === 2) {
            practiceLine = <>Refresh your understanding of {Lessons[0].name} and {Lessons[1].name}</>
        } else {
            practiceLine = <>Refresh your understanding of {Lessons[0].name}, {Lessons[1].name}, and more</>
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
    const { app } = useContext(AppContext)

    return useObserver(() => <AppLayout>
        <main className="HomePage">
            {!app.loading && <Container className="mt-2">
                <div className="row mb-4">
                    <div className="col-md-6 mt-2">
                        <NextLessonCard lesson={app.nextLesson} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <NextReviewCard reviews={app.upcomingReviews} />
                    </div>
                </div>
                {app.exercisesWithProgress.length ? <>
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Lesson</th>
                                <th>Exercise</th>
                                <th>Level</th>
                                <th>Next Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {app.exercisesWithProgress.map(item => <tr key={item.exercise.id}>
                                <td><Link className="text-link" to={`/${item.exercise.lessonId}`}>{content.lessonById[item.exercise.lessonId].title}</Link></td>
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