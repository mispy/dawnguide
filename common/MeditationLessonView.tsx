import * as React from 'react'
import * as _ from 'lodash'

/// #if CLIENT
import { MeditationTimer } from '../client/MeditationTimer'
/// #endif
import type { Lesson, MeditationLesson } from "../common/content"
import { Bibliography, transformRefs } from "../common/Bibliography"
import { Markdown } from '../common/Markdown'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Observer } from 'mobx-react-lite'
import { useProgressiveEnhancement } from './ProgressiveEnhancement'

export function MeditationLessonView(props: { lesson: MeditationLesson }) {
    const { js } = useProgressiveEnhancement()

    const { lesson } = props
    const [text, referenceIds] = transformRefs(lesson.def.text)
    const referencesInText = referenceIds.map(id => lesson.expectReference(id))

    return <Observer>{() => {
        return <Container>
            <h1>Meditation: {lesson.title}</h1>
            <Markdown>{text}</Markdown>
            <Markdown>{lesson.def.steps}</Markdown>

            <section>
                {!js && <div>
                    This interactive section requires JavaScript.
                </div>}
                {js && <MeditationTimer seconds={lesson.def.seconds} />}
            </section>
            {referencesInText.length > 0 && <section id="references">
                <h2>References</h2>
                <Bibliography references={referencesInText} />
            </section>}
        </Container>
    }}</Observer>
}