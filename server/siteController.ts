import { pageResponse } from "./utils"
import { FrontPage } from "./FrontPage"
import type { EventRequest, SessionRequest } from "./requests"
import { content } from "../common/content"
import { LessonPage } from "./LessonPage"
import * as _ from 'lodash'
import { AppPage } from "./AppPage"
import * as db from './db'
import { lessonEmailHtml } from "./lessonEmail"

export async function frontPage() {
    return pageResponse(FrontPage)
}

export async function appPage(req: SessionRequest) {
    const userReq = db.users.expect(req.session.userId)
    const progressReq = db.progressItems.getProgressFor(req.session.userId)
    const progress = await progressReq
    const user = await userReq
    return pageResponse(AppPage, { user: user, progress: progress })
}

export async function lessonPage(req: EventRequest, lessonId: string) {
    const lesson = content.lessonsWithDrafts.find(c => c.id === lessonId)

    if (!lesson) {
        return new Response(`Unknown lesson ${lessonId}`, { status: 404 })
    }

    return pageResponse(LessonPage, { lesson: lesson })
}

export async function lessonEmailPreviewPage(req: SessionRequest, lessonSlug: string) {
    const lesson = content.lessonsWithDrafts.find(c => c.slug === lessonSlug)

    if (!lesson) {
        return new Response(`Unknown lesson ${lessonSlug}`, { status: 404 })
    }

    const user = await db.users.expect(req.session.userId)
    const loginToken = await db.emailConfirmTokens.create(user.id, user.email)
    return new Response(lessonEmailHtml(loginToken, lesson))
}