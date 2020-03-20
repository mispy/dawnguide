declare const require: any
const _ = require("lodash")

export type Exercise = {
    question: string
    answer: string
}

export interface Concept {
    id: string
    title: string
    introduction: string
    exercises: Exercise[]
    citation?: string
    references?: {[key: string]: string}
}

export const concepts: Concept[] = [
    {
        id: "spaced-practice",
        title: "Spaced practice",
        introduction: `Spaced practice is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect. The use of spaced repetition has been shown to increase rate of learning`,
        citation: `@article{cepeda2006distributed,
            title={Distributed practice in verbal recall tasks: A review and quantitative synthesis.},
            author={Cepeda, Nicholas J and Pashler, Harold and Vul, Edward and Wixted, John T and Rohrer, Doug},
            journal={Psychological bulletin},
            volume={132},
            number={3},
            pages={354},
            year={2006},
            publisher={American Psychological Association}
          }`,
        exercises: [{
            question: "What is the evidence-based learning method used by Sunpeep?",
            answer: "Spaced learning"
        }]
    },
    {
        id: "cognitive-restructuring",
        title: "Cognitive restructuring",
        introduction: `
Our emotions, thoughts, and behavior are linked. When one of these changes, the other two will often be affected. So one way to positively influence our emotions and behavior is to challenge our thoughts when they may be more negative than is truly justified. This is called *cognitive restructuring*.
`,
        exercises: [{
            question: "What is the strategy called where we challenge inaccurate negative thoughts?",
            answer: "Cognitive restructuring"
        }]
    },
    {
        id: "behavioral-activation",
        title: "Behavioral activation",
        introduction: `Behavioral activation is a strategy for dealing with low moods based on the idea that *action can precede emotion*.
        
Depression can often lead us to "wait to feel better" before doing something. However, avoidance of activity often generates less motivation rather than more. We can counter this by using behavioral activation-- making the conscious decision to do something like going for a walk or talking to a friend, in defiance of depression.`,
        exercises: [{
            question: "What is it called when we decide to do something enjoyable even if we don't feel like it?",
            answer: "Behavioral activation"
        }]
    },
    // https://www.researchgate.net/profile/Lilian_Jans-Beken_Phd/publication/335018983_Gratitude_and_health_An_updated_review/links/5d8e45c9299bf10cff15180e/Gratitude-and-health-An-updated-review.pdf
    // {
    //     id: "gratitude-journaling",
    //     introduction: ``,
    //     references: {
    //         jansBekenReview: ``
    //     }
    // }
]

// {
//     id: "test1",
//     question: "What is a great thing?",
//     answer: "waffles"
// },
// {
//     id: "test2",
//     question: "Who is a cool person?",
//     answer: "Spacie"
// }]

export const conceptById = _.keyBy(concepts, (c: Concept) => c.id)