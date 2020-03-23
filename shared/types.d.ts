export type MarkdownString = string
export type BibtexString = string

export type ConceptDef = {
  id: string
  title: string
  introduction: MarkdownString
  furtherReading: MarkdownString
  exercises: { question: string, answer: string }[]
  bibliography: BibtexString
}

export type Exercise = {
  id: string
  conceptId: string
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
  /** Unique id of the exercise, which refers to a hardcoded string */
  exerciseId: string
  /** SRS stage from 1 to 10 */
  level: number

  /** When this exercise was initially learned */
  learnedAt: number
  /** When last reviewed or learned */
  reviewedAt: number
}