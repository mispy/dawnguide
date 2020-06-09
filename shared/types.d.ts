export type MarkdownString = string
export type BibtexString = string

export type User = {
    id: string
    email: string
    username: string
    createdAt: number
    updatedAt: number
    emailConfirmed?: true
    subscription?: {
        // Stripe details
        planId: string
        subscriptionId: string
        customerId: string
        subscribedAt: number
    }
}

export type BasicExerciseDef = {
    question: string
    answer: string
}

export type FillblankExerciseDef = {
    type: 'fillblank'
    question: string
    possibleAnswers: string[]
    successFeedback: string
    reviseFeedback: string
}

export type ExerciseDef = BasicExerciseDef | FillblankExerciseDef

export type ConceptDef = {
    id: string
    title: string
    tagLine?: string
    subtitle?: string
    author?: string
    keyFinding?: string
    draft?: true
    introduction: MarkdownString
    furtherReading?: MarkdownString
    exercises: ExerciseDef[]
    bibliography: BibtexString
}

export type ExerciseWithConcept = {
    concept: Concept
    exercise: Exercise
}

export type Exercise = ExerciseDef & {
    id: string
    conceptId: string
}

export type Reference = {
    id: string
    title: string
    author: { given: string, family: string }[]
    journal: string
    year: string
    volume: number
    issue: number
    page: string
    publisher: string
    url: string
}

export type UserProgressItem = {
    /** Database id of the user whose learning progress this is */
    userId: string
    /** Unique id of the exercise, which refers to a hardcoded string */
    exerciseId: string
    /** SRS stage from 1 to 10 */
    level: number

    /** When this exercise was initially learned */
    learnedAt: number
    /** When last reviewed or learned */
    reviewedAt: number
}

export type UserNotificationSettings = {
    /** 
     * If true, overrides all other notification settings to
     * indicate that we should never send notification emails
     * to this user (including new types in the future).
     * */
    disableNotificationEmails: boolean

    /** Whether to email user about new concepts */
    emailAboutNewConcepts: boolean

    /** Whether to send user a weekly email about reviews to complete */
    emailAboutWeeklyReviews: boolean

    /** When the last weekly review email was sent */
    lastWeeklyReviewEmail: number
}