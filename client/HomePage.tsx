import * as React from 'react'
import { useObserver } from "mobx-react-lite"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./AppContext"
import * as _ from 'lodash'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { showReviewTime } from "./ConceptPage"
import { DebugTools } from "./DebugTools"
import { IS_PRODUCTION } from "./settings"

export function HomePage() {
    const { app, sunpedia } = useContext(AppContext)

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
                                <td><Link className="text-link" to={`/${item.exercise.conceptId}`}>{sunpedia.conceptById[item.exercise.conceptId].title}</Link></td>
                                <td style={{ maxWidth: '300px' }}>{item.exercise.question}</td>
                                <td>{item.progress ? item.progress.level : 0}</td>
                                <td>{app.reviews.some(r => r.exercise.id === item.exercise.id) ? "Available now" : showReviewTime(item)}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </> : undefined}
                {!IS_PRODUCTION ? <DebugTools /> : undefined}
            </Container>}
        </main>
    </AppLayout>)
}