import { useContext } from "react"
import * as React from 'react'
import { expectAuthed } from "../common/ProgressiveEnhancement"

export function DebugTools() {
    const { authed, api } = expectAuthed()

    const moveReviewsForward = async () => {
        await api.debug.moveReviewsForward()
        await authed.loadProgress()
    }

    const resetProgress = async () => {
        await api.debug.resetProgress()
        await authed.loadProgress()
    }

    return <section className="DebugTools mt-4">
        <p><button className="btn btn-outline-dawn btn-sm" onClick={moveReviewsForward}>Debug: Move Reviews Forward</button></p>
        <p><button className="btn btn-outline-dawn btn-sm" onClick={resetProgress}>Debug: Reset Progress</button></p>
    </section>
}
