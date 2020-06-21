import { concept } from '../shared/concept'

export default concept({
    draft: true,
    id: 'mental-contrasting',
    title: 'Mental contrasting',
    tagLine: "Find energy to act by contrasting the future you want with obstacles in the present",
    keyFinding: "Find energy to act by contrasting the future you want with obstacles in the present",
    author: "Jake Leoht",
    introduction: `
> Mentally contrasting a desired future with present reality is a self-regulation strategy that leads to goal commitment in line with a person’s expectations of success.[@oettingen2009mental]
`,

    furtherReading: `
- [What Is Mental Contrasting and How to Benefit From It?](https://positivepsychology.com/mental-contrasting/) by Madhuleena Roy Chowdhury
`,
    exercises: [
        // {
        //     type: 'fillblank',
        //     question: "Because of their consistency across cultures, humans may be considered to have ____ needs",
        //     possibleAnswers: [
        //         'universal',
        //         'fundamental'
        //     ],
        //     successFeedback: "Yep. Each need has many different ways of fulfilling it.",
        //     reviseFeedback: `_Universal_ needs. They're open-ended, but every culture seems to have them.`
        // },
        // {
        //     type: 'fillblank',
        //     question: "There is no strict hierarchy of needs and each makes an ____ contribution to the whole",
        //     possibleAnswers: [
        //         'independent',
        //     ],
        //     successFeedback: "Like vitamins!",
        //     reviseFeedback: `Each makes an _independent_ contribution. One universal need can't be substituted for another.`
        // },
        // {
        //     type: 'fillblank',
        //     question: `We can all ____ each other towards self-actualization`,
        //     possibleAnswers: [
        //         'help'
        //     ],
        //     successFeedback: "Yep, friends and family are an important part of the journey!",
        //     reviseFeedback: `We can _help_ each other. It need not be a lonesome quest.`
        // },
    ],
    bibliography: `
    @article{oettingen2009mental,
        title={Mental contrasting and goal commitment: The mediating role of energization},
        author={Oettingen, Gabriele and Mayer, Doris and Timur Sevincer, A and Stephens, Elizabeth J and Pak, Hyeon-ju and Hagenah, Meike},
        journal={Personality and Social Psychology Bulletin},
        volume={35},
        number={5},
        pages={608--622},
        year={2009},
        publisher={Sage Publications Sage CA: Los Angeles, CA},
        url={http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.380.1911&rep=rep1&type=pdf}       
      }
`
})