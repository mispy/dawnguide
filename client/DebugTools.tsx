import { useContext } from "react"
import React = require("react")

import { AppContext } from "./AppContext"

export function DebugTools() {
  const { store, api } = useContext(AppContext)

  const moveReviewsForward = async () => {
    await api.debug.moveReviewsForward()
    await store.loadProgress()
  }

  const resetProgress = async () => {
    await api.debug.resetProgress()
    await store.loadProgress()
  }

  return <section className="DebugTools">
    <p><button className="btn" onClick={moveReviewsForward}>Debug: Move Reviews Forward</button></p>
    <p><button className="btn" onClick={resetProgress}>Debug: Reset Progress</button></p>
  </section>
}
