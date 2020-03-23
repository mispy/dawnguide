import React = require("react")
import _ = require("lodash")
import Markdown from 'markdown-to-jsx'

import { Concept } from "./sunpedia"
import { Bibliography } from "./Bibliography"
import { MarkdownString } from "./types"

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

export function Passage(props: { concept: Concept }) {
  const { concept } = props
  const referencesById = _.keyBy(concept.references, r => r.id)

  const [introduction, referenceIds] = transformRefs(concept.introduction)
  const referencesInText = referenceIds.map(id => referencesById[id])

  return <div className="Passage">
    <h1>{concept.title}</h1>
    <Markdown>{introduction}</Markdown>
    <section id="references">
      <h2>References</h2>
      <Bibliography references={referencesInText} />
    </section>
    <section id="furtherReading">
      <h2>Further Reading</h2>
      <Markdown>{concept.furtherReading}</Markdown>
    </section>
  </div>
}