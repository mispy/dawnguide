import React = require("react")
import { MDXProvider } from "@mdx-js/react"
import { useContext } from "react"

const PassageContext: React.Context<{ store: { refcount: number } }> = React.createContext({}) as any

function Reference(props: { id: string }) {
  const { store } = useContext(PassageContext)
  store.refcount += 1
  return <a href={`#${props.id}`}><sup>[{store.refcount}]</sup></a>
}

export function Passage(props: { content: (props: any) => JSX.Element }) {
  const store = { refcount: 0 }
  const components = {
    ref: Reference,
    wrapper: (props: any) => <>{props.children}</> // https://github.com/ChristopherBiscardi/gatsby-mdx/issues/378
  }
  return <PassageContext.Provider value={{ store: store }}>
    <MDXProvider components={components}>
      <props.content />
    </MDXProvider>
  </PassageContext.Provider>
}