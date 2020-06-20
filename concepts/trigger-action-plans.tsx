import { concept } from '../shared/concept'

export default concept({
    draft: true,
    id: 'trigger-action-plans',
    title: 'Trigger-action plans',
    tagLine: "",
    keyFinding: "",
    author: "Jake Leoht",
    introduction: `
Creating **trigger-action plans** (TAPs) is a way of turning vague goals into concrete changes in your behavior. By associating a specific _trigger_ situation with an _action_ you you will do in response, you can start a new routine or modify an existing one. Some examples:

- **Goal:** Exercise more
- **TAP:** When I see the stairs, I will take them instead of the elevator

- **Goal:** Do more nice things 
- **TAP:** When I see an item that reminds me of a friend, I'll write it down as a birthday gift idea

- **Goal:** Improve mental health
- **TAP:** When I see a reminder email from Dawnguide, I'll complete my reviews

TAPs are effective because they remove the uncertainity about when and how to act. The best ones are clear and precise in their wording: you don't want an ambiguous trigger, or an action you can't realistically do every time. For example "when there's a test coming up, I will study all day" is no good; the trigger isn't at any specific time, and it's pretty hard to study all day. "when I get home from school, I will open my textbook" is a better start.

The steps to creating a TAP:

- Choose a goal (a desired outcome or behavior)
- Identify a trigger (something that will happen naturally)
- Decide on an action you will take after the trigger
- Rehearse the causal link (e.g. with deliberate visualization)

In the academic literature, this strategy is known as "implementation intentions", and there's strong evidence for it being effective. A meta-analysis of 94 studies found that implementation intentions had a medium-to-large effect of .65 standard deviations towards successfully achieving a broad goal.[@gollwitzer2006implementation]  
`,

    furtherReading: `
- [Making intentions concrete - Trigger-Action Planning](https://www.lesswrong.com/posts/v4nNuJBZWPkMkgQRb/making-intentions-concrete-trigger-action-planning) by Kaj Sotala
`,
    notes: `
The name "trigger-action plans" comes from the [CFAR handbook](https://rationality.org/files/cfar-handbook.pdf) section on the topic. I decided to go with their term over "implementation intentions" because it seems more descriptive to me, and has a catchy acronym (TAPs).

The meta-analysis is striking in its confidence about implementation intentions and the number of different tests where they come out well (possible ego depletion or rigidity tradeoffs etc). I can see why CFAR listed the epistemic status as "established and confirmed"!
`,
    exercises: [
        {
            type: 'fillblank',
            question: `Creating trigger-____ plans is a way of turning vague goals into concrete changes in behavior`,
            possibleAnswers: [
                "action"
            ]
        },
        {
            type: 'fillblank',
            question: `After creating a trigger-action plan, it's important to ____ the causal link`,
            possibleAnswers: [
                "rehearse"
            ]
        },
        {
            type: 'fillblank',
            question: "A trigger-action plan: ____ I see a reminder email from Dawnguide, I'll complete my reviews",
            possibleAnswers: [
                'when',
                'if',
                'once'
            ],
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
        url={https://kops.uni-konstanz.de/bitstream/handle/123456789/10973/06GollwitzerSheeran_ImplementationIntentionsAndGoalAchievement.pdf?sequence=}
      }
`
})