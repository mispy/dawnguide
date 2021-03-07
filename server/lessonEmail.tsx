import * as React from 'react'
import type { Lesson } from "../common/content"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { renderToStaticMarkup } from "react-dom/server"
import type { MarkdownString, UserInfo } from '../common/types'
import _ from 'lodash'
import { Bibliography } from '../common/Bibliography'
import { emailHtmlTemplate } from './emailUtils'
import { isExternalUrl, absurl } from '../common/utils'
import { sendMail } from './mail'
import * as db from './db'

export async function sendLessonEmail(user: UserInfo, lesson: Lesson) {
    const loginToken = await db.emailConfirmTokens.create(user.id, user.email)
    return sendMail({
        to: user.email,
        from: "Dawnguide <articles@dawnguide.com>",
        subject: lesson.title,
        html: lessonEmailHtml(loginToken, lesson)
    })
}

export function lessonEmailHtml(loginToken: string, lesson: Lesson) {
    const innerBody = renderToStaticMarkup(<LessonEmailBody lesson={lesson} />)
    return emailHtmlTemplate(loginToken, innerBody, `
    html {
        font-family: 'SF Pro Display',-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
        color:#1a1a1a;
        font-size:16px;
        line-height:26px;
        margin:0 0 1em 0;
    }

    a, a:hover {
        color: #008656;
        text-decoration: none;
    }

    sup {
        font-size: 12px;
    }

    img {
        display: block;
        margin: auto;
    }

    h1 {
        color: #1a1a1a;
        font-family: 'Roboto Slab',sans-serif;
        font-size: 2em;
        font-weight: 700;
        line-height: 130%;
        margin: 0.378em 0 0 0;
    }

    h3 {
        color: #757575;
        font-family: 'SF Compact Display',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
        font-size: 19px;
        font-weight: normal;
        line-height: 1.16em;
        margin: 4px 0 0;
    }

    .align-center {
        width: 100%;
        text-align: center;
    }

    .btn-dawn {
        background: #008656;
        color: #fff;

        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    section table th {
        text-align: left;
    }

    section table td {
        border-top: 1px solid #dee2e6;
    }

    #references ol, #furtherReading ul {
        padding-left: 0;
    }

    #references li, #furtherReading li {
        margin-left: 20px;
        padding-left: 5px;
        list-style-position: outside;
        margin-bottom: 1em;
    }
`)
}

function AbsLink(props: { href: string }) {
    if (isExternalUrl(props.href)) {
        return <a target="_blank" {...props} />
    } else {
        return <a href={absurl(props.href)} {..._.omit(props, 'href')} />
    }
}

function AbsImg(props: { src: string }) {
    if (isExternalUrl(props.src)) {
        return <img {...props} />
    } else {
        return <img src={absurl(props.src)} {..._.omit(props, 'src')} />
    }
}

export function LessonEmailBody(props: { lesson: Lesson }) {
    const { lesson } = props
    const referencesById = _.keyBy(lesson.references, r => r.id)
    const [lessonText, referenceIds] = transformRefs(lesson.text, lesson.id)
    const referencesInText = referenceIds.map(id => referencesById[id]!)

    function ReviewLink() {
        return <div className="align-center"><a className="btn btn-dawn" href={absurl(`/${lesson.slug}`)}>Review {lesson.name}</a></div>
    }

    const markdownOptions = {
        overrides: {
            a: AbsLink,
            img: AbsImg,
            SectionReview: ReviewLink
        }
    }

    return <>
        <div style={{ display: "none" }}>
            {/* What's this super weird thing? It's a hack to make gmail show the subtitle as the content preview. */}
            {lesson.subtitle} {_.range(80).map(() => <>&#8204;&#160;</>)}
        </div>
        <h1>
            {lesson.title}
        </h1>
        <h3>
            {lesson.subtitle}
        </h3>
        <section>
            <Markdown options={markdownOptions}>{lessonText}</Markdown>
        </section>
        {lesson.furtherReading ? <section id="furtherReading">
            <h2>Further Reading</h2>
            <Markdown options={markdownOptions}>{lesson.furtherReading}</Markdown>
        </section> : undefined}
        {lesson.notes ? <section id="notes">
            <h2>Notes</h2>
            <Markdown options={markdownOptions}>{lesson.notes}</Markdown>
        </section> : undefined}
        {referencesInText.length ? <section id="references">
            <h2>References</h2>
            <Bibliography references={referencesInText} />
        </section> : undefined}
    </>
}

function transformRefs(markdown: MarkdownString, lessonId: string): [MarkdownString, string[]] {
    const referenceIds: string[] = []
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id) => {
        let index = referenceIds.indexOf(id)
        if (index === -1) {
            index = referenceIds.length
            referenceIds.push(id)
        }
        return `<a href="${absurl(lessonId)}#${id}"><sup>[${index + 1}]</sup></a>`
    })
    return [content, referenceIds]
}