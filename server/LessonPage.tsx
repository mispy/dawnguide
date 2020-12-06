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
import classNames from 'classnames'
import { Bibliography, transformRefs } from '../common/Bibliography'

export function LessonPage(props: { lesson: Lesson }) {
    const { lesson } = props
    const [lessonText, referenceIds] = transformRefs(lesson.text)
    const referencesInText = referenceIds.map(id => lesson.expectReference(id))

    const intro = renderToStaticMarkup(<Markdown>{lesson.text.replace(/\[@[^\]]+\]/g, '')}</Markdown>)
    const pageDesc = lesson.summaryLine || htmlToPlaintext(intro).split("\n\n")[0]

    return <html lang="en">
        <Head pageTitle={lesson.title} canonicalUrl={`/${lesson.slug}`} pageDesc={pageDesc}>
            {/* {lesson.draft ? <meta name="robots" content="noindex" /> : null} */}
        </Head>

        <body>
            <SiteHeader />
            <main className="LessonPage">
                <div className="container">
                    <div className="Passage">
                        <h1>
                            {lesson.title}
                        </h1>
                        <Markdown>{lessonText}</Markdown>
                        {'steps' in lesson.def ? <section id="steps">
                            <Markdown>{lesson.def.steps}</Markdown>
                        </section> : undefined}
                        <div className="authorship">
                            Written by {lesson.author}
                        </div>
                        <section>
                            <div className="text-right">
                                {lesson.type === 'reading' && <a href={`/review/${lesson.slug}`} className="btn btn-dawn">Review {lesson.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>}
                                {lesson.type === 'meditation' && <a href={`/login?then=${encodeURIComponent(`/${lesson.slug}`)}`} className="btn btn-dawn">Log in to try {lesson.name.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>}
                            </div>
                        </section>
                        {lesson.furtherReading ? <section id="furtherReading">
                            <h2>Further Reading</h2>
                            <Markdown>{lesson.furtherReading}</Markdown>
                        </section> : undefined}
                        {lesson.notes ? <section id="notes">
                            <h2>Notes</h2>
                            <Markdown>{lesson.notes}</Markdown>
                        </section> : undefined}
                        {referencesInText.length ? <section id="references">
                            <h2>References</h2>
                            <Bibliography references={referencesInText} />
                        </section> : undefined}
                    </div>
                </div>
                <SiteFooter />
            </main>
        </body>
    </html>
}
