export interface UserProgressItem {
    /** Database id of the user whose learning progress this is */
    userId: string
    /** Unique id of the concept, which refers to a hardcoded string */
    conceptId: string
    /** SRS stage from 1 to 10 */
    level: number

    /** When this lesson was initially learned */
    learnedAt: number
    /** When last reviewed or learned */
    reviewedAt: number
}