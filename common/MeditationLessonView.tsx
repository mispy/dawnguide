import * as React from 'react'
import * as _ from 'lodash'

import { Lesson, MeditationLesson } from "../common/content"
import { Bibliography, transformRefs } from "../common/Bibliography"
import { action } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import { useContext } from 'react'
import { Markdown } from '../common/Markdown'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import ReactTimeago from 'react-timeago'
// #if CLIENT
// import { AppContext } from '../client/AppContext'
// import { MeditationTimer } from '../client/MeditationTimer'
// #endif


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
    const { lesson } = props
    let finishLesson: any = () => null
    let learny: any = null

    if (typeof AppContext !== "undefined") {
        const { app } = useContext(AppContext)

        finishLesson = action(() => {
            app.progress.progressItems.push({
                userId: app.user.id,
                exerciseId: lesson.id,
                level: 1,
                learnedAt: Date.now(),
                reviewedAt: Date.now()
            })
            app.backgroundApi.completeLesson([lesson.id])
        })

        learny = app.learnyForLesson(lesson.id)
    }
    const [text, referenceIds] = transformRefs(lesson.def.text)
    const referencesInText = referenceIds.map(id => lesson.expectReference(id))


    return useObserver(() => {
        return <Container>
            <h1>Meditation: {lesson.title}</h1>
            <Markdown>{text}</Markdown>
            <Markdown>{lesson.def.steps}</Markdown>
            <MeditationTimer seconds={lesson.def.seconds} />
            <div className="d-flex align-items-center mt-4">
                <div>
                    {learny?.nextReview && learny.nextReview.when <= Date.now() && <span>Review available now</span>}
                    {learny?.nextReview && learny.nextReview.when > Date.now() && <span>Reviewing: <ReactTimeago date={learny.nextReview.when} /></span>}
                </div>
                <div className="ml-auto">
                    {!learny?.learned && <button className="btn btn-dawn" onClick={finishLesson}>I've finished meditating</button>}
                    {learny?.learned && <LessonCompleteLink lesson={lesson} />}
                </div>
            </div>
            {referencesInText.length > 0 && <section id="references">
                <h2>References</h2>
                <Bibliography references={referencesInText} />
            </section>}
        </Container>
    })
}