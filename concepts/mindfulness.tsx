import { concept } from '../shared/concept'

export default concept({
    id: 'mindfulness',
    title: "Mindfulness",
    keyFinding: "Non-judgmental focus on immediate experiences helps us cope with negative emotions",
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
            type: 'fillblank',
            question: "Mindfulness is the process of bringing your attention to the present moment, without ____",
            possibleAnswers: [
                'judgment'
            ],
            successFeedback: "Try to perceive things just as they are right now.",
            reviseFeedback: "Without _judgment_. Try to perceive things just as they are right now."
        },
        {
            type: 'fillblank',
            question: "Mindfulness-based therapies are about as ____ as cognitive-behavioral therapy or antidepressants on average",
            possibleAnswers: [
                'effective',
                'useful',
                'good'
            ],
            successFeedback: "They seem useful across a range of different disorders.",
            reviseFeedback: "They're about as _effective_, across a range of different disorders. "
        },
        {
            type: 'fillblank',
            question: "Mindfulness is often practiced with regular ____",
            possibleAnswers: [
                'meditation'
            ],
            successFeedback: "It gets easier to use in everyday life the more you practice.",
            reviseFeedback: "With regular _meditation_. It gets easier to use in everyday life the more you practice."
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