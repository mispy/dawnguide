import * as React from 'react'
import type { Lesson } from '../common/content'
import { Container } from 'react-bootstrap'
/// #if CLIENT
import { CardsEmbed } from '../client/CardsEmbed'
/// #endif
import { Markdown } from '../common/Markdown'
import { Bibliography, transformRefs } from '../common/Bibliography'
import classNames from 'classnames'
import { useProgressiveEnhancement } from './ProgressiveEnhancement'
import { Observer } from 'mobx-react-lite'
import type { Card } from './types'

function SectionReview(props: { cards: Card[] }) {
    const { cards } = props

    return <Observer>{() => {
        const { js } = useProgressiveEnhancement()

        return <div>
            {!js && <div className="CardsEmbed">
                This interactive section requires javascript.
            </div>}
            {js && <CardsEmbed cards={cards} initial={true} />}
        </div>
    }}</Observer>
}

export function ReadingLessonView(props: { lesson: Lesson }) {
    const { lesson } = props
    const [lessonText, referenceIds] = transformRefs(lesson.text)
    const referencesInText = referenceIds.map(id => lesson.expectReference(id))

    function SectionReviewMarkdown(props: { cards?: string }) {
        let cards = lesson.exercises
        if (props.cards) {
            const cardIds = props.cards.split(',')
            cards = lesson.exercises.filter(ex => cardIds.includes(ex.id))
        }
        return <SectionReview cards={cards} />
    }

    return <Observer>{() => {
        return <Container>
            <div className={classNames("LessonView")}>
                <h1 className="title">
                    {lesson.title} {lesson.draft && <span className="draft-marker">Draft</span>}
                </h1>
                <h3 className="subtitle">
                    {lesson.subtitle}
                </h3>
                <Markdown overrides={{ SectionReview: SectionReviewMarkdown }}>{lessonText}</Markdown>
                {'steps' in lesson.def ? <section id="steps">
                    <Markdown>{lesson.def.steps}</Markdown>
                </section> : undefined}
                { }
                <div className="authorship">
                    Written by {lesson.author}
                </div>
                {lesson.furtherReading ? <section id="furtherReading">
                    <h2>Further Reading</h2>
                    <Markdown>{lesson.furtherReading}</Markdown>
                </section> : undefined}
                {lesson.notes ? <section id="notes">
                    <h2>Notes</h2>
                    <Markdown>{lesson.notes}</Markdown>
                </section> : undefined}
                {referencesInText.length ? <section id="references">
                    <h2>References</h2>
                    <Bibliography references={referencesInText} />
                </section> : undefined}
            </div>
        </Container>
    }}</Observer>
}