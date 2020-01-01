import { Concept } from "./concepts"

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

export function isReadyForReview(concept: ConceptProgressItem) {
    return Date.now() > concept.reviewedAt + getTimeFromLevel(concept.level)
}