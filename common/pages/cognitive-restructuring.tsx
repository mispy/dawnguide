import { defineLesson, md } from '../lesson'
// @ts-ignore
import cognitiveTriangle from './img/cognitive-triangle.jpg'

export default defineLesson({
    type: 'reading',
    id: 'cognitive-restructuring',
    slug: 'cognitive-restructuring',
    title: 'Cognitive restructuring',
    publishedDate: "2020-05-31",
    featuredImg: cognitiveTriangle,
    summaryLine: "Thoughts influence emotions, so you can change how you feel by changing how you think",
    text: md`
As a human, you've probably noticed that your ability to directly control your feelings is limited. When something happens, you can't just _decide_ to be happy, sad, calm, or angry about it: some part of your brain has already decided how it feels and tells your conscious mind about it after the fact. 

What you _do_ have control over, at least to a much greater extent than emotions, is the way you think about stuff.

![The cognitive triangle: thoughts <> feelings <> behavior](${cognitiveTriangle})

Since human minds are imperfect, many of us have automatic thoughts that are not accurate interpretations of the world around us: things like "I'm always terrible at this" or "everyone hates me". The differences between these thoughts and reality are called *cognitive distortions*. For example, the distortion of *overgeneralization* means thinking something is more common than it really is (it is quite impossible to be hated by *everyone*!).

**Cognitive restructuring** is the process of influencing your feelings by changing your thoughts. It can be done as a step-by-step process in writing:

1. Write down a negative automatic thought
2. Identify the distortions
3. Rewrite the thought with a more reasonable, positive framing

An example of this process:

- Situation: Struggling with an assignment at school.
- Thought: This is so much work! I'm always terrible at this, I'll never be able to do it.
- Distortions: An overgeneralization; in fact, I've had similar challenges in the past and ultimately overcome them.
- Reframed Thought: This is a difficult task, but I know I can do it if I take each small step.

It takes practice to do effective restructuring, and it can often help at the start to ask someone else to identify distortions you might have missed. If you are being [self-compassionate](/self-compassion), cognitive restructuring is a natural part of that: finding the silver lining and playing down overly negative thoughts is a great way of helping yourself cope with difficult situations.

Evidence-wise, cognitive restructuring is a component of cognitive-behavioral therapy, which is a strongly supported treatment for a variety of problems[@hofmann2012efficacy]. Since there seems to be less research on the technique as a standalone therapy, it's likely best used together with behavioral methods like <a href="/behavioral-activation">behavioral activation</a>.

<SectionReview/>
`,
    furtherReading: md`
- [CBT's Cognitive Restructuring (CR) For Tackling Cognitive Distortions](https://positivepsychology.com/cbt-cognitive-restructuring-cognitive-distortions/) by Courtney E. Ackerman
`,

    exercises: [
        {
            type: 'fillblank',
            question: "Cognitive restructuring is the process of influencing your feelings by changing your ___",
            possibleAnswers: [
                'thoughts',
                'thinking'
            ],
            successFeedback: "Yep, the way we think changes the way we feel!",
            reviseFeedback: `By changing your _thoughts_. Feelings are hard to alter directly, but we can change the way we think!`
        },
        {
            type: 'fillblank',
            question: "In the cognitive ___, there is a three-way relationship between feelings, thoughts, and behavior",
            possibleAnswers: [
                'triangle'
            ],
            successFeedback: "That's right. All three play an important role in our psychology!",
            reviseFeedback: `This relationship is called the cognitive _triangle_.`
        },
        {
            type: 'fillblank',
            question: `The steps to practice cognitive restructuring in writing are:

1. Write down a negative automatic thought
2. Identify possible ____
3. Rewrite the thought with a more reasonable, positive framing
            `,
            possibleAnswers: [
                'distortions'
            ],
            successFeedback: "Distortions can sneak into our thoughts when we least expect it!",
            reviseFeedback: `Identify possible _distortions_. Distortions are ways of thinking that don't quite reflect reality.`
        },
    ],
    bibliography: `
    @article{hofmann2012efficacy,
        title={The efficacy of cognitive behavioral therapy: A review of meta-analyses},
        author={Hofmann, Stefan G and Asnaani, Anu and Vonk, Imke JJ and Sawyer, Alice T and Fang, Angela},
        journal={Cognitive therapy and research},
        volume={36},
        number={5},
        pages={427--440},
        year={2012},
        publisher={Springer},
        open={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3584580/?_escaped_fragment_=po}
      }
`
})