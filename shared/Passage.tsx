import * as React from 'react'
import * as _ from 'lodash'
import Markdown from 'markdown-to-jsx'

import { Lesson } from "./content"
import { Bibliography } from "./Bibliography"
import { MarkdownString } from "./types"
import classNames from 'classnames'
import { IS_SERVER } from './settings'
import { isExternalUrl } from './utils'
import { HashLink as Link } from 'react-router-hash-link'

function transformRefs(markdown: MarkdownString): [MarkdownString, string[]] {
    const referenceIds: string[] = []   
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id) => {
        let index = referenceIds.indexOf(id)
        if (index === -1) {
            index = referenceIds.length
            referenceIds.push(id)
        }
        return `<a href="#${id}"><sup>[${index+1}]</sup></a>`
    })
    return [content, referenceIds]
}

function SmartLink(props: { href: string }) {
    if (isExternalUrl(props.href)) {
        return <a target="_blank" {...props} className="text-link"  />
    } else if (IS_SERVER) {
        return <a href={props.href} {..._.omit(props, 'href')} className="text-link"/>
    } else {
        return <Link to={props.href} {..._.omit(props, 'href')} className="text-link"/>
    }
}

export function Passage(props: { lesson: Lesson }) {
    const { lesson } = props
    const referencesById = _.keyBy(lesson.references, r => r.id)

    const [introduction, referenceIds] = transformRefs(lesson.introduction)
    const referencesInText = referenceIds.map(id => referencesById[id])

    const markdownOptions = {
        overrides: {
            a: SmartLink,
        }
    }

    return <div className={classNames("Passage", lesson.subtitle && 'hasSubtitle')}>
        <h1>
            {lesson.title} {lesson.draft && <span className="draft-marker">// Draft</span>}
        </h1>
        {lesson.subtitle && <div className="subtitle">
            {lesson.subtitle}
        </div>}
        <Markdown options={markdownOptions}>{introduction}</Markdown>
        <div className="authorship">
            Written by {lesson.author}
        </div>
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
    </div>
}