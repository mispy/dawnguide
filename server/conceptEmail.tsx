import * as React from 'react'
import { Concept } from "../shared/sunpedia"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"
import { MarkdownString } from '../shared/types'
import _ from 'lodash'
import { Bibliography } from '../shared/Bibliography'
import { emailHtmlTemplate } from './emailUtils'
import { isExternalUrl, absurl } from '../shared/utils'

export function conceptEmailHtml(concept: Concept) {
    const body = renderToStaticMarkup(<ConceptEmailBody concept={concept} />)
    return emailHtmlTemplate(body, `
    a {
        color: #c33071;
        text-decoration: none;
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

    #furtherReading ul {
        padding-left: 0;
    }

    #references ol {
        padding-left: 0;
    }

    #references li {
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

    return <body>
        <h1>
            {concept.title}
        </h1>
        <Markdown options={markdownOptions}>{introduction}</Markdown>
        {concept.furtherReading ? <section id="furtherReading">
            <h2>Further Reading</h2>
            <Markdown options={markdownOptions}>{concept.furtherReading}</Markdown>
        </section> : undefined}
        {referencesInText.length ? <section id="references">
            <h2>References</h2>
            <Bibliography references={referencesInText} />
        </section> : undefined}
        <div className="text-right">
            <a href={absurl(`/review/${concept.id}`)} className="btn btn-dawn">Continue to review <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
    </body>
}

function transformRefs(markdown: MarkdownString, conceptId: string): [MarkdownString, string[]] {
    const referenceIds: string[] = []
    let i = 0
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id) => {
        referenceIds.push(id)
        i += 1
        return `<a href="${absurl(conceptId)}#${id}"><sup>[${i}]</sup></a>`
    })
    return [content, referenceIds]
}