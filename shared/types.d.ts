export type MarkdownString = string
export type BibtexString = string

export type ConceptDef = {
  id: string
  title: string
  introduction: MarkdownString
  furtherReading: MarkdownString
  exercises: Exercise[]
  bibliography: BibtexString
}

export type Exercise = {
  question: string
  answer: string
}

export type Reference = {
  id: string
  title: string
  author: { given: string, family: string }[]
  "container-title": string
  volume: number
  issue: number
  page: string
  publisher: string
  URL: string
  issued: { "date-parts": number[] }
}

export type UserProgressItem = {
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