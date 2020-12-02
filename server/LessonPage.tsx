import * as React from 'react'
import { Head } from "./Head"
import { htmlToPlaintext } from './utils'
import { Lesson } from "../common/content"
import { Passage } from '../common/Passage'
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"

export function LessonPage(props: { lesson: Lesson }) {
    const { lesson } = props

    const intro = renderToStaticMarkup(<Markdown>{lesson.text.replace(/\[@[^\]]+\]/g, '')}</Markdown>)
    const pageDesc = lesson.summaryLine || htmlToPlaintext(intro).split("\n\n")[0]

    return <html lang="en">
        <Head pageTitle={lesson.title} canonicalUrl={`/${lesson.slug}`} pageDesc={pageDesc}>
            {lesson.draft ? <meta name="robots" content="noindex" /> : null}
        </Head>

        <body>
            <SiteHeader />
            <main className="LessonPage">
                <div className="container">
                    <Passage lesson={lesson} />
                    <section>
                        <div className="text-right">
                            {lesson.type === 'reading' && <a href={`/review/${lesson.slug}`} className="btn btn-dawn">Review {lesson.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>}
                            {lesson.type === 'meditation' && <a href={`/login?then=${encodeURIComponent(`/${lesson.slug}`)}`} className="btn btn-dawn">Log in to try {lesson.name.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>}
                        </div>
                    </section>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
