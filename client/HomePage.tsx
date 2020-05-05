import React = require("react")
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import { Concept } from "../shared/sunpedia"
import { ExerciseProgressItem } from "../shared/logic"
import _ = require("lodash")
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext, useEffect, useRef } from "react"
import { showReviewTime } from "./ConceptPage"
import { DebugTools } from "./DebugTools"

declare const process: any

interface ConceptWithProgress {
    concept: Concept
    progress?: ExerciseProgressItem
}
export function HomePage() {
    const { app, sunpedia } = useContext(AppContext)

    const debug = process.env.NODE_ENV === "development"

    return useObserver(() => <AppLayout>
        <main className="HomePage">
            {!app.loading && <Container className="mt-4">
                <p>Dawnguide is a tool for learning useful concepts in psychology that can be applied to everyday life.</p>
                <p>I haven't written many lessons yet, but the system should be functional. Thanks for testing! 💛</p>
                {app.exercisesWithProgress.length ? <>
                    <h4>Learning progress</h4>
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Concept</th>
                                <th>Exercise</th>
                                <th>Level</th>
                                <th>Next Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {app.exercisesWithProgress.map(item => <tr key={item.exercise.id}>
                                <td><Link to={`/concept/${item.exercise.conceptId}`}>{sunpedia.conceptById[item.exercise.conceptId].title}</Link></td>
                                <td style={{ maxWidth: '300px' }}>{item.exercise.question}</td>
                                <td>{item.progress ? item.progress.level : 0}</td>
                                <td>{app.reviews.some(r => r.exercise.id === item.exercise.id) ? "Available now" : showReviewTime(item)}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </> : undefined}
                {debug ? <DebugTools /> : undefined}
            </Container>}
        </main>
    </AppLayout>)
}