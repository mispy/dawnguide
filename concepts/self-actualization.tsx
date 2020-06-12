import { concept } from '../shared/concept'
// @ts-ignore
import maslowsHierarchy from './img/maslows-hierarchy.jpg'

export default concept({
    id: 'self-actualization',
    title: 'Self-actualization',
    tagLine: "Fulfillment of universal needs contributes to subjective well-being",
    keyFinding: "Fulfillment of universal needs contributes to subjective well-being",
    author: "Reece Matthews and Jake Leoht",
    introduction: `
Humans, in general, want to become better humans. Few people believe they are already the best they could be. Rather, each of us has a sense of our greatest potential, an idea of what we can be when our highest needs are met and we are able to live each day with wonder, purpose, and authenticity. In humanistic psychology, the pursuit of this fulfillment is called **self-actualization**.

Research supports the idea that there are "universal" human needs that are predictive of subjective well-being across many different cultures. Theories differ slightly on the exact breakdown of needs. Here's one way of defining them, taken from a cross-country study[@tay2011needs] based on the Gallup World Poll:

- Basic needs for food and shelter
- Safety and security
- Social support and love
- Self-direction and autonomy
- Feeling respected and pride in activities
- Mastery

These needs tend to be achieved in a certain order, but there is no strict hierarchy and each has an independent contribution to the whole. It is possible, though rarer, to have psychosocial needs fulfilled even before basic and safety needs. In a global context, the difficulty of meeting your basic needs has a lot to do with the country in which you live, while psychosocial needs vary more with individual conditions.[@tay2011needs]

Which of the universal needs do you think is most important in your life right now? What are some ways it could be fulfilled? Focusing on the most pressing need is likely to be most rewarding. For example, if you have a successful career but often feel lonely, it may be worth shifting more of your focus to "social support and love" than "feeling respected" or "mastery".

> Like vitamins, each of the needs is individually required, just as having much of one vitamin does not negate the need for other vitamins.[@tay2011needs]

Each person progresses towards self-actualization at their own pace and in different ways. Older people tend to score higher on measures of self-actualization, and are more likely to be concerned with "higher motives" like honor and idealism.[@reiss2005motivation] However, there's lots of individual variation. Shifting priorities with age may be something fundamental, but it may also simply be explained by generational differences or increasing access to resources with which to meet needs.

The universal needs are open-ended in the way they are fulfilled. An artist’s idea of self-actualization may mean they have motivation to keep practicing their passion and producing what makes them happy, while an office worker's may be that they have found a work environment they are comfortable in and a good work/life balance where stress is minimal. Self-actualization is as unique as each human who experiences it. 

The struggle towards self-actualization need not be done in isolation. With friends, family and peers we can help each other fulfill our universal needs, starting with social support and love. Never be afraid to seek advice and comfort from those around you. Reorienting your viewpoint, hearing the viewpoints of others, and critically analysing each need, may reveal what you want to change to move on in your journey through life!
`,

    furtherReading: `
- [22 Self-Actualization Tests and Tools to Apply Maslow’s Theory](https://positivepsychology.com/self-actualization-tests-tools-maslow/) by Elaine Mead
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Self-actualization is the process of fulfilling our needs and achieving our true ____",
            possibleAnswers: [
                'potential'
            ],
            successFeedback: "It's more about the journey than the destination.",
            reviseFeedback: `Our true _potential_. How you define that is up to you.`
        },
        {
            type: 'fillblank',
            question: "Because of their consistency across cultures, humans may be considered to have ____ needs",
            possibleAnswers: [
                'universal',
                'fundamental'
            ],
            successFeedback: "Yep. Each need has many different ways of fulfilling it.",
            reviseFeedback: `_Universal_ needs. They're open-ended, but every culture seems to have them.`
        },
        {
            type: 'fillblank',
            question: "There is no strict hierarchy of needs and each makes an ____ contribution to the whole",
            possibleAnswers: [
                'independent',
            ],
            successFeedback: "Like vitamins!",
            reviseFeedback: `Each makes an _independent_ contribution. One universal need can't be substituted for another.`
        },
        {
            type: 'fillblank',
            question: `We can all ____ each other towards self-actualization`,
            possibleAnswers: [
                'help'
            ],
            successFeedback: "Yep, friends and family are an important part of the journey!",
            reviseFeedback: `We can _help_ each other. It need not be a lonesome quest.`
        },
    ],
    bibliography: `

    @article{tay2011needs,
        title={Needs and subjective well-being around the world.},
        author={Tay, Louis and Diener, Ed},
        journal={Journal of personality and social psychology},
        volume={101},
        number={2},
        pages={354},
        year={2011},
        publisher={American Psychological Association},
        url={http://academic.udayton.edu/jackbauer/Readings%20595/Tay%20Diener%2011%20needs%20WB%20world%20copy.pdf}
    }

      @article{reiss2005motivation,
        title={Motivation in developmental context: A new method for studying self-actualization},
        author={Reiss, Steven and Havercamp, Susan M},
        journal={Journal of Humanistic Psychology},
        volume={45},
        number={1},
        pages={41--53},
        year={2005},
        publisher={Sage Publications Sage CA: Thousand Oaks, CA},
        url={https://sci-hub.tw/https://doi.org/10.1177/0022167804269133}
      }
`
})