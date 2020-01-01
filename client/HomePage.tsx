import React = require("react")
import { observer } from "mobx-react"
import { AppLayout } from "./AppLayout"
import { AppContext } from "./context"
import { Concept, concepts } from "../shared/concepts"
import { observable, runInAction, computed } from "mobx"
import { ConceptProgressItem, isReadyForReview } from "../shared/logic"
import _ = require("lodash")

interface ConceptWithProgress {
    concept: Concept
    progress?: ConceptProgressItem
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
                progress: item
            })
        }

        runInAction(() => this.conceptsWithProgress = conceptsWithProgress)
    }

    @computed get numLessons() {
        return this.conceptsWithProgress.length ? this.conceptsWithProgress.filter(c => c.progress === undefined).length : undefined
    }

    @computed get numReviews() {
        return this.conceptsWithProgress.filter(c => c.progress && isReadyForReview(c.progress)).length
    }

    render() {
        const { conceptsWithProgress, numLessons, numReviews } = this

        return <AppLayout numLessons={numLessons} numReviews={numReviews}>
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
                                <td>{item.progress ? item.progress.level : 0}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </> : undefined}
            </div>
        </AppLayout>
    }
}