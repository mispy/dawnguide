import { useContext } from "react"
import React = require("react")

import { AppContext } from "./AppContext"

export function DebugTools() {
    const { app, api } = useContext(AppContext)

    const moveReviewsForward = async () => {
        await api.debug.moveReviewsForward()
        await app.loadProgress()
    }

    const resetProgress = async () => {
        await api.debug.resetProgress()
        await app.loadProgress()
    }

    return <section className="DebugTools mt-4">
        <p><button className="btn btn-outline-dawn btn-sm" onClick={moveReviewsForward}>Debug: Move Reviews Forward</button></p>
        <p><button className="btn btn-outline-dawn btn-sm" onClick={resetProgress}>Debug: Reset Progress</button></p>
    </section>
}
