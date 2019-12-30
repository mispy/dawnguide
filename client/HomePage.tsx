import React = require("react")
import { observer } from "mobx-react"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./context"
import { conceptById, Concept, concepts } from "./concepts"
import { observable, runInAction } from "mobx"
import { ConceptProgressItem } from "../shared/types"
import _ = require("lodash")

interface ConceptWithProgress {
    concept: Concept
    level: number
}

@observer
export class HomePage extends React.Component {
    static contextType = AppContext
    declare context: React.ContextType<typeof AppContext>
    @observable conceptsWithProgress: ConceptWithProgress[] = []

    componentDidMount() {
        this.getProgress()
    }

    async getProgress() {
        const progress = await this.context.api.getProgress()
        console.log(progress)

        const conceptsWithProgress: ConceptWithProgress[] = []
        for (const concept of concepts) {
            const item = progress.concepts[concept.id]
            // if (!item) continue

            conceptsWithProgress.push({
                concept: concept,
                level: item ? item.level : 0
            })
        }

        runInAction(() => this.conceptsWithProgress = conceptsWithProgress)
    }

    render() {
        const { conceptsWithProgress } = this

        return <AppLayout>
            <div style={{ marginTop: "2rem", textAlign: "left" }}>
                <p>Sunpeep is a tool for learning useful concepts in psychology that can be applied to everyday life.</p>
                {conceptsWithProgress.length ? <>
                    <h3>Progress</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Concept</th>
                                <th>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conceptsWithProgress.map(item => <tr>
                                <td>{item.concept.title}</td>
                                <td>{item.level}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </> : undefined}
            </div>
        </AppLayout>
    }
}