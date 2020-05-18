import * as React from 'react'
import * as _ from 'lodash'
import Markdown from 'markdown-to-jsx'

import { Concept } from "./sunpedia"
import { Bibliography } from "./Bibliography"
import { MarkdownString } from "./types"
import classNames from 'classnames'

function transformRefs(markdown: MarkdownString): [MarkdownString, string[]] {
    const referenceIds: string[] = []
    let i = 0
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id) => {
        referenceIds.push(id)
        i += 1
        return `<a href="#${id}"><sup>[${i}]</sup></a>`
    })
    return [content, referenceIds]
}

function ExternalLink(props: any) {
    const newProps = _.extend({ target: "_blank" }, props)
    return <a {...newProps}/>
}

export function Passage(props: { concept: Concept }) {
    const { concept } = props
    const referencesById = _.keyBy(concept.references, r => r.id)

    const [introduction, referenceIds] = transformRefs(concept.introduction)
    const referencesInText = referenceIds.map(id => referencesById[id])

    const markdownOptions = {
        overrides: {
            a: ExternalLink,
        },

    }

    // TODO target=_blank in further reading
    return <div className={classNames("Passage", concept.subtitle && 'hasSubtitle')}>
        <h1>
            {concept.title} {concept.draft && <span className="draft-marker">// Draft</span>}
        </h1>
        {concept.subtitle && <div className="subtitle">
            {concept.subtitle}
        </div>}
        <Markdown>{introduction}</Markdown>
        <div className="authorship">
            Written by {concept.author}
        </div>
        {referencesInText.length ? <section id="references">
            <h2>References</h2>
            <Bibliography references={referencesInText} />
        </section> : undefined}
        {concept.furtherReading ? <section id="furtherReading">
            <h2>Further Reading</h2>
            <Markdown options={markdownOptions}>{concept.furtherReading}</Markdown>
        </section> : undefined}
    </div>
}