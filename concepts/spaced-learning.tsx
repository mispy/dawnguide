import { concept } from '../shared/concept'

export default concept({
    id: 'spaced-learning',
    title: "Spaced learning",
    introduction: `
Spaced learning is a way of committing ideas to memory by reviewing them in short intervals over a longer time period. Understanding spaced learning will help you understand how Sunpeep works, and it's also a general technique that you can use yourself to learn any kind of material.

Spaced learning leads to better recall than massed learning strategies, such as cramming for an exam. In psychology this is called the "spacing effect" and it's supported by a lot of research![@cepeda2006distributed]

Sunpeep's form of spaced learning starts with reading a short passage about the key ideas of a concept (such as this one). Afterwards, you'll be shown some question-answer review cards. Each time you remember the answer to a question, we'll wait longer before showing it to you again. This way you can memorize ideas for the long term.

You don't need any software to take advantage of the spacing effect, but there are a number of apps (like Sunpeep) that aim to make it easier. A common free one for making your own flashcards is [Anki](https://apps.ankiweb.net/).
`,
    furtherReading: `
- [Augmenting Long-term Memory](http://augmentingcognition.com/ltm.html) by Michael Nielsen
`,
    exercises: [
        {
            question: "What is the learning method used by Sunpeep?",
            answer: "Spaced learning, an evidence-based way of committing ideas to memory by reviewing them in short intervals over a longer time period."
        },
        {
            question: "How can I apply spaced learning without software?",
            answer: "After first learning something you want to remember, schedule some review sessions over the next days or weeks."
        },
        {
            question: "What spaced learning software can I use for topics Sunpeep doesn't cover?",
            answer: "A commonly used one is [Anki](https://apps.ankiweb.net/)"
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
      url={https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf}
}
`
})