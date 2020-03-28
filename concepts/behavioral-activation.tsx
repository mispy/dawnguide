import { concept } from '../shared/concept'
// @ts-ignore
import baCycle from './img/behavioral-activation-cycle.jpg'

export default concept({
    id: 'behavioral-activation',
    title: "Behavioral activation",
    introduction: `
Behavioral activation is a strategy for combating depression. You might summarize it as "doing things that are enjoyable even if you really don't feel like it beforehand".

https://beckinstitute.org/behavioral-activation-tip/

![](${baCycle})

<small>(TODO: Make our own, better version of this image)</small>

`,
    furtherReading: `
- [22 Mindfulness Exercises, Techniques & Activities](https://positivepsychology.com/mindfulness-exercises-techniques-activities/) by Courtney Ackerman

- [Guided Meditations](https://www.tarabrach.com/guided-meditations/) by Tara Brach
`,
    exercises: [
        {
            question: "What is mindfulness?",
            answer: "The process of bringing your attention to the present moment, without judgment."
        },
        {
            question: "How effective are mindfulness-based therapies?",
            answer: "About as effective as cognitive-behavioral therapy or antidepressants on average, across a range of different psychiatric disorders."
        },
        {
            question: "How do I practice mindfulness?",
            answer: "[Meditation exercises](https://www.tarabrach.com/guided-meditations/) can help you train the skill so that it's easier to use in everyday life."
        }
    ],
    bibliography: `
@article{goldberg2018mindfulness,
    title={Mindfulness-based interventions for psychiatric disorders: A systematic review and meta-analysis},
    author={Goldberg, Simon B and Tucker, Raymond P and Greene, Preston A and Davidson, Richard J and Wampold, Bruce E and Kearney, David J and Simpson, Tracy L},
    journal={Clinical psychology review},
    volume={59},
    pages={52--60},
    year={2018},
    publisher={Elsevier},
    url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5741505/}
}
`
})