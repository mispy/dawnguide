import { defineLesson, md } from '../lesson'
// @ts-ignore
import baCycle from './img/behavioral-activation-cycle.jpg'

//  https://beckinstitute.org/behavioral-activation-tip/

export default defineLesson({
    type: 'reading',
    id: 'behavioral-activation',
    title: "Behavioral activation",
    summaryLine: "Begin a new positive cycle by scheduling meaningful activities",
    introduction: md`
Behavioral activation is a strategy for combating depression. It could be summarized as "consciously taking opportunities to do fun and meaningful things even if you don't feel like it". For example, you might schedule a game with your friends even though you feel like hiding, or decide to get out of bed when you've had enough sleep despite lack of emotional motivation to do so.

Behavioral activation is a key part of cognitive-behavioral therapy, and is also an effective treatment for depression in its own right.[@cuijpers2007behavioral] In the relationship between thoughts, feelings, and actions, it seeks to intercede at the level of actions.

<br/>
![The vicious cycle of depression vs. the positive cycle of activity](${baCycle})
<br/><small>(TODO: Make our own, better version of this image)</small>

Depression biases us to underestimate the joy in things, and avoiding engaging with the world tends to make depression worse. By making a conscious decision to account for this bias, and seek joyful activities anyway, we can start to circumvent the cycle of depression. Of course, this isn't something that's easy to do-- it often takes much effort! Hopefully, knowing that behavioral activation is a good strategy supported by research will help your willpower along.
`,
    furtherReading: md`
- [How To Use Behavioral Activation (BA) To Overcome Depression](https://www.psychologytools.com/self-help/behavioral-activation/) at psychologytools.com
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Behavioral ____ means scheduling fun things even when we're depressed",
            possibleAnswers: [
                'activation'
            ],
            successFeedback: "Yep! Staying in bed all week won't help you feel better, so might as well try some behavioral activation.",
            reviseFeedback: `Not quite! This strategy is called behavioral *activation*.`
        },
        {
            type: 'fillblank',
            question: "The vicious ____ of depression is when feeling bad stops us doing meaningful things, which then makes us feel worse",
            possibleAnswers: [
                'cycle',
                'loop'
            ],
            successFeedback: "A troublesome feedback loop...",
            reviseFeedback: `It's a vicious _cycle_. Once we know our enemy, we can counteract it..!`
        },
        {
            type: 'fillblank',
            question: "The positive cycle of ____ is when doing meaningful things makes us feel good, so we then do more meaningful things",
            possibleAnswers: [
                'activity'
            ],
            successFeedback: "A helpful feedback loop!",
            reviseFeedback: `The positive cycle of _activity_. Best kind of cycle.`
        }
    ],
    bibliography: `
    @article{cuijpers2007behavioral,
        title={Behavioral activation treatments of depression: A meta-analysis},
        author={Cuijpers, Pim and Van Straten, Annemieke and Warmerdam, Lisanne},
        journal={Clinical psychology review},
        volume={27},
        number={3},
        pages={318--326},
        year={2007},
        publisher={Elsevier},
        url={https://www.researchgate.net/profile/Pim_Cuijpers/publication/239845740_Behavioral_treatment_of_depression_A_meta-analysis_of_activity_scheduling/links/00b7d52f3e4a54261c000000.pdf}
      }
`
})