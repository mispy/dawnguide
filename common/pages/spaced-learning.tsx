import { defineLesson, md } from '../lesson'
// @ts-ignore
import featured from './img/spaced-learning-forgetting-curve.png'

export default defineLesson({
    type: 'reading',
    id: 'spaced-learning',
    slug: 'spaced-learning',
    title: "Spaced learning",
    publishedDate: "2020-03-24",
    featuredImg: featured,
    subtitle: "Spacing study sessions out over a longer time period leads to better long-term recall",
    summaryLine: "Spacing study sessions out over a longer time period leads to better long-term recall",
    text: md`
Spaced learning is a way of committing ideas to memory by reviewing them in short sessions over a longer time period. Understanding spaced learning will help you understand how Dawnguide works, and it's also a general technique that you can use yourself to learn any kind of material.

Spaced learning leads to better recall than massed learning strategies, such as cramming for an exam. In psychology this is called the "spacing effect" and it's supported by a lot of research![@cepeda2006distributed]

Dawnguide's form of spaced learning starts with reading a short passage about the key ideas of a lesson (such as this one). Afterwards, you'll be shown some question-answer review cards. Each time you remember the answer to a question, we'll wait longer before showing it to you again. This way you can memorize ideas for the long term.

You don't need any software to take advantage of the spacing effect, but there are a number of apps (like Dawnguide) that aim to make it easier. An app that uses spaced learning is often called a "spaced repetition system" (SRS). A common free one for making your own flashcards is [Anki](https://apps.ankiweb.net/).

<SectionReview/>
`,
    furtherReading: `
- [Augmenting Long-term Memory](http://augmentingcognition.com/ltm.html) by Michael Nielsen
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Dawnguide uses the ____ learning method",
            possibleAnswers: [
                'spaced'
            ],
            successFeedback: "Yep! Spaced learning is based on a lot of psych research about human memory.",
            reviseFeedback: "The method is known as _spaced_ learning. It's based on a lot of psych research about human memory."
        },
        {
            type: 'fillblank',
            question: "Spaced learning across multiple sessions is much ____ effective than doing it all at once",
            possibleAnswers: [
                'more'
            ],
            successFeedback: "That's right. The interval between the revisions is gradually increased as you go.",
            reviseFeedback: "We want to be _reviewing_ material. That's what we're doing right now!",
            source: md`
"More than 100 years of distributed practice research have demonstrated that learning is powerfully affected by the temporal distribution of study time. More specifically, spaced (vs. massed) learning of items consistently shows benefits, regardless of retention interval, and learning benefits increase with increased time lags between learning presentations."

[@cepeda2006distributed]
`
        },
        {
            type: 'fillblank',
            question: "For topics Dawnguide doesn't cover, you can use the general-purpose spaced learning app called ____",
            possibleAnswers: [
                'Anki'
            ],
            successFeedback: "Anki is a very useful tool for studying!",
            reviseFeedback: "It's called _Anki_. Check it out here: [apps.ankiweb.net](https://apps.ankiweb.net/)"
        }
    ],
    bibliography: `
@article{cepeda2006distributed,
      title={Distributed practice in verbal recall tasks: A review and quantitative synthesis.},
      author={Cepeda, Nicholas J and Pashler, Harold and Vul, Edward and Wixted, John T and Rohrer, Doug},
      journal={Psychological bulletin},
      volume={132},
      number={3},
      pages={354},
      year={2006},
      publisher={American Psychological Association},
      pdf={https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf}
}
`
})