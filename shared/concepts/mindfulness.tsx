import { concept } from '../concept'

export default concept({
    id: 'mindfulness',
    title: "Mindfulness",
    introduction: `
Mindfulness is the process of bringing your attention to experiences occurring in the present moment, without judgment. It's a strategy of "slowing down" the mind when it's going too fast, the mental equivalent of taking a deep breath.

Though it originates in spiritual practice, mindfulness has since been adopted and expanded upon by psychological research. In a 2018 meta-analysis of randomized controlled trials, mindfulness-based interventions were found to be effective across a range of disorders[@goldberg2018mindfulness], especially depression, chronic pain, and addiction. It's about as effective as other evidence-based therapies, such as cognitive-behavioral therapy or antidepressant medication. <small>(TODO: explore the literature on individual differences in therapy responsiveness-- who is better suited for mindfulness vs. CBT?)</small>

Mindfulness is a skill you can use at any time to help cope with difficult thoughts or emotions. Intentional practice makes it easier: it's often trained using meditation exercises that involve focusing awareness on your breath and the physical sensations of different parts of your body.

<small>(TODO: SRS meditation exercises?)</small>
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