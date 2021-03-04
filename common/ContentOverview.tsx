import * as React from 'react'
import { Observer } from "mobx-react-lite"
import _ from 'lodash'
import { Container } from "react-bootstrap"
import { ULink } from "../common/ULink"
import type { Lesson } from '../common/content'
import { content } from '../common/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBookReader, faCheckCircle, faHeart, faPen, faStar } from '@fortawesome/free-solid-svg-icons'
import ReactTimeago from 'react-timeago'
import classNames from 'classnames'
import { action } from 'mobx'
import type { Learny } from '../common/Learny'
import { expectAuthed } from '../common/ProgressiveEnhancement'
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
            <div className="d-flex">
                <div>
                    {learny.masteryLevel === 9 && <FontAwesomeIcon icon={faStar} />} Mastery level {learny.masteryLevel}/9
                </div>
            </div>

            <div className={classNames({ outer: true, mastered: learny.mastered })}>
                <div className="inner" style={{ width: `${learny.masteryPercent}%` }} />
            </div>

            <div>
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

    const publishedDate = DateTime.fromISO("2020-01-01")
    let datestr = ""
    if (publishedDate.diffNow('years').as('years') >= 1) {
        datestr = publishedDate.toFormat("LLL dd, YYYY")
    } else {
        datestr = publishedDate.toFormat("LLL dd")
    }


    return <li key={lesson.id} className={classNames({ lessonItem: true })}>
        <ULink href={`/${lesson.slug}`}>
            <div className="marker">
                <FontAwesomeIcon className="lessonType" icon={lessonIcons[lesson.type]} />
            </div>
            <div>
                <div className="title">{lesson.title}</div>
                <div className="subtitle">{lesson.summaryLine}</div>
                <time>{datestr}</time>
            </div>

        </ULink>
        {/* <div className="ml-auto">
            {learned && <MasteryProgressBar learny={learny} />}
        </div> */}
    </li>
}

export function ContentOverview() {
    const lessons = content.lessons

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