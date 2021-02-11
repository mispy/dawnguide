import Markdown from "markdown-to-jsx"
import type { Lesson } from "./content"
import type { SRSProgressStore } from "./SRSProgress"

export type MarkdownString = string
export type BibtexString = string
export type Timestamp = number

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

export type FillblankExerciseDef = {
    type: 'fillblank'
    id?: string
    question: string
    possibleAnswers: string[]
    successFeedback?: string
    reviseFeedback?: string
}

export type ExerciseDef = FillblankExerciseDef

export type Card = ExerciseDef & {
    id: string
    lessonId: string
    lesson: Lesson
}

export type CardToReview = Card & {
    nextReviewAt: Timestamp
}

export type LessonType = 'reading' | 'writing' | 'meditation'

type BaseLessonDef = {
    id: string
    slug: string
    title: string
    name?: string
    subtitle?: string
    author?: string
    summaryLine: string
    draft?: true
    furtherReading?: MarkdownString
    notes?: MarkdownString
    bibliography: BibtexString
}

export type ReadingLessonDef = BaseLessonDef & {
    type: 'reading'
    exercises: ExerciseDef[]
    text: MarkdownString
}

export type MeditationLessonDef = BaseLessonDef & {
    type: 'meditation'
    text: MarkdownString
    seconds: number
    steps: MarkdownString
}

export type LessonDef = ReadingLessonDef | MeditationLessonDef

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
    /** Open-access url where this reference can be found in full */
    open?: string
    /** Full-text PDF link for a closed-access reference */
    pdf?: string
    /** Scihub link where closed-access reference can be found */
    scihub?: string
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

export type UserProgress = {
    disabledLessons: Record<string, boolean>
    progressStore: SRSProgressStore
}