import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'
// import { Sunpedia, Concept } from "../shared/sunpedia"
// TODO get citation.js or alternative working server-side
// import { Passage } from '../shared/Passage'

export function conceptPage(req: any, conceptId: string) {
    // const sunpedia = new Sunpedia()

    // const concept = sunpedia.getConcept(conceptId)
    const concept = null

    if (!concept) {
        return new Response(`Unknown concept ${conceptId}`, { status: 404 })
    }

    // return pageResponse(<ConceptPage concept={concept} />)
}

// export function ConceptPage(props: { concept: Concept }) {
//     const { concept } = props

//     return <html lang="en">
//         <Head pageTitle="Login" canonicalUrl="/login" />

//         <body>
//             <main className="ConceptPage">
//                 <div className="container">
//                     {/* <Passage concept={concept} /> */}
//                 </div>
//             </main>
//         </body>
//     </html>
// }
