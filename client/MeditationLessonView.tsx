import * as React from 'react'
import * as _ from 'lodash'

import { Lesson, MeditationLesson } from "../common/content"
import { Bibliography, transformRefs } from "../common/Bibliography"
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import { useContext } from 'react'
import { Markdown } from '../common/Markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../client/AppContext'
import { Link } from 'react-router-dom'
import { MeditationTimerState } from '../client/MeditationTimerState'
import { Container } from 'react-bootstrap'
import { Learny } from './Learny'

const MeditationTimerDiv = styled.div`
.controls {
    display: flex;
    align-items: center;
}

p {
    margin-bottom: 0;
}
`

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

function MeditationTimer(props: { seconds: string }) {
    const state = useLocalStore(() => new MeditationTimerState(parseFloat(props.seconds)))

    return useObserver(() => <MeditationTimerDiv className="card">
        <div className="card-body">
            <h6>Meditation Timer</h6>
            <div className="controls">
                <button className="btn" onClick={state.reset}>
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button className="btn" onClick={state.toggle}>
                    {state.playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </button>
                <div>
                    {state.durationStr}
                </div>
            </div>
            <p className="text-secondary mt-2">There will be a little chime sound at the end.</p>
        </div>
    </MeditationTimerDiv>)
}

export function MeditationLessonView(props: { lesson: MeditationLesson }) {
    const { app } = useContext(AppContext)
    const { lesson } = props
    const learny = app.learnyForLesson(lesson.id)
    const referencesById = _.keyBy(lesson.references, r => r.id)
    const [text, referenceIds] = transformRefs(lesson.def.text)
    const referencesInText = referenceIds.map(id => referencesById[id]!)

    const state = useLocalStore(() => ({ complete: learny.learned }))

    const finishLesson = action(() => {
        state.complete = true
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
        <div className="text-right mt-4">
            {!state.complete && <button className="btn btn-dawn" onClick={finishLesson}>I've finished meditating</button>}
            {state.complete && <LessonCompleteLink lesson={lesson} />}
        </div>
    </Container>)
}