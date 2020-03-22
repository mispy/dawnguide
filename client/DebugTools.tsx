import * as React from 'react'
import { AppContext } from "./AppContext"
import { useContext } from 'react'


export const DebugTools = () => {
  const { api } = useContext(AppContext)

  const moveReviewsForward = () => {

  }

  return <div className="DebugTools">
    Debug Tools
        <button className="btn" onClick={moveReviewsForward}>
      Move Reviews Forward
        </button>
  </div>
}