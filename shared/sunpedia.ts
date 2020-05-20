
// @ts-ignore
// import Cite from 'citation-js'
import * as bibTexParse from 'bibtex-parser-js'

import { computed, observable } from 'mobx'

import conceptDefs from '../concepts'
import { ConceptDef, Reference, MarkdownString, UserProgressItem } from './types'
import * as _ from 'lodash'
import { isReadyForReview } from './logic'

function parseBibliography(bibliography: string): Reference[] {
    // citationKey: "CEPEDA2006DISTRIBUTED"
    // entryType: "ARTICLE"
    // entryTags:
    //     TITLE: "Distributed practice in verbal recall tasks: A review and quantitative synthesis."
    //     AUTHOR: "Cepeda, Nicholas J and Pashler, Harold and Vul, Edward and Wixted, John T and Rohrer, Doug"
    //     JOURNAL: "Psychological bulletin"
    //     VOLUME: "132"
    //     NUMBER: "3"
    //     PAGES: "354"
    //     YEAR: "2006"
    //     PUBLISHER: "American Psychological Association"
    //     URL: "https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf"

    const json = bibTexParse.toJSON(bibliography)

    return json.map((entry: any) => ({
        id: entry.citationKey.toLowerCase(),
        title: entry.entryTags.TITLE,
        author: entry.entryTags.AUTHOR.split(" and ").map((s: string) => {
            const a = s.split(", ")
            return {
                family: a[0],
                given: a[1]
            }
        }),
        journal: entry.entryTags.JOURNAL,
        volume: entry.entryTags.VOLUME,
        issue: entry.entryTags.NUMBER,
        page: entry.entryTags.PAGES,
        year: entry.entryTags.YEAR,
        publisher: entry.entryTags.PUBLISHER,
        url: entry.entryTags.URL
    }))
}

export type Exercise = {
    id: string
    conceptId: string
    question: string
    answer: string
}

export class Concept {
    @observable def: ConceptDef
    constructor(def: ConceptDef) {
        this.def = def
    }

    @computed get id(): string {
        return this.def.id
    }

    @computed get title(): string {
        return this.def.title
    }

    @computed get subtitle(): string | undefined {
        return this.def.subtitle
    }

    @computed get keyFinding(): string | undefined {
        return this.def.keyFinding
    }

    @computed get author(): string {
        return this.def.author || "Jake Leoht"
    }

    @computed get draft(): boolean {
        return !!this.def.draft
    }

    @computed get introduction(): MarkdownString {
        return this.def.introduction.trim()
    }

    @computed get furtherReading(): MarkdownString | undefined {
        return this.def.furtherReading
    }

    @computed get exercises(): Exercise[] {
        return this.def.exercises.map((e, i) => {
            return {
                id: `${this.id}:${i}`,
                conceptId: this.id,
                question: e.question,
                answer: e.answer
            }
        })
    }

    @computed get references(): Reference[] {
        return parseBibliography(this.def.bibliography)
    }
}

export class Sunpedia {
    @observable.ref conceptsWithDrafts: Concept[] = []

    @computed get concepts() {
        return this.conceptsWithDrafts.filter(c => !c.draft)
    }

    @computed get conceptById() {
        return _.keyBy(this.concepts, c => c.id)
    }

    @computed get exercises() {
        return _.flatten(this.concepts.map(c => c.exercises))
    }

    @computed get exerciseById() {
        return _.keyBy(this.exercises, e => e.id)
    }

    getConcept(conceptId: string): Concept | undefined {
        return this.conceptById[conceptId]
    }

    expectConcept(conceptId: string): Concept {
        const concept = this.getConcept(conceptId)
        if (!concept) {
            throw new Error(`No known concept with id '${conceptId}'`)
        }
        return concept
    }

    getExercise(exerciseId: string): Exercise | undefined {
        return this.exerciseById[exerciseId]
    }

    getLessonsAndReviews(progressItems: UserProgressItem[]) {
        const progressByExerciseId = _.keyBy(progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>

        const lessons = this.concepts.filter(c => {
            return c.exercises.every(e => !progressByExerciseId[e.id])
        })

        const reviewConcepts = this.concepts.filter(c => {
            return c.exercises.some(e => progressByExerciseId[e.id])
        })

        const reviews: { concept: Concept, exercise: Exercise }[] = []
        for (const concept of reviewConcepts) {
            for (const exercise of concept.exercises) {
                const item = progressByExerciseId[exercise.id]
                if (!item || isReadyForReview(item)) {
                    reviews.push({
                        concept: concept,
                        exercise: exercise
                    })
                }
            }
        }

        return { lessons, reviews }
    }

    constructor() {
        for (const def of conceptDefs) {
            this.conceptsWithDrafts.push(new Concept(def))

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

        }
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
// Spaced learning is a way of committing ideas to memory by reviewing them in short intervals over a longer time period. Understanding spaced learning will help you understand how Dawnguide works, and it's also a general technique that you can use yourself to learn any kind of material.

// Spaced learning leads to better recall than massed learning strategies, such as cramming for an exam. In psychology this is called the "spacing effect" and it's supported by a lot of research![@cepeda2006distributed]

// Dawnguide's form of spaced learning starts with reading a short passage about the key ideas of a concept (such as this one). Afterwards, you'll be shown some question-answer review cards. Each time you remember the answer to a question, we'll wait longer before showing it to you again. This way you can memorize ideas for the long term.

// You don't need any software to take advantage of the spacing effect, but there are a number of apps (like Dawnguide) that aim to make it easier. A common free one for making your own flashcards is [Anki](https://apps.ankiweb.net/).

// Further Reading

// References



// [Augmenting Cognition](http://augmentingcognition.com/ltm.html) by Michael Nielsen

// Notes

// Dawnguide includes a notes section about each concept, which includes information we thought was interesting but not so fundamental that we'd want to memorize it. Feel free to read or skip these as you go.




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
//         question: "What is the evidence-based learning method used by Dawnguide?",
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