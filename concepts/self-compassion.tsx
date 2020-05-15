import { concept } from '../shared/concept'

export default concept({
    id: 'self-compassion',
    title: 'Self-compassion',
    subtitle: "Be kind to yourself",
    shortdef: "Caring for ourselves as we care for friends",
    author: "Jake Leoht",
    draft: true,
    introduction: `
What does it mean to be kind to ourselves? Many ideas in psychology help us answer this question, but there's one that aims for the heart of the matter: **self-compassion**.

Self-compassion involves using the same sense of caring warmth that we have for others. Think of someone important to you, a friend or loved one. Imagine they are suffering in some way. Do you find your heart moved by their plight, and wish for them to be safe and happy? Do you feel yourself wanting to act to protect them? That feeling of compassion is often considered one of the wonderful traits of humanity, and intentionally invoking it can help us to deal with negative emotions.






[@allen2010self]



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
        publisher={Wiley Online Library},
        url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2914331/}
      }
`
})