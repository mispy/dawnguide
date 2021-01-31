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
import type { Learny } from './Learny'
import { expectAuthed } from '../common/ProgressiveEnhancement'
import type { CardToReview } from '../common/types'

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

const MasteryProgressBarDiv = styled.div`
display: flex;
flex-direction: column;
color: #666;
font-size: 0.8rem;
padding-right: 1rem;
cursor: pointer;

.outer, .inner {
    border-radius: 10px;
}

.outer {
    width: 250px;
    height: 10px;
    background: rgba(33,36,44,0.08);
}

.inner {
    height: 100%;
    background-color: #9059ff;
    transition: background-color .3s ease;
}

&.disabled .inner {
    background-color: rgba(33,36,44,0.3)
}

.outer:not(.mastered) .inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

@media (max-width: 550px) {
    padding-right: 0.5rem;

    .outer {
        width: 150px;
    }
}
`

function MasteryProgressBar(props: { learny: Learny }) {
    const { backgroundApi } = expectAuthed()
    const { learny } = props

    const toggleDisabled = action(() => {
        const inverse = !learny.disabled
        learny.disabled = inverse
        backgroundApi.updateUserLesson(learny.lesson.id, { disabled: inverse })
    })

    return <Observer>
        {() => <MasteryProgressBarDiv onClick={toggleDisabled} className={classNames({ disabled: learny.disabled })}>
            <div className="d-flex">
                <div>
                    {learny.masteryLevel === 9 && <FontAwesomeIcon icon={faStar} />} Mastery level {learny.masteryLevel}/9
                </div>
            </div>

            <div className={classNames({ outer: true, mastered: learny.mastered })}>
                <div className="inner" style={{ width: `${learny.masteryPercent}%` }} />
            </div>

            <div>
                {learny.nextReview && learny.nextReview.when <= Date.now() && <span>Review available now</span>}
                {learny.nextReview && learny.nextReview.when > Date.now() && <span>Reviewing: <ReactTimeago date={learny.nextReview.when} /></span>}
                {learny.disabled && <span>Reviews disabled</span>}
            </div>
        </MasteryProgressBarDiv>}
    </Observer>
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

ul {
    padding: 0;
}

li {
    position: relative;
    list-style-type: none;
    display: flex;
    border-top: 1px solid #ccc;
    align-items: center;
}

li .intermarker {
    position: absolute;
    bottom: 0;
    left: 1.9rem;
    width: 2px;
    height: calc(100% + 1px);
    transform: translateX(-50%);
    background: #ccc;
    z-index: 1;
}

li:first-child .intermarker {
    height: calc(50% + 1px);
}

li:last-child .intermarker {
    height: calc(50% + 1px);
    top: -1px;
}

li.learned .intermarker {
    background: #008656;
}

li > a {
    padding: 1rem;
    display: flex;
    align-items: center;
}

li .marker {
    width: 1.8rem;
    height: 1.8rem;
    border: 1px solid rgba(33,36,44,0.50);
    margin-right: 0.75rem;
    position: relative;
    background: white;
    border-radius: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    z-index: 2;

    .lessonType {
        color: #333;
        width: 0.8rem;
        height: 0.8rem;
    }

    .tick {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        z-index: 1;
        background: white;
        width: 0.9rem;
    }
}

/* li.learned .marker {
    border - bottom: 1px solid #008656
} */

li.learned .fillbar {
            position: absolute;
    top: -1px;
    left: -1px;
    width: 1.8rem;
    height: 1.8rem;
    border-bottom: 5px solid #008656;
    border-radius: 10%;
}

@media (max-width: 550px) {
    li > a {
        max-width: 50%;
        padding: 1rem 0.5rem;
    }

    li .intermarker {
        left: calc(0.5rem + 0.9rem);
    }
}
`

export function HomePage() {
    const { authed, plan } = expectAuthed()

    const lessonIcons = {
        'reading': faBookReader,
        'writing': faPen,
        'meditation': faHeart
    }

    return <Observer>{() =>
        <AppLayout>
            <Main>
                <Container className="mt-2">
                    <div className="row mb-4">
                        {/* <div className="col-md-6 mt-2">
                            <NextLessonCard lesson={authed.nextLesson} />
                        </div> */}
                        <div className="col-md-6 mt-2">
                            <NextReviewCard reviews={plan.upcomingReviews} />
                        </div>
                    </div>
                    {/* <h2>
                            Self-compassion
                            <div>Learn about being kind to yourself as well as those around you.</div>
                        </h2> */}
                    <ul>
                        {authed.learnies.filter(l => l.lesson.type === "reading").map(learny => <li key={learny.lesson.id} className={classNames({ lessonItem: true, learned: learny.learned })}>
                            <Link to={learny.lesson.slug}>
                                <div className="intermarker"></div>
                                <div className="marker">
                                    {learny.learned && <FontAwesomeIcon className="tick" icon={faCheckCircle} />}
                                    <FontAwesomeIcon className="lessonType" icon={lessonIcons[learny.lesson.type]} />
                                    {learny.learned && <div className="fillbar" />}
                                </div>
                                <div className="lesson-title">{learny.lesson.title}</div>
                            </Link>
                            <div className="ml-auto">
                                {learny.learned && <MasteryProgressBar learny={learny} />}
                            </div>
                        </li>)}
                    </ul>
                    {!IS_PRODUCTION ? <DebugTools /> : undefined}
                </Container>
            </Main>
        </AppLayout>}
    </Observer>
}