import { LessonDef } from "./types"

export function defineLesson(def: LessonDef): LessonDef {
    return def
}

/** 
 * Currently just a reimplementation of default template literals
 * Used to inform syntax highlighting
 */
export function md(strs: TemplateStringsArray, ...substs: any[]) {
    return substs.reduce(
        (prev, cur, i) => prev + cur + strs[i + 1],
        strs[0]
    )
}