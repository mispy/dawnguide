import * as React from 'react'
import { Concept } from "../shared/sunpedia"
import Markdown from "markdown-to-jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { renderToStaticMarkup } from "react-dom/server"
import { MarkdownString } from '../shared/types'
import _ from 'lodash'
import { Bibliography } from '../shared/Bibliography'
import { absurl } from './utils'
import { emailHtmlTemplate } from './emailUtils'

export function conceptEmailHtml(concept: Concept) {
    const body = renderToStaticMarkup(<ConceptEmailBody concept={concept} />)
    return emailHtmlTemplate(body, `
    a {
        color: #c33071
    }
`)
}

export function ConceptEmailBody(props: { concept: Concept }) {
    const { concept } = props
    const referencesById = _.keyBy(concept.references, r => r.id)
    const [introduction, referenceIds] = transformRefs(concept.introduction, concept.id)
    const referencesInText = referenceIds.map(id => referencesById[id])

    return <body>
        <Markdown>{introduction}</Markdown>
        {concept.furtherReading ? <section id="furtherReading">
            <h2>Further Reading</h2>
            <Markdown>{concept.furtherReading}</Markdown>
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