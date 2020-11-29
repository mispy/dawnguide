export type MarkdownString = string
export type BibtexString = string

export type User = {
    id: string
    email: string
    username: string
    createdAt: number
    updatedAt: number
    lastSeenAt: number
    emailConfirmed?: true
    subscription?: {
        // Stripe details
        planId: string
        subscriptionId: string
        customerId: string
        subscribedAt: number
    }
}

export type UserLesson = {
    /** When the user first learned this lesson */
    learnedAt?: number
    /** If true, no future reviews will be given for this lesson */
    disabled?: boolean
}

export type UserAdminReport = User & {
    meanLevel: number
    lessonsStudied: number
    notificationSettings: UserNotificationSettings
}

export type BasicExerciseDef = {
    type?: undefined
    question: string
    answer: string
}

export type FillblankExerciseDef = {
    type: 'fillblank'
    question: string
    possibleAnswers: string[]
    successFeedback?: string
    reviseFeedback?: string
}

export type MeditationExerciseDef = {
    type: 'meditation'
}

export type ExerciseDef = BasicExerciseDef | FillblankExerciseDef | MeditationExerciseDef

export type Exercise = ExerciseDef & {
    id: string
    lessonId: string
}

export type LessonType = 'reading' | 'writing' | 'meditation'

type BaseLessonDef = {
    id: string
    slug: string
    title: string
    subtitle?: string
    author?: string
    summaryLine: string
    draft?: true
    furtherReading?: MarkdownString
    notes?: MarkdownString
    bibliography: BibtexString
}

export type ReadingLessonDef = LessonDef & {
    type: 'reading'
    exercises: ExerciseDef[]
    text: MarkdownString
}

export type MeditationLessonDef = LessonDef & {
    type: 'meditation'
    text: string
    duration: number
}

export type LessonDef = ReadingLessonDef | MeditationLessonDef

export type Review = {
    lesson: Lesson
    exercise: Exercise
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

    /** Whether to email user about new Lessons */
    emailAboutNewConcepts: boolean

    /** Whether to send user a weekly email about reviews to complete */
    emailAboutWeeklyReviews: boolean

    /** When the last weekly review email was sent */
    lastWeeklyReviewEmail: number
}