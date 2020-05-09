import * as React from 'react'
import { Head } from "./Head"
import { htmlToPlaintext } from './utils'
import { Concept } from "../shared/sunpedia"
import { Passage } from '../shared/Passage'
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"

export function ConceptPage(props: { concept: Concept }) {
    const { concept } = props

    const intro = renderToStaticMarkup(<Markdown>{concept.introduction.replace(/\[@[^\]]+\]/g, '')}</Markdown>)
    const pageDesc = htmlToPlaintext(intro).split("\n\n")[0]

    return <html lang="en">
        <Head pageTitle={concept.title} canonicalUrl={`/concepts/${concept.id}`} pageDesc={pageDesc} />

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
                        <a href="/login" className="btn btn-outline-dawn">Sign in to memorize <FontAwesomeIcon icon={faArrowRight} /></a>
                    </section>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
