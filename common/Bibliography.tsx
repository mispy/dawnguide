import * as React from 'react'

import type { Reference, MarkdownString } from "./types"

export function transformRefs(markdown: MarkdownString): [MarkdownString, string[]] {
    const referenceIds: string[] = []
    const content = markdown.replace(/\[@([^\]]+)\]/g, (substr, id: string) => {
        id = id.toLowerCase()
        let index = referenceIds.indexOf(id)
        if (index === -1) {
            index = referenceIds.length
            referenceIds.push(id)
        }
        return `<a href="#${id}"><sup>[${index + 1}]</sup></a>`
    })
    return [content, referenceIds]
}

export function transformRefsMultipart(parts: MarkdownString[]): [MarkdownString[], string[]] {
    const referenceIds: string[] = []
    const transformed = parts.map(part => part.replace(/\[@([^\]]+)\]/g, (substr, id: string) => {
        id = id.toLowerCase()
        let index = referenceIds.indexOf(id)
        if (index === -1) {
            index = referenceIds.length
            referenceIds.push(id)
        }
        return `<a href="#${id}"><sup>[${index + 1}]</sup></a>`
    }))
    return [transformed, referenceIds]
}

export function BibliographyReference(props: { reference: Reference }) {
    const ref = props.reference

    // e.g. Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354.

    const authorParts = ref.author.map(a => {
        if (a.given) {
            const initials = a.given.split(/ /g).map(n => n[0] + '.').join(" ")
            return `${a.family}, ${initials}`
        } else {
            return a.family
        }
    })


    const authorStr = authorParts.length === 1 ? authorParts[0] : [authorParts.slice(0, -1).join(", "), authorParts.slice(-1)].join(" & ")

    // Only link the title through if it's an open-access paper
    const titleMaybeLink = ref.open || ref.url ? <a className="text-link" href={ref.open || ref.url} target="_blank" rel="noopener">{ref.title}</a> : ref.title

    // Otherwise we append method of access to the end of the reference
    const links = <>
        {ref.pdf && <a className="text-link" href={ref.pdf} target="_blank" rel="noopener">[pdf]</a>}
        {ref.scihub && <a className="text-link" href={ref.scihub} target="_blank" rel="noopener">[scihub]</a>}
    </>

    let format = <></>
    if (ref.volume && ref.issue && ref.page) {
        format = <>{authorStr} ({ref.year}). {titleMaybeLink} <em>{ref.journal}</em>, <em>{ref.volume}</em>({ref.issue}), {ref.page.replace("--", "—")}. {links}</>
    } else {
        format = <>{authorStr} ({ref.year}). {titleMaybeLink} <em>{ref.journal || ref.publisher}</em>. {links}</>
    }


    return <li id={ref.id}>
        {format}
    </li>
}

export function Bibliography(props: { references: Reference[] }) {
    return <ol>
        {props.references.map(ref => <BibliographyReference key={ref.id} reference={ref} />)}
    </ol>
}