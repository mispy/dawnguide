import { pageResponse } from "./utils"
import { FrontPage } from "./FrontPage"
import type { EventRequest, SessionRequest } from "./requests"
import { content } from "../common/content"
import { LessonPage } from "./LessonPage"
import * as _ from 'lodash'
import { AppPage } from "./AppPage"
import * as db from './db'

export async function frontPage() {
    return pageResponse(FrontPage)
}

export async function appPage(req: SessionRequest) {
    const userReq = db.users.expect(req.session.userId)
    const progressItemsReq = db.progressItems.allFor(req.session.userId)
    const userLessonsReq = db.userLessons.byLessonId(req.session.userId)

    const user = _.omit(await userReq, 'cryptedPassword')
    const progress = {
        userLessons: await userLessonsReq,
        progressItems: await progressItemsReq
    }
    return pageResponse(AppPage, { user: user, progress: progress })
}

export async function lessonPage(req: EventRequest, lessonId: string) {
    const lesson = content.lessons.find(c => c.id === lessonId)

    if (!lesson) {
        return new Response(`Unknown lesson ${lessonId}`, { status: 404 })
    }

    return pageResponse(LessonPage, { lesson: lesson })
}