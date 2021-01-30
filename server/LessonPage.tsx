import * as React from 'react'
import { Head } from "./Head"
import { htmlToPlaintext, resolveAsset } from './utils'
import type { Lesson } from "../common/content"
import { SiteHeader } from "../common/SiteHeader"
import { SiteFooter } from "./SiteFooter"
import Markdown from "markdown-to-jsx"
import { renderToStaticMarkup } from "react-dom/server"
import { LessonView } from '../common/LessonView'

export function LessonPage(props: { lesson: Lesson }) {
    const { lesson } = props

    const intro = renderToStaticMarkup(<Markdown>{lesson.text.replace(/\[@[^\]]+\]/g, '')}</Markdown>)
    const pageDesc = lesson.summaryLine || htmlToPlaintext(intro).split("\n\n")[0]

    const script = `window.hydrateLesson("${lesson.id}")`

    return <html lang="en">
        <Head pageTitle={lesson.title} canonicalUrl={`/${lesson.slug}`} pageDesc={pageDesc}>
            {/* {lesson.draft ? <meta name="robots" content="noindex" /> : null} */}
        </Head>

        <body>
            <SiteHeader />
            <main className="LessonPage">
                <div className="lessonContainer">
                    <LessonView lesson={lesson} />
                </div>
                <SiteFooter />
            </main>
            <script src={resolveAsset("app.js")}></script>
            <script dangerouslySetInnerHTML={{ __html: script }} />
        </body>
    </html>
}
