import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'
import { Sunpedia, Concept } from "../shared/sunpedia"
import { Passage } from '../shared/Passage'
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { getSession } from "./authentication"

export async function publicConceptPage(req: any, conceptId: string) {
    const sunpedia = new Sunpedia()

    const concept = sunpedia.getConcept(conceptId)

    if (!concept) {
        return new Response(`Unknown concept ${conceptId}`, { status: 404 })
    }

    return pageResponse(<ConceptPage concept={concept} />)
}

export function ConceptPage(props: { concept: Concept }) {
    const { concept } = props

    return <html lang="en">
        <Head pageTitle={concept.title} canonicalUrl={`/concepts/${concept.id}`} />

        <body>
            <SiteHeader />
            <main className="ConceptPage">
                <div className="container">
                    <Passage concept={concept} />
                    <section className="exercises">
                        <h2>Exercises</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {concept.exercises.map(e => <tr key={e.id}>
                                    <td><Markdown>{e.question}</Markdown></td>
                                    <td><Markdown>{e.answer}</Markdown></td>
                                </tr>)}
                            </tbody>
                        </table>
                        <a href="/login" className="btn btn-dawn-outline">Sign in to memorize <FontAwesomeIcon icon={faArrowRight} /></a>
                    </section>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
