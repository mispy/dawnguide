import { defineLesson, md } from '../lesson'

export default defineLesson({
    type: 'reading',
    id: 'trigger-action-plans',
    slug: 'implementation-intentions',
    title: 'Implementation intentions',
    summaryLine: "Associating specific cues with a behavioral response is an effective way to build good habits",
    author: "Jaiden Mispy",
    text: md`
Creating **implementation intentions** is a way of turning vague goals into concrete changes in your behavior. By associating a specific experiential cue with an action you will do in response, you can start a new routine or modify an existing one. Some examples:

- **Goal:** Exercise more
- **II:** When I see the stairs, I will take them instead of the elevator

- **Goal:** Do more nice things
- **II:** When I see an item that reminds me of a friend, I'll write it down as a birthday gift idea

- **Goal:** Improve mental health
- **II:** When I see a reminder email from Dawnguide, I'll complete my reviews

Implementation intentions are effective because they remove the uncertainity about when and how to act. The best ones are clear and precise in their wording: you don't want an ambiguous trigger, or an action you can't realistically do every time. For example "when there's a test coming up, I will study all day" is no good; the trigger isn't at any specific time, and it's pretty hard to study all day. "when I get home from school, I will open my textbook" is a better start.

The steps to creating an II:

- Choose a goal (a desired outcome or behavior)
- Identify a trigger (something that will happen naturally)
- Decide on an action you will take after the trigger
- Rehearse the causal link (e.g. with deliberate visualization)

Implementation intentions are also known as "trigger-action plans", and there's strong evidence for their efficacy. A meta-analysis of 94 studies found that interventions using implementation intentions had a medium-to-large effect towards successful goal achievement, across a variety of goals such as reducing snack consumption, avoiding stereotyping, or persisting with difficult puzzles.[@gollwitzer2006implementation]  
`,

    furtherReading: md`
- [Making intentions concrete - Trigger-Action Planning](https://www.lesswrong.com/posts/v4nNuJBZWPkMkgQRb/making-intentions-concrete-trigger-action-planning) by Kaj Sotala
`,
    notes: md`
The meta-analysis is striking in its confidence about implementation intentions and the number of different tests where they come out well (possible ego depletion or rigidity tradeoffs etc). The [CFAR handbook](https://rationality.org/files/cfar-handbook.pdf) section on trigger-action plans lists their epistemic status as "established and confirmed"!
`,
    exercises: [
        {
            type: 'fillblank',
            question: `Creating implementation ____ is a way of turning vague goals into concrete changes in behavior`,
            possibleAnswers: [
                "intentions"
            ],
            successFeedback: "Supported by lots of evidence!",
            reviseFeedback: "They're called _implementation_ intentions, also if-then plans or trigger-action plans."
        },
        {
            type: 'fillblank',
            question: "An example implementation intention: ____ I see a reminder email from Dawnguide, I'll complete my reviews",
            possibleAnswers: [
                'when',
                'if',
                'once'
            ],
            successFeedback: "Please do!",
            reviseFeedback: "_When_ you see the email. That's the trigger part of the TAP."
        },
        {
            type: 'fillblank',
            question: `After creating an implementation intention it's important to ____ the causal link`,
            possibleAnswers: [
                "rehearse",
                "practice",
                "visualize"
            ],
            successFeedback: "Either by actually practicing the process or visualizing it.",
            reviseFeedback: "It's important to _rehearse_. That way, you're primed to act when the trigger comes around."
        }
    ],
    bibliography: `
    @article{gollwitzer2006implementation,
        title={Implementation intentions and goal achievement: A meta-analysis of effects and processes},
        author={Gollwitzer, Peter M and Sheeran, Paschal},
        journal={Advances in experimental social psychology},
        volume={38},
        pages={69--119},
        year={2006},
        publisher={Elsevier},
        url={https://duwtje.com/wp-content/uploads/2015/06/implementation-intention.pdf}
      }
`
})