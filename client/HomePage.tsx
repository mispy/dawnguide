import * as React from 'react'
import { Observer } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import _ from 'lodash'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { DebugTools } from "./DebugTools"
import { IS_PRODUCTION } from "./settings"
import type { Lesson } from '../common/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBookReader, faCheckCircle, faHeart, faPen, faStar } from '@fortawesome/free-solid-svg-icons'
import ReactTimeago from 'react-timeago'
import classNames from 'classnames'
import styled from 'styled-components'
import { action } from 'mobx'
import type { Learny } from '../common/Learny'
import { expectAuthed } from '../common/ProgressiveEnhancement'
import type { CardToReview } from '../common/types'
import { ContentOverview } from '../common/ContentOverview'

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
        return <Link to={`/${lesson.slug}`} className="NextLessonCard">
            <h4>Next Lesson</h4>
            <div>
                <div className="summaryLine">
                    {lesson.summaryLine}
                </div>
                <h5>
                    {lesson.title} <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }
}

function NextReviewCard(props: { reviews: CardToReview[] }) {
    const { reviews } = props
    const lessons = _.uniq(reviews.map(r => r.lesson))
    const now = Date.now()
    const nextReview = reviews[0]

    if (!nextReview) {
        // TODO either no learned Lessons, or mastered all Lessons
        return <div>

        </div>
    } else if (nextReview.nextReviewAt > now) {
        return <div className="NextReviewCard">
            <h4>You're up to date on reviews</h4>
            <div>
                <p>The next review is <ReactTimeago date={nextReview.nextReviewAt} />.<br /><br />It will be about {lessons[0]!.name}.</p>
            </div>
        </div>
    } else {
        let practiceLine
        if (lessons.length === 1) {
            practiceLine = <>Refresh your understanding of {lessons[0]!.name}</>
        } else if (lessons.length === 2) {
            practiceLine = <>Refresh your understanding of {lessons[0]!.name} and {lessons[1]!.name}</>
        } else {
            practiceLine = <>Refresh your understanding of {lessons[0]!.name}, {lessons[1]!.name}, and more</>
        }

        return <Link to={`/review`} className="NextReviewCard">
            <h4>Next Review</h4>
            <div>
                <div className="summaryLine">
                    {practiceLine}
                </div>
                <h5>
                    Go to reviews <FontAwesomeIcon icon={faArrowRight} />
                </h5>
            </div>
        </Link>
    }
}

const Main = styled.main`
h2 {
    font-size: 1.7rem;
}

h2 > div {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: normal;
}

`

export function HomePage() {
    const { authed, plan } = expectAuthed()

    return <Observer>{() =>
        <AppLayout>
            <Main>
                <Container className="mt-2">
                    <div className="row mb-4">
                        <div className="col-md-6 mt-2">
                            <NextLessonCard lesson={plan.nextLesson} />
                        </div>
                        <div className="col-md-6 mt-2">
                            <NextReviewCard reviews={plan.upcomingReviews} />
                        </div>
                    </div>
                    {/* <h2>
                            Self-compassion
                            <div>Learn about being kind to yourself as well as those around you.</div>
                        </h2> */}
                    <ContentOverview />
                    {!IS_PRODUCTION ? <DebugTools /> : undefined}
                </Container>
            </Main>
        </AppLayout>}
    </Observer>
}