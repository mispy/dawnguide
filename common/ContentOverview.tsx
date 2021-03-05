import * as React from 'react'
import { Observer } from "mobx-react-lite"
import _ from 'lodash'
import { Container } from "react-bootstrap"
import { ULink } from "../common/ULink"
import type { Lesson } from '../common/content'
import { content } from '../common/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookReader, faHeart, faPen, faStar } from '@fortawesome/free-solid-svg-icons'
import ReactTimeago from 'react-timeago'
import classNames from 'classnames'
import { action } from 'mobx'
import type { Learny } from '../common/Learny'
import { expectAuthed, useProgressiveEnhancement } from '../common/ProgressiveEnhancement'
import { DateTime } from 'luxon'

function MasteryProgressBar(props: { learny: Learny }) {
    const { authed, backgroundApi } = expectAuthed()
    const { learny } = props

    const toggleDisabled = action(() => {
        const inverse = !learny.disabled
        authed.disabledLessons[learny.lesson.id] = inverse
        backgroundApi.updateUserLesson(learny.lesson.id, { disabled: inverse })
    })

    return <Observer>
        {() => <div className={classNames({ MasteryProgressBar: true, disabled: learny.disabled })} onClick={toggleDisabled}>

            <div className="leveltext">
                {learny.masteryLevel === 9 && <>
                    Review level {learny.masteryLevel}/9 {learny.masteryLevel === 9 && <FontAwesomeIcon icon={faStar} />}
                </>}
                {learny.nextReview && learny.nextReview.nextReviewAt <= Date.now() && <span>Review available now</span>}
                {learny.nextReview && learny.nextReview.nextReviewAt > Date.now() && <span>Reviewing: <ReactTimeago date={learny.nextReview.nextReviewAt} /></span>}
                {learny.disabled && <span>Reviews disabled</span>}
            </div>
        </div>}
    </Observer>
}

const lessonIcons = {
    'reading': faBookReader,
    'writing': faPen,
    'meditation': faHeart
}

function LessonItem(props: { lesson: Lesson }) {
    const { lesson } = props
    const { plan } = useProgressiveEnhancement()
    const learny = plan?.expectLearny(lesson.id)

    const publishedDate = DateTime.fromISO(lesson.def.publishedDate!)
    let datestr = ""
    if (publishedDate.year < DateTime.now().year) {
        datestr = publishedDate.toFormat("LLL dd, yyyy")
    } else {
        datestr = publishedDate.toFormat("LLL dd")
    }

    return <li key={lesson.id} className={classNames({ lessonItem: true })}>
        <ULink href={`/${lesson.slug}`}>
            <img src={lesson.featuredImg} />
            <div>
                <div className="title">{lesson.title}</div>
                <div className="subtitle">{lesson.summaryLine}</div>
                <div className="metadata">
                    <time>{datestr}</time>
                </div>
                {learny?.learned && <MasteryProgressBar learny={learny} />}
            </div>
        </ULink>
        {/* <div className="ml-auto">
        </div> */}
    </li>
}

export function ContentOverview() {
    const lessons = _.sortBy(content.lessons, l => -l.publishedDate)

    return <Observer>{() =>
        <div className="ContentOverview">
            <Container className="mt-2">
                <ul>
                    {lessons.filter(l => l.type === "reading").map(lesson => <LessonItem lesson={lesson} />)}
                </ul>
            </Container>
        </div>
    }</Observer>
}