import { useEffect, useRef } from "react"
import { useLocalStore, observer } from "mobx-react-lite"
import * as React from 'react'
import type { MeditationLesson } from "../common/content"
import Markdown from "markdown-to-jsx"
import { MeditationTimer } from "./MeditationTimer"


export function MeditationCard(props: { lesson: MeditationLesson, onSubmit: (remembered: boolean) => void }) {
    const { lesson } = props
    const state = useLocalStore(() => ({ showSteps: false })) as { showSteps: boolean }
    return <div className="MeditationCard card">
        <h4 className="mb-4">Meditation Review: {lesson.title}</h4>
        <MeditationTimer seconds={lesson.def.seconds} />
        <div className="d-flex mt-2 align-items-center">
            <div className="ml-auto">
                <button onClick={() => props.onSubmit(false)} className="btn mr-2 text-secondary">Skip for now</button>
                <button onClick={() => props.onSubmit(true)} className="btn btn-dawn">I've finished meditating</button>
            </div>
        </div>
        <Markdown className="mt-4">{lesson.def.steps}</Markdown>
    </div>
}