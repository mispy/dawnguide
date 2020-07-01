import * as React from 'react'
import { Concept } from "../shared/sunpedia"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"
import { MarkdownString, User } from '../shared/types'
import _ from 'lodash'
import { Bibliography } from '../shared/Bibliography'
import { emailHtmlTemplate } from './emailUtils'
import { isExternalUrl, absurl } from '../shared/utils'
import { sendMail } from './mail'
import * as db from './db'

export async function sendConceptEmail(user: User, concept: Concept) {
    const loginToken = await db.emailConfirmTokens.create(user.id, user.email)
    return sendMail({
        to: user.email,
        subject: concept.title + ": " + concept.tagLine,
        html: conceptEmailHtml(loginToken, concept)
    })
}

export function conceptEmailHtml(loginToken: string, concept: Concept) {
    const innerBody = renderToStaticMarkup(<ConceptEmailBody concept={concept} />)
    return emailHtmlTemplate(loginToken, innerBody, `
    a {
        color: #c33071;
        text-decoration: none;
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    img {
        display: block;
        margin: auto;
    }

    h1 {
        margin-bottom: 1rem;
    }

    .btn-dawn {
        background: #c33071;
        color: white;
        float: right;

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

    .btn-dawn:hover {
        color: white;
        background: #9a2659;
        text-decoration: none;
    }

    blockquote {
        font-style: italic;
        padding-left: 15px;
        border-left: 4px solid #c33071;
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


export function ConceptEmailBody(props: { concept: Concept }) {
    const { concept } = props
    const referencesById = _.keyBy(concept.references, r => r.id)
    const [introduction, referenceIds] = transformRefs(concept.introduction, concept.id)
    const referencesInText = referenceIds.map(id => referencesById[id])

    const markdownOptions = {
        overrides: {
            a: AbsLink,
            img: AbsImg
        }
    }

    return <>
        <h1>
            {concept.title}
        </h1>
        <Markdown options={markdownOptions}>{introduction}</Markdown>
        {concept.furtherReading ? <section id="furtherReading">
            <h2>Further Reading</h2>
            <Markdown options={markdownOptions}>{concept.furtherReading}</Markdown>
        </section> : undefined}
        {concept.notes ? <section id="notes">
            <h2>Notes</h2>
            <Markdown options={markdownOptions}>{concept.notes}</Markdown>
        </section> : undefined}
        {referencesInText.length ? <section id="references">
            <h2>References</h2>
            <Bibliography references={referencesInText} />
        </section> : undefined}
        <div className="text-right">
            <a href={absurl(`/review/${concept.id}`)} className="btn btn-dawn">Review {concept.title.toLowerCase()} <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
    </>
}

function transformRefs(markdown: MarkdownString, conceptId: string): [MarkdownString, string[]] {
    const referenceIds: string[] = []
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id) => {
        let index = referenceIds.indexOf(id)
        if (index === -1) {
            index = referenceIds.length
            referenceIds.push(id)
        }
        return `<a href="${absurl(conceptId)}#${id}"><sup>[${index + 1}]</sup></a>`
    })
    return [content, referenceIds]
}