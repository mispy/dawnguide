import React = require("react")
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import { Concept } from "../shared/sunpedia"
import { ExerciseProgressItem } from "../shared/logic"
import _ = require("lodash")
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { showReviewTime } from "./ConceptPage"

interface ConceptWithProgress {
  concept: Concept
  progress?: ExerciseProgressItem
}

export function HomePage() {
  const { store, sunpedia } = useContext(AppContext)

  return useObserver(() => <AppLayout>
    <Container style={{ marginTop: "2rem", textAlign: "left" }}>
      <p>Sunpeep is a tool for learning useful concepts in psychology that can be applied to everyday life.</p>
      {store.exercisesWithProgress.length ? <>
        <h3>Progress</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Concept</th>
              <th>Exercise</th>
              <th>Level</th>
              <th>Next Review</th>
            </tr>
          </thead>
          <tbody>
            {store.exercisesWithProgress.map(item => <tr key={item.exercise.id}>
              <td><Link to={`/concept/${item.exercise.conceptId}`}>{sunpedia.conceptById[item.exercise.conceptId].title}</Link></td>
              <td style={{ maxWidth: '300px' }}>{item.exercise.question}</td>
              <td>{item.progress ? item.progress.level : 0}</td>
              <td>{showReviewTime(item)}</td>
            </tr>)}
          </tbody>
        </table>
      </> : undefined}
    </Container>
  </AppLayout>)
}