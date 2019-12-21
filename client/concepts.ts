export interface Exercise {

}

export interface Concept {
    id: string
    title: string
    introduction: string
    exercises: Exercise[]
}

export const concepts: Concept[] = [
    {
        id: "cognitive-restructuring",
        title: "Cognitive restructuring",
        introduction: `
Our emotions, thoughts, and behavior are linked. When one of these changes, the other two will often be affected. So one way to positively influence our emotions and behavior is to challenge our thoughts when they may be more negative than is truly justified. This is called *cognitive restructuring*.
`,
        exercises: []
    },
    {
        id: "behavioral-activation",
        title: "Behavioral Activation",
        introduction: "",
        exercises: []
    }
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