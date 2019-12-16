export interface Lesson {
    id: string
    question: string
    answer: string
}

export const lessons: Lesson[] = [{
    id: "test1",
    question: "What is a great thing?",
    answer: "waffles"
},
{
    id: "test2",
    question: "Who is a cool person?",
    answer: "Spacie"
}]