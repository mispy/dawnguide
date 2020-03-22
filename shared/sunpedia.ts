// @ts-ignore
import Cite from 'citation-js'

import conceptFiles from './concepts/*.mdx'
import { computed } from 'mobx'

type ConceptFile = {
  metadata: {
    title: string
    exercises: Exercise[]
    bibliography: string
  }
  default: MDXElement
}

export type Exercise = {
  question: string
  answer: string
}

type MDXElement = (props: any) => JSX.Element

export type Concept = {
  id: string
  title: string
  exercises: Exercise[]
  references: Reference[]
  content: MDXElement
}

export type Reference = {
  id: string
  title: string
  author: { given: string, family: string }[]
  "container-title": string
  volume: number
  issue: number
  page: string
  publisher: string
  URL: string
  issued: { "date-parts": number[] }
}

export class Sunpedia {
  concepts: Concept[]

  constructor() {
    const concepts: Concept[] = []

    for (const id in (conceptFiles as Record<string, ConceptFile>)) {
      const file = conceptFiles[id]
      const { metadata } = file

      // {
      //   "title": "Distributed practice in verbal recall tasks: A review and quantitative synthesis.",
      //   "author": [
      //     {
      //       "given": "Nicholas J",
      //       "family": "Cepeda"
      //     },
      //     {
      //       "given": "Harold",
      //       "family": "Pashler"
      //     },
      //     {
      //       "given": "Edward",
      //       "family": "Vul"
      //     },
      //     {
      //       "given": "John T",
      //       "family": "Wixted"
      //     },
      //     {
      //       "given": "Doug",
      //       "family": "Rohrer"
      //     }
      //   ],
      //   "container-title": "Psychological bulletin",
      //   "volume": 132,
      //   "issue": 3,
      //   "page": "354",
      //   "publisher": "American Psychological Association",
      //   "URL": "https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf",
      //   "type": "article-journal",
      //   "citation-label": "cepeda2006distributed",
      //   "id": "cepeda2006distributed",
      //   "year-suffix": "distributed",
      //   "issued": {
      //     "date-parts": [
      //       [
      //         2006
      //       ]
      //     ]
      //   },
      // }

      // Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354.

      // console.log(cite.get())
      // console.log(cite.format('bibliography', { format: 'html', template: 'apa' }))

      concepts.push({
        id: id,
        title: metadata.title,
        exercises: metadata.exercises,
        references: new Cite(metadata.bibliography).get(),
        content: file.default
      })
    }

    this.concepts = concepts
  }
}

// declare const require: any
// const _ = require("lodash")

// export type Exercise = {
//   question: string
//   answer: string
// }

// export interface Concept {
//   id: string
//   title: string
//   introduction: string
//   exercises: Exercise[]
//   citation?: string
//   references?: { [key: string]: string }
// }

// export const concepts: Concept[] = [
//   {
//     id: "spaced-learning",
//     title: "Spaced learning",
//     introduction: `
// Spaced learning is a way of committing ideas to memory by reviewing them in short intervals over a longer time period. Understanding spaced learning will help you understand how Sunpeep works, and it's also a general technique that you can use yourself to learn any kind of material.

// Spaced learning leads to better recall than massed learning strategies, such as cramming for an exam. In psychology this is called the "spacing effect" and it's supported by a lot of research![@cepeda2006distributed]

// Sunpeep's form of spaced learning starts with reading a short passage about the key ideas of a concept (such as this one). Afterwards, you'll be shown some question-answer review cards. Each time you remember the answer to a question, we'll wait longer before showing it to you again. This way you can memorize ideas for the long term.

// You don't need any software to take advantage of the spacing effect, but there are a number of apps (like Sunpeep) that aim to make it easier. A common free one for making your own flashcards is [Anki](https://apps.ankiweb.net/).

// Further Reading

// References



// [Augmenting Cognition](http://augmentingcognition.com/ltm.html) by Michael Nielsen

// Notes

// Sunpeep includes a notes section about each concept, which includes information we thought was interesting but not so fundamental that we'd want to memorize it. Feel free to read or skip these as you go.




// `,
//     citation: `@article{cepeda2006distributed,
//       title={Distributed practice in verbal recall tasks: A review and quantitative synthesis.},
//       author={Cepeda, Nicholas J and Pashler, Harold and Vul, Edward and Wixted, John T and Rohrer, Doug},
//       journal={Psychological bulletin},
//       volume={132},
//       number={3},
//       pages={354},
//       year={2006},
//       publisher={American Psychological Association}
//     }`,
//     exercises: [
//       {
//         question: "What is the evidence-based learning method used by Sunpeep?",
//         answer: "Spaced practice"
//       },
//       // {
//       //   question: ""
//       // }
//     ]
//   },
//   {
//     id: "cognitive-restructuring",
//     title: "Cognitive restructuring",
//     introduction: `
// Our emotions, thoughts, and behavior are linked. When one of these changes, the other two will often be affected. So one way to positively influence our emotions and behavior is to challenge our thoughts when they may be more negative than is truly justified. This is called *cognitive restructuring*.
// `,
//     exercises: [
//       {
//         question: "What is the strategy called where we challenge inaccurate negative thoughts?",
//         answer: "Cognitive restructuring"
//       }
//     ]
//   },
//   {
//     id: "behavioral-activation",
//     title: "Behavioral activation",
//     introduction: `Behavioral activation is a strategy for dealing with low moods based on the idea that *action can precede emotion*.

// Depression can often lead us to "wait to feel better" before doing something. However, avoidance of activity often generates less motivation rather than more. We can counter this by using behavioral activation-- making the conscious decision to do something like going for a walk or talking to a friend, in defiance of depression.`,
//     exercises: [{
//       question: "What is it called when we decide to do something enjoyable even if we don't feel like it?",
//       answer: "Behavioral activation"
//     }]
//   },
//   // https://www.researchgate.net/profile/Lilian_Jans-Beken_Phd/publication/335018983_Gratitude_and_health_An_updated_review/links/5d8e45c9299bf10cff15180e/Gratitude-and-health-An-updated-review.pdf
//   // {
//   //     id: "gratitude-journaling",
//   //     introduction: ``,
//   //     references: {
//   //         jansBekenReview: ``
//   //     }
//   // }
// ]
// export const conceptById = _.keyBy(concepts, (c: Concept) => c.id)