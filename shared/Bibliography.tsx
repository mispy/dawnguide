import React = require("react")

import { Reference } from "./types"

export function BibliographyReference(props: { reference: Reference }) {
  const ref = props.reference

  // Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354.

  const authorParts = ref.author.map(a => {
    const initials = a.given.split(/ /g).map(n => n[0] + '.').join(" ")
    return `${a.family}, ${initials}`
  })

  const authorStr = [authorParts.slice(0, -1).join(", "), authorParts.slice(-1)].join(" & ")

  const year = ref.issued['date-parts'][0]

  return <li id={ref.id}>
    {authorStr} ({year}). <a href={ref.URL}>{ref.title}</a> <em>{ref['container-title']}</em>, <em>{ref.volume}</em>({ref.issue}), {ref.page}.
  </li>
}

export function Bibliography(props: { references: Reference[] }) {
  return <ol>
    {props.references.map(ref => <BibliographyReference key={ref.id} reference={ref} />)}
  </ol>
}