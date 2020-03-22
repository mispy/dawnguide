import React = require("react")
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import { Concept } from "../shared/sunpedia"
import { ConceptProgressItem } from "../shared/logic"
import _ = require("lodash")
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"

interface ConceptWithProgress {
  concept: Concept
  progress?: ConceptProgressItem
}

export function HomePage() {
  const { store } = useContext(AppContext)

  return useObserver(() => <AppLayout>
    <Container style={{ marginTop: "2rem", textAlign: "left" }}>
      <p>Sunpeep is a tool for learning useful concepts in psychology that can be applied to everyday life.</p>
      {store.conceptsWithProgress.length ? <>
        <h3>Progress</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Concept</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {store.conceptsWithProgress.map(item => <tr key={item.concept.id}>
              <td><Link to={`/concept/${item.concept.id}`}>{item.concept.title}</Link></td>
              <td>{item.progress ? item.progress.level : 0}</td>
            </tr>)}
          </tbody>
        </table>
      </> : undefined}
    </Container>
  </AppLayout>)
}