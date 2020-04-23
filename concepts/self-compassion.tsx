import { concept } from '../shared/concept'

export default concept({
    id: 'self-compassion',
    title: "Self-compassion",
    introduction: `
Self-compassion involves extending a sense of caring warmth to ourselves in times of suffering or perceived inadequacy. It is a strategy often defined by the question "How would we respond to a close friend in the same situation?"

[@allen2010self]



`,
    furtherReading: `
[What is self-compassion?](https://self-compassion.org/the-three-elements-of-self-compassion-2/) by Kristin Neff
`,
    exercises: [
        {
            question: "How does self-compassion differ from self-esteem?",
            answer: "Self-esteem is based on an evaluation of worth. Compassion on the basis of common humanity is independent of any evaluation, as we can think of it as something to be extended to all people."
        },
        {
            question: "How can I apply spaced learning without software?",
            answer: "After first learning something you want to remember, schedule some review sessions over the next days or weeks."
        },
        {
            question: "What spaced learning software can I use for topics Dawnguide doesn't cover?",
            answer: "A commonly used one is [Anki](https://apps.ankiweb.net/)"
        }
    ],
    bibliography: `
    @article{allen2010self,
        title={Self-Compassion, stress, and coping},
        author={Allen, Ashley Batts and Leary, Mark R},
        journal={Social and personality psychology compass},
        volume={4},
        number={2},
        pages={107--118},
        year={2010},
        publisher={Wiley Online Library}
        url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2914331/}
      }}
`
})