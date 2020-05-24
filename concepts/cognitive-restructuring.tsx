import { concept } from '../shared/concept'
import cognitiveTriangle from './img/cognitive-triangle.jpg'

export default concept({
    draft: true,
    id: 'cognitive-restructuring',
    title: 'Cognitive restructuring',
    tagLine: "Influence your emotions by challenging negative thoughts",
    keyFinding: "Influence your emotions by challenging negative thoughts",
    author: "Jake Leoht",
    introduction: `
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

`,
    furtherReading: `
- [CBT's Cognitive Restructuring (CR) For Tackling Cognitive Distortions](https://positivepsychology.com/cbt-cognitive-restructuring-cognitive-distortions/) by Courtney E. Ackerman
`,

    exercises: [
        {
            question: "What is cognitive restructuring?",
            answer: "The process of influencing your feelings by changing your thoughts."
        },
        {
            question: "In the cognitive triangle, what are the main influences on your feelings?",
            answer: "Your thoughts and behavior. Changing these is a way of indirectly changing the way you feel."
        },
        {
            question: "What are the steps to practice cognitive restructuring in writing?",
            answer: `
1. Write down a negative automatic thought
2. Identify the distortions
3. Rewrite the thought with a more reasonable, positive framing
            `
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
        url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3584580/?_escaped_fragment_=po}
      }
`
})