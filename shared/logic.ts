import { Concept } from "./concepts"

export interface User {
    id: string
    username: string
    email: string
    createdAt: number
    updatedAt: number
}

export interface ConceptProgressItem {
    /** Unique id of the concept, which refers to a hardcoded string */
    conceptId: string
    /** SRS stage from 1 to 10 */
    level: number

    /** When this lesson was initially learned */
    learnedAt: number
    /** When last reviewed or learned */
    reviewedAt: number
}

export interface UserConceptProgress {
    concepts: { [conceptId: string]: ConceptProgressItem | undefined }
}

export interface ConceptWithProgress {
    concept: Concept,
    progress?: ConceptProgressItem
}

const seconds = (s: number) => s * 1000
const minutes = (m: number) => seconds(m * 60)
const hours = (h: number) => minutes(h * 60)
const days = (d: number) => hours(d * 24)
const weeks = (w: number) => days(w * 7)
const months = (mo: number) => days(mo * 30)

const timingLookup = [
    0,          // 0, not used
    hours(4),   // 1
    hours(8),   // 2
    days(1),    // 3
    days(2),    // 4
    days(4),    // 5
    weeks(2),   // 6
    months(1),  // 7
    months(4),  // 8
    Infinity    // 9 / Graduated
]

// The SRS timing function
export function getTimeFromLevel(level: number) {
    return timingLookup[level]
}

export function getReviewTime(progress: ConceptProgressItem) {
    return progress.reviewedAt + getTimeFromLevel(progress.level - 1)
}

export function isReadyForReview(progress: ConceptProgressItem) {
    return progress.level > 0 && Date.now() > getReviewTime(progress)
}

/** Tolerate more egregious typos in longer answers */
function distanceTolerance(s: string) {
    switch (s.length) {
        case 1:
        case 2:
        case 3:
            return 0
        case 4:
        case 5:
            return 1
        case 6:
        case 7:
            return 2
        default:
            return 2 + 1 * Math.floor(s.length / 7)
    }
}

import { levenshtein } from './levenshtein'

export function matchesAnswerPermissively(attempt: string, correctAnswer: string): boolean {
    attempt = attempt.toLowerCase()
    correctAnswer = correctAnswer.toLowerCase()

    if (attempt === correctAnswer) {
        return true
    } else {
        const tolerance = distanceTolerance(correctAnswer)
        return levenshtein(attempt, correctAnswer) <= tolerance
    }
}