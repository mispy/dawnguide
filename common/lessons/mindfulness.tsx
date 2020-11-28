import { defineLesson, md } from '../lesson'
// @ts-ignore
import mindfulnessImg from './img/mindfulness.png'

export default defineLesson({
    type: 'reading',
    id: 'mindfulness',
    slug: 'mindfulness',
    title: "Mindfulness",
    summaryLine: "Practicing a perceptual focus on immediate experience can help us cope with difficult thoughts and situations",
    introduction: md`
Mindfulness is the process of bringing your attention to experiences occurring in the present moment, without judgment. It's a strategy of "slowing down" the mind when it's going too fast, the mental equivalent of taking a deep breath. Mindfulness is sort of the opposite of being lost in thought, which makes it a useful strategy for coping with intense thoughts and feelings.

<img src="${mindfulnessImg}" alt="Mindfulness is about focusing your awareness on the present" title="yay!"/>

Mindfulness is often practiced with [meditation exercises](https://positivepsychology.com/mindfulness-exercises-techniques-activities/) that involve focusing your awareness on physical sensations. It can be tricky to understand what a mindful state is like just from reading about it, so giving one of these meditations a try is recommended. You can think of meditation as a way of honing your ability to be mindful in everyday life, like how intentional writing practice improves your ability with language.

Though it originates in spiritual practice, there's strong evidence behind mindfulness as a psychological strategy. In a 2018 meta-analysis of randomized controlled trials, mindfulness-based interventions were found to be effective across a range of disorders[@goldberg2018mindfulness], especially depression, chronic pain, and addiction. It's about as effective as other evidence-based therapies, like cognitive-behavioral therapy or antidepressant medication.
`,
    furtherReading: md`
- [22 Mindfulness Exercises, Techniques & Activities](https://positivepsychology.com/mindfulness-exercises-techniques-activities/) by Courtney Ackerman

- [Guided Meditations](https://www.tarabrach.com/guided-meditations/) by Tara Brach
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Mindfulness is the process of bringing your attention to the ____ moment, without judgment",
            possibleAnswers: [
                'present',
                'current'
            ],
            successFeedback: "Try to perceive things just as they are right now.",
            reviseFeedback: "To the _present_ moment. Try to perceive things just as they are right now."
        },
        {
            type: 'fillblank',
            question: "Mindfulness-based therapies are about as ____ as cognitive-behavioral therapy or antidepressants on average",
            possibleAnswers: [
                'effective',
                'useful',
                'good',
                'helpful'
            ],
            successFeedback: "They seem useful across a range of different disorders.",
            reviseFeedback: "They're about as _effective_, across a range of different disorders. "
        },
        {
            type: 'fillblank',
            question: "Mindfulness is often practiced with ____ exercises",
            possibleAnswers: [
                'meditation'
            ],
            successFeedback: "It gets easier to use in everyday life the more you practice.",
            reviseFeedback: "With _meditation_. It gets easier to use in everyday life the more you practice."
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