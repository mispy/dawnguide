import React = require("react")
import { MDXProvider } from "@mdx-js/react"
import { useContext } from "react"
import { Concept, Reference } from "../shared/sunpedia"
import _ = require("lodash")

const PassageContext: React.Context<{ store: { referenceById: Record<string, Reference>, referenceOrder: Reference[] } }> = React.createContext({}) as any

function Footnote(props: { id: string }) {
  const { store } = useContext(PassageContext)
  store.referenceOrder.push(store.referenceById[props.id])
  return <a href={`#${props.id}`}><sup>[{store.referenceOrder.length}]</sup></a>
}

function BibliographyReference(props: { reference: Reference }) {
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

function Bibliography() {
  const { store } = useContext(PassageContext)

  return <ol>
    {store.referenceOrder.map(ref => <BibliographyReference key={ref.id} reference={ref} />)}
  </ol>

}

export function Passage(props: { concept: Concept }) {
  const { concept } = props

  const store = {
    referenceById: _.keyBy(concept.references, ref => ref.id),
    referenceOrder: [],
    refcount: 0
  }
  const components = {
    ref: Footnote,
    Bibliography: Bibliography,
    wrapper: (props: any) => <>{props.children}</> // https://github.com/ChristopherBiscardi/gatsby-mdx/issues/378
  }
  return <PassageContext.Provider value={{ store: store }}>
    <MDXProvider components={components}>
      <concept.content />
    </MDXProvider>
  </PassageContext.Provider>
}