import * as React from 'react'
import { Head } from "./Head"
import { htmlToPlaintext } from './utils'
import { Lesson } from "../shared/content"
import { Passage } from '../shared/Passage'
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"

export function LessonPage(props: { lesson: Lesson }) {
    const { lesson } = props

    const intro = renderToStaticMarkup(<Markdown>{lesson.introduction.replace(/\[@[^\]]+\]/g, '')}</Markdown>)
    const pageDesc = lesson.summaryLine || htmlToPlaintext(intro).split("\n\n")[0]

    return <html lang="en">
        <Head pageTitle={lesson.title} canonicalUrl={`/Lessons/${lesson.id}`} pageDesc={pageDesc}>
            {lesson.draft ? <meta name="robots" content="noindex" /> : null}
        </Head>

        <body>
            <SiteHeader />
            <main className="LessonPage">
                <div className="container">
                    <Passage lesson={lesson} />
                    <section>
                        <div className="text-right">
                            <a href={`/review/${lesson.id}`} className="btn btn-dawn">Review {lesson.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>
                        </div>
                    </section>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
