import { concept } from '../shared/concept'
// @ts-ignore
import maslowsHierarchy from './img/maslows-hierarchy.jpg'

export default concept({
    draft: true,
    id: 'self-actualization',
    title: 'Self-actualization',
    tagLine: "",
    keyFinding: "",
    author: "Reece Matthews and Jake Leoht",
    introduction: `
Self-actualization is the process of becoming motivated to fulfill one’s own talents and potential, in order to bring out the best in oneself. At face value, this concept can seem unrealistic or vague, but once broken down and explored it becomes easier to identify what needs to be done in order to self-actualize.

 the evidence does not support the idea that they form a hierarchy. Rather, 

Though Maslow's general thinking continues to be influential in psychology, his theory is not considered to be literally true. 

A.H. Maslow believed that humans naturally, unconsciously, aim for self-actualization in everything they do. He also believed that it was the default for humans - humanity with “nothing taken away”. He developed the Hierarchy of Needs model in order to demonstrate what humans need in order to self-actualize.

![Maslow's hierarchy of needs](${maslowsHierarchy})

Despite the pyramidal appearance, the hierarchy does not necessarily start from the bottom deficit need and work upwards. Each individual progresses towards self-actualisation at different paces and in different ways[@ivtzan2013wellbeing]. Age and maturity can alter the order of priorities people have in order to reach their own state of self-actualisation. Young people in particular may prioritise physiological needs such as exercise and sleep over love/belonging, which may be prioritised higher by older people[@reiss2005motivation]. Both are still very important to both types of people, but the order of priority has shifted.

Self-actualisation is sort of in the eye of the beholder; an artist’s idea of self-actualisation may mean they have motivation to keep practicing their passion and producing what makes them happy. An office worker's version may be that they have found a work environment they are comfortable in and have attained a good work/life balance where stress is minimal. It is as unique as each human who experiences it. 

The key is to take a step back, analyse each of the deficit needs and try to figure out how satisfied you are with each one. If you notice there’s a particular area where you are struggling, the next step is to try and make changes, big or small, that may help you to be more satisfied in that particular need.

Self-actualisation is a long process, and is often not unidirectional, different life circumstances can cause changes in deficit needs that were previously satisfied. This is not an erasure of progress, but simply one more step in a long-term goal of achieving your potential. When each basic, deficit need is more-or-less satisfied, and you as an individual are satisfied with its level of fulfillment, motivation to hone their passions and talents will continue to increase.

It may be a struggle but it is worth noting that friends, family, professionals, and peers all come under the basic deficit need of ‘love and belonging, and self-actualisation is seldom achieved alone! Never be afraid to seek advice and comfort from those around you. Re-orienting your viewpoint, hearing the viewpoints of others, and critically analysing each basic need, may well reveal what you want to change or reshape to move on in your journey through life!
`,

    furtherReading: `
- [22 Self-Actualization Tests and Tools to Apply Maslow’s Theory](https://positivepsychology.com/self-actualization-tests-tools-maslow/) by Elaine Mead
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
            question: `
The steps to practice cognitive restructuring in writing are:

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

    @article{ivtzan2013wellbeing,
        title={Wellbeing through self-fulfilment: Examining developmental aspects of self-actualization},
        author={Ivtzan, Itai and Gardner, Hannah E and Bernard, Izra and Sekhon, Mandeep and Hart, Rona},
        journal={The Humanistic Psychologist},
        volume={41},
        number={2},
        pages={119--132},
        year={2013},
        publisher={Taylor & Francis},
        url={https://sci-hub.tw/https://doi.org/10.1080/08873267.2012.712076}
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