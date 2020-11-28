
// @ts-ignore
import * as bibTexParse from 'bibtex-parser-js'

import { computed, observable } from 'mobx'

import lessonDefs from '../common/lessons'
import { LessonDef, Reference, MarkdownString, UserProgressItem, Exercise, LessonType, UserLesson } from './types'
import * as _ from 'lodash'
import { isReadyForReview } from './logic'

/**
 * Singleton class that everything goes through to access Dawnguide content.
 * Wraps all the plain object defs into mobx instances w/ useful computed properties.
 */
class ContentIndex {
    @observable.ref lessonsWithDrafts: Lesson[] = []

    @computed get lessons() {
        return this.lessonsWithDrafts.filter(c => !c.draft)
    }

    @computed get lessonById() {
        return _.keyBy(this.lessons, c => c.id)
    }

    @computed get exercises() {
        return _.flatten(this.lessons.map(c => c.exercises))
    }

    @computed get exerciseById() {
        return _.keyBy(this.exercises, e => e.id)
    }

    getLesson(lessonId: string): Lesson | undefined {
        return this.lessonById[lessonId]
    }

    expectLesson(lessonId: string): Lesson {
        const Lesson = this.getLesson(lessonId)
        if (!Lesson) {
            throw new Error(`No known lesson with id '${lessonId}'`)
        }
        return Lesson
    }

    getExercise(exerciseId: string): Exercise | undefined {
        return this.exerciseById[exerciseId]
    }

    getLessonsAndReviews(userLessons: Record<string, UserLesson>, progressItems: UserProgressItem[]) {
        const progressByExerciseId = _.keyBy(progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>

        const activeLessons = this.lessons.filter(l => !userLessons[l.id]?.disabled)

        const untouchedLessons = activeLessons.filter(c => {
            return c.exercises.every(e => !progressByExerciseId[e.id])
        })

        const reviewableLessons = activeLessons.filter(c => {
            return c.exercises.some(e => progressByExerciseId[e.id])
        })

        const reviews: Review[] = []
        for (const lesson of reviewableLessons) {
            for (const exercise of lesson.exercises) {
                const item = progressByExerciseId[exercise.id]
                if (!item || isReadyForReview(item)) {
                    reviews.push({
                        lesson: lesson,
                        exercise: exercise
                    })
                }
            }
        }

        return { lessons: untouchedLessons, reviews }
    }

    constructor() {
        for (const def of lessonDefs) {
            this.lessonsWithDrafts.push(new Lesson(def))
        }
    }
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

    return json.map((entry: any) => ({
        id: entry.citationKey.toLowerCase(),
        title: entry.entryTags.TITLE,
        author: entry.entryTags.AUTHOR.split(" and ").map((s: string) => {
            const a = s.split(", ")
            return {
                family: a[0],
                given: a[1]
            }
        }),
        journal: entry.entryTags.JOURNAL,
        volume: entry.entryTags.VOLUME,
        issue: entry.entryTags.NUMBER,
        page: entry.entryTags.PAGES,
        year: entry.entryTags.YEAR,
        publisher: entry.entryTags.PUBLISHER,
        url: entry.entryTags.URL
    }))
}

export class Lesson {
    @observable def: LessonDef
    constructor(def: LessonDef) {
        this.def = def
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

    @computed get name(): string {
        return this.def.title.toLowerCase()
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

    @computed get type(): LessonType {
        return (this.def.type || 'reading') as LessonType
    }

    @computed get draft(): boolean {
        return !!this.def.draft
    }

    @computed get introduction(): MarkdownString {
        return this.def.introduction.trim()
    }

    @computed get furtherReading(): MarkdownString | undefined {
        return this.def.furtherReading
    }

    @computed get notes(): MarkdownString | undefined {
        return this.def.notes
    }

    @computed get exercises(): Exercise[] {
        return this.def.exercises.map((e, i) => {
            return {
                id: `${this.id}:${i}`,
                lessonId: this.id,
                ...e
            }
        })
    }

    @computed get references(): Reference[] {
        return parseBibliography(this.def.bibliography)
    }
}

export type Review = {
    lesson: Lesson
    exercise: Exercise
}

export const content = new ContentIndex()