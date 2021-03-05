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
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import ReactTimeago from 'react-timeago'
import styled from 'styled-components'
import { expectAuthed } from '../common/ProgressiveEnhancement'
import type { CardToReview } from '../common/types'
import { ContentOverview } from '../common/ContentOverview'

function NextReviewCard(props: { reviews: CardToReview[] }) {
    const { reviews } = props
    const lessons = _.uniq(reviews.map(r => r.lesson))
    const now = Date.now()
    const nextReview = reviews[0]

    if (!nextReview) {
        // TODO either no learned Lessons, or mastered all Lessons
        return <div className="NextReviewCard">
            No upcoming reviews yet. Pick an article to read!
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

export function HomePage() {
    const { authed, plan } = expectAuthed()

    return <Observer>{() =>
        <AppLayout>
            <main className="HomePage">
                <Container className="mt-2">
                    <div className="row mb-4 d-flex justify-content-center">
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
            </main>
        </AppLayout>}
    </Observer>
}