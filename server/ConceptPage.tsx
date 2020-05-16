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
        <Head pageTitle={concept.title} canonicalUrl={`/concepts/${concept.id}`} pageDesc={pageDesc}>
            {concept.draft ? <meta name="robots" content="noindex" /> : null}
        </Head>

        <body>
            <SiteHeader />
            <main className="ConceptPage">
                <div className="container">
                    <Passage concept={concept} />
                    <section>
                        <div className="text-right">
                            <a href={`/review/${concept.id}`} className="btn btn-dawn">Continue to review <FontAwesomeIcon icon={faArrowRight} /></a>
                        </div>
                    </section>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
