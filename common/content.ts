
import { computed, observable } from 'mobx'

import lessonDefs from '../common/pages'
import type { LessonDef, Reference, MarkdownString, Card, ReadingLessonDef, MeditationLessonDef } from './types'
import _ from 'lodash'

// @ts-ignore
import * as bibTexParse from 'bibtex-parser-js'
import { DateTime } from 'luxon'

declare const window: any

/**
 * Singleton class that everything goes through to access Dawnguide content.
 * Wraps all the plain object defs into mobx instances w/ useful computed properties.
 */
class ContentIndex {
    @observable.ref lessonsWithDrafts: Lesson[] = []

    constructor() {
        if (typeof window !== 'undefined') window.content = this

        for (const def of lessonDefs) {
            if (def.type === 'meditation')
                this.lessonsWithDrafts.push(new MeditationLesson(def))
            else
                this.lessonsWithDrafts.push(new ReadingLesson(def))
        }
    }

    @computed get lessons(): PublishedLesson[] {
        const publishedLessons = this.lessonsWithDrafts.filter(l => !!l.def.publishedDate) as PublishedLesson[]
        return _.sortBy(publishedLessons, l => -l.publishedDate)
    }

    @computed get lessonById() {
        return _.keyBy(this.lessons, c => c.id)
    }

    @computed get lessonByIdWithDrafts() {
        return _.keyBy(this.lessonsWithDrafts, c => c.id)
    }

    @computed get exercises() {
        return _.flatten(this.lessons.map(c => 'exercises' in c ? c.exercises : []))
    }

    @computed get exerciseById() {
        return _.keyBy(this.exercises, e => e.id)
    }

    getLesson(lessonId: string): Lesson | undefined {
        return this.lessonById[lessonId]
    }

    expectLesson(lessonId: string): Lesson {
        const lesson = this.lessonByIdWithDrafts[lessonId]
        if (!lesson) {
            throw new Error(`No known lesson with id '${lessonId}'`)
        }
        return lesson
    }

    getExercise(exerciseId: string): Card | undefined {
        return this.exerciseById[exerciseId]
    }

    // getLessonsAndReviews(userLessons: Record<string, UserLesson>, progressItems: UserProgressItem[]) {
    //     const progressByExerciseId = _.keyBy(progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>

    //     const activeLessons = this.lessons.filter(l => !userLessons[l.id]?.disabled)

    //     const untouchedLessons = activeLessons.filter(c => {
    //         return c.exercises.every(e => !progressByExerciseId[e.id])
    //     })

    //     const reviewableLessons = activeLessons.filter(c => {
    //         return c.exercises.some(e => progressByExerciseId[e.id])
    //     })

    //     const reviews: Review[] = []
    //     for (const lesson of reviewableLessons) {
    //         for (const exercise of lesson.exercises) {
    //             const item = progressByExerciseId[exercise.id]
    //             if (!item || isReadyForReview(item)) {
    //                 reviews.push({
    //                     lesson: lesson,
    //                     exercise: exercise
    //                 })
    //             }
    //         }
    //     }

    //     return { lessons: untouchedLessons, reviews }
    // }
}

function parseBibliography(bibliography: string): Reference[] {
    // bibTexParse spits out an object like this:
    //
    // {
    //     citationKey: "CEPEDA2006DISTRIBUTED"
    //     entryType: "ARTICLE"
    //     entryTags: {
    //         TITLE: "Distributed practice in verbal recall tasks: A review and quantitative synthesis."
    //         AUTHOR: "Cepeda, Nicholas J and Pashler, Harold and Vul, Edward and Wixted, John T and Rohrer, Doug"
    //         JOURNAL: "Psychological bulletin"
    //         VOLUME: "132"
    //         NUMBER: "3"
    //         PAGES: "354"
    //         YEAR: "2006"
    //         PUBLISHER: "American Psychological Association"
    //         URL: "https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf"
    //      }
    // }

    const json = bibTexParse.toJSON(bibliography)

    return json.map((entry: any) => {
        const result: any = {
            // bibtex parser uppercases them for some reason
            id: entry.citationKey.toLowerCase(),
            author: entry.entryTags.AUTHOR.split(" and ").map((s: string) => {
                const a = s.split(", ")
                return {
                    family: a[0],
                    given: a[1]
                }
            }),
        }

        for (const key in entry.entryTags) {
            if (!(key.toLowerCase() in result))
                result[key.toLowerCase()] = entry.entryTags[key]
        }
        return result
    })
}

export class BaseLesson<T extends LessonDef> {
    @observable def: T

    constructor(def: T) {
        this.def = def
    }

    @computed get text() {
        return this.def.text.trim()
    }

    @computed get id(): string {
        return this.def.id
    }

    @computed get slug(): string {
        return this.def.slug
    }

    @computed get title(): string {
        return this.def.title
    }

    @computed get draft(): boolean {
        return !this.def.publishedDate
    }

    @computed get name(): string {
        return this.def.name || this.def.title.toLowerCase()
    }

    @computed get subtitle(): string | undefined {
        return this.def.subtitle
    }

    @computed get summaryLine(): string | undefined {
        return this.def.summaryLine
    }

    @computed get author(): string {
        return this.def.author || "Jaiden Mispy"
    }

    @computed get featuredImg(): string {
        return this.def.featuredImg || "foo.jpg"
    }

    @computed get publishedDate(): DateTime | undefined {
        return this.def.publishedDate ? DateTime.fromISO(this.def.publishedDate) : undefined
    }

    @computed get furtherReading(): MarkdownString | undefined {
        return this.def.furtherReading
    }

    @computed get notes(): MarkdownString | undefined {
        return this.def.notes
    }

    @computed get references(): Reference[] {
        return this.def.bibliography ? parseBibliography(this.def.bibliography) : []
    }

    @computed get nextLesson(): PublishedLesson | undefined {
        const index = content.lessons.indexOf(this as any as PublishedLesson)
        return content.lessons[index + 1]
    }

    @computed get referencesById(): Record<string, Reference> {
        return _.keyBy(this.references, ref => ref.id)
    }

    expectReference(refId: string): Reference {
        const ref = this.referencesById[refId.toLowerCase()]
        if (!ref) {
            throw new Error(`Unable to find reference by id ${refId} (valid refs: ${JSON.stringify(this.references.map(r => r.id))})`)
        }
        return ref
    }
}

export class ReadingLesson extends BaseLesson<ReadingLessonDef> {
    type: 'reading' = 'reading'

    @computed get exercises(): Card[] {
        return this.def.exercises.map((e, i) => {
            return {
                id: `${this.id}:${i}`,
                lesson: this,
                lessonId: this.id,
                ...e
            }
        })
    }
}

export class MeditationLesson extends BaseLesson<MeditationLessonDef> {
    type: 'meditation' = 'meditation'

    get exercises() {
        return []
    }
}

export type Lesson = ReadingLesson | MeditationLesson

export type PublishedLesson = Lesson & { publishedDate: DateTime }

export const content = new ContentIndex()