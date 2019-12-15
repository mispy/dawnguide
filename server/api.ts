import { SessionRequest } from "./authentication"
import Router from "./router"
import { expectRequestJson, expectStrings } from "./utils"
import db = require('./db')

export async function processRequest(req: SessionRequest) {
    const r = new Router()
    r.post('/api/reviews', submitReview)
    r.route(req)
}

/** 
 * When a user successfully reviews a lesson, we increase the
 * SRS level in their lesson progress.
 **/
async function submitReview(req: SessionRequest) {
    const json = await expectRequestJson(req)
    const { lessonId } = expectStrings(json, 'lessonId')
    const { userId } = req.session

    const progress = await db.lessonProgress.get(req.session.userId)
    const now = Date.now()

    let lesson = progress.lessons[lessonId]
    if (!lesson) {
        lesson = {
            lessonId: lessonId,
            level: 1,
            learnedAt: now,
            reviewedAt: now
        }
        progress.lessons[lessonId] = lesson
    } else {
        lesson.reviewedAt = now
        lesson.level += 1
    }

    await db.lessonProgress.set(userId, progress)
}