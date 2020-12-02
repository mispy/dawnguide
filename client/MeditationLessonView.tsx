import * as React from 'react'
import * as _ from 'lodash'

import { Lesson, MeditationLesson } from "../common/content"
import { Bibliography, transformRefs } from "../common/Bibliography"
import { observable, action, computed } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import { useContext } from 'react'
import { Markdown } from '../common/Markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../client/AppContext'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Learny } from './Learny'
import ReactTimeago from 'react-timeago'
import { MeditationTimer } from './MeditationTimer'



function LessonCompleteLink(props: { lesson: Lesson }) {
    // const { app } = useContext(AppContext)
    // const { lesson } = props
    // const nextLesson = app.getLessonAfter(lesson.id)
    // if (nextLesson) {
    //     return <Link className="btn btn-dawn" to={`/${nextLesson.slug}`}>Next lesson: {nextLesson.title}</Link>
    // } else {
    return <Link className="btn btn-dawn" to={`/home`}>Home</Link>
    // }
}

export function MeditationLessonView(props: { lesson: MeditationLesson }) {
    const { app } = useContext(AppContext)
    const { lesson } = props
    const learny = app.learnyForLesson(lesson.id)
    const referencesById = _.keyBy(lesson.references, r => r.id)
    const [text, referenceIds] = transformRefs(lesson.def.text)
    const referencesInText = referenceIds.map(id => referencesById[id]!)

    const finishLesson = action(() => {
        learny.ewps[0]!.progress = {
            exerciseId: lesson.id,
            level: 1,
            learnedAt: Date.now(),
            reviewedAt: Date.now()
        }
        app.backgroundApi.completeLesson([lesson.id])
    })

    return useObserver(() => <Container>
        <h1>{lesson.title}</h1>
        <Markdown>{text}</Markdown>
        {referencesInText.length > 0 && <section id="references">
            <h2>References</h2>
            <Bibliography references={referencesInText} />
        </section>}
        <MeditationTimer seconds={lesson.def.seconds} />
        <div className="d-flex align-items-center mt-4">
            <div>
                {learny.nextReview && learny.nextReview.when <= Date.now() && <span>Review available now</span>}
                {learny.nextReview && learny.nextReview.when > Date.now() && <span>Reviewing: <ReactTimeago date={learny.nextReview.when} /></span>}
            </div>
            <div className="ml-auto">
                {!learny.learned && <button className="btn btn-dawn" onClick={finishLesson}>I've finished meditating</button>}
                {learny.learned && <LessonCompleteLink lesson={lesson} />}
            </div>
        </div>
    </Container>)
}