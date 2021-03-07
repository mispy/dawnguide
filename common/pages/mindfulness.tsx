import { defineLesson, md } from '../lesson'
// @ts-ignore
import mindfulnessImg from './img/mindfulness.png'

export default defineLesson({
    type: 'reading',
    id: 'mindfulness',
    slug: 'mindfulness',
    title: "Mindfulness",
    publishedDate: "2020-04-12",
    featuredImg: mindfulnessImg,
    subtitle: "Practicing a perceptual focus on immediate experience can help us cope with difficult thoughts and situations",
    summaryLine: "Practicing a perceptual focus on immediate experience can help us cope with difficult thoughts and situations",
    text: md`
Humans spend a great deal of their time thinking about things that are not currently a part of their immediate experience. We contemplate the past, possibilities for the future, and all sorts of hypotheticals. This is a powerful human behavior that enables us to learn and plan. However, it can also make us unhappy, particularly when it takes the form of excessive rumination or worry. In an experience sampling study, reports of mind-wandering were predictive of unhappiness at a later sample point, but not vice-versa.[@killingsworth2010wandering]

Mindfulness is a strategy for counteracting mind-wandering by consciously bringing our attention to the present. In a 2018 meta-analysis of randomized controlled trials, mindfulness-based interventions were found to be effective at reducing symptoms across a range of mental health problems, especially depression, chronic pain, and addiction. It's about as effective as other evidence-based therapies, like cognitive-behavioral therapy or antidepressant medication.[@goldberg2018mindfulness]

Mindfulness is often practiced with [meditation exercises](/affectionate-breathing) that involve focusing your awareness on physical sensations. It can be tricky to understand what a mindful state is like just from reading about it, so giving one of these meditations a try is recommended. You can think of meditation as a way of honing your ability to be mindful, like how intentional writing practice improves your ability with language. Experienced meditators show an altered brain state at rest that is more akin to the acute state of meditation, and report a decreased need for conscious effort to sustain concentration.[@lutz2008attention]

Mindfulness can also be practiced _informally_ by looking for opportunities to use it in everyday life. For example, eating, showering or walking are common daily activities with interesting physical sensations. Since these activities are routine, the mind tends to tune out the experience of them by default, and wander to other matters-- "shower thoughts" are rarely about showering! We can practice mindfulness by intentionally focusing on the texture of toast, the flow of water, or the light breeze around us on a walk.

If we think of mindful experience as analogous to physical activity, the difference between formal meditation and informal practice is like going to the gym vs. jogging to work. The mindfulness intervention programs that have been studied generally involve a combination of formal and informal approaches. There's some evidence that informal practice alone can have beneficial effects, so if you struggle with sitting down to meditate, you may want to emphasize the everyday-life aspect.[@birtwell2019exploration][@shankland2020improving]

<SectionReview/>
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
            reviseFeedback: "They're about as _effective_, across a range of different disorders. "
        },
        {
            type: 'fillblank',
            question: "Mindfulness can be practiced with ____ exercises or informally in everyday life",
            possibleAnswers: [
                'meditation'
            ],
            reviseFeedback: "With _meditation_. A mindful state becomes easier the more you practice."
        }
    ],
    bibliography: `

@article{killingsworth2010wandering,
    title={A wandering mind is an unhappy mind},
    author={Killingsworth, Matthew A and Gilbert, Daniel T},
    journal={Science},
    volume={330},
    number={6006},
    pages={932--932},
    year={2010},
    publisher={American Association for the Advancement of Science},
    pdf={https://wjh-www.harvard.edu/~dtg/KILLINGSWORTH%20&%20GILBERT%20(2010).pdf}
}

@article{goldberg2018mindfulness,
    title={Mindfulness-based interventions for psychiatric disorders: A systematic review and meta-analysis},
    author={Goldberg, Simon B and Tucker, Raymond P and Greene, Preston A and Davidson, Richard J and Wampold, Bruce E and Kearney, David J and Simpson, Tracy L},
    journal={Clinical psychology review},
    volume={59},
    pages={52--60},
    year={2018},
    publisher={Elsevier},
    open={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5741505/}
}

@article{lutz2008attention,
    title={Attention regulation and monitoring in meditation},
    author={Lutz, Antoine and Slagter, Heleen A and Dunne, John D and Davidson, Richard J},
    journal={Trends in cognitive sciences},
    volume={12},
    number={4},
    pages={163--169},
    year={2008},
    publisher={Elsevier},
    open={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2693206/}
  }

@article{brewer2011meditation,
    title={Meditation experience is associated with differences in default mode network activity and connectivity},
    author={Brewer, Judson A and Worhunsky, Patrick D and Gray, Jeremy R and Tang, Yi-Yuan and Weber, Jochen and Kober, Hedy},
    journal={Proceedings of the National Academy of Sciences},
    volume={108},
    number={50},
    pages={20254--20259},
    year={2011},
    publisher={National Acad Sciences},
    pdf={https://www.pnas.org/content/pnas/108/50/20254.full.pdf}
  }

@article{birtwell2019exploration,
    title={An exploration of formal and informal mindfulness practice and associations with wellbeing},
    author={Birtwell, Kelly and Williams, Kate and van Marwijk, Harm and Armitage, Christopher J and Sheffield, David},
    journal={Mindfulness},
    volume={10},
    number={1},
    pages={89--99},
    year={2019},
    publisher={Springer},
    pdf={https://link.springer.com/content/pdf/10.1007/s12671-018-0951-y.pdf}
}

@article{shankland2020improving,
    title={Improving Mental Health and Well-Being through Informal Mindfulness Practices: An Intervention Study},
    author={Shankland, Rebecca and Tessier, Damien and Strub, Lionel and Gauchet, Aur{\'e}lie and Baeyens, C{\'e}line},
    journal={Applied Psychology: Health and Well-Being},
    year={2020},
    publisher={Wiley Online Library},
    pdf={https://www.vittoz-irdc.net/sites/vittoz-irdc.net/IMG/pdf/fovea1_shankland_2020_1_.pdf}
}
`
})