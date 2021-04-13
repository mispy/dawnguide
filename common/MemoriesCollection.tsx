import * as React from 'react'
import { Observer } from "mobx-react-lite"
import _ from 'lodash'
import { Container } from "react-bootstrap"
import { content } from '../common/content'
import { useProgressiveEnhancement } from '../common/ProgressiveEnhancement'
import type { Card } from './types'
import { Markdown } from '../common/Markdown'
import { expandRefsInline } from './Bibliography'

function MemoryItem(props: { memory: Card }) {
    const { memory } = props
    const { plan } = useProgressiveEnhancement()

    const canonicalAnswer = memory.possibleAnswers[0]!
    const parts = memory.question.split(/_+/)
    const prompt: (React.ReactElement | string)[] = []
    for (let i = 0; i < parts.length; i++) {
        prompt.push(parts[i]!)
        if (i !== parts.length - 1) {
            prompt.push(<span className="cloze" key={i} style={{ minWidth: canonicalAnswer.length * 9 }}>{canonicalAnswer}</span>)
        }
    }

    return <Observer>{() => {
        return <li key={memory.id} className="MemoryItem">
            <p>{prompt}</p>
            {memory.source && <Markdown>{expandRefsInline(memory.source, memory.lesson.references)}</Markdown>}
        </li>
    }}</Observer>
}

export function MemoriesCollection() {
    const exercises = content.exercises

    return <Observer>{() =>
        <div className="MemoriesCollection">
            <Container className="mt-2">
                <ul>
                    {exercises.map(memory => <MemoryItem key={memory.id} memory={memory} />)}
                </ul>
            </Container>
        </div>
    }</Observer>
}