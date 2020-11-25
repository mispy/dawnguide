import Router from "./router"
import { ResponseError, expectKeys, trimStrings } from "./utils"
import * as db from './db'
import { UserProgressItem, UserAdminReport } from '../common/types'
import { getReviewTime } from "../common/logic"
import * as _ from 'lodash'
import { sendMail } from "./mail"
import * as bcrypt from "bcryptjs"
import { SessionRequest, EventRequest } from "./requests"
import * as payments from './paymentsController'
import { CONTACT_FORM_EMAIL } from "./settings"
import { content } from "../common/content"
import { sendLessonEmail } from "./lessonEmail"
import { absurl } from "../common/utils"
import { sendReviewsEmail } from "./reviewsEmail"

export async function processRequest(req: EventRequest) {
    if (!req.session) {
        throw new ResponseError("Login required", 401)
    }

    const r = new Router<SessionRequest>()
    r.get('/api/progress', getProgress)
    r.put('/api/progress', submitProgress)
    r.post('/api/lesson', completeLesson)
    r.get('/api/users/me', getCurrentUser)
    r.post('/api/changeEmail', changeEmail)
    r.post('/api/changeUsername', changeUsername)
    r.post('/api/changePassword', changePassword)
    r.get('/api/notificationSettings', getNotificationSettings)
    r.patch('/api/notificationSettings', updateNotificationSettings)
    r.post('/api/subscribe', payments.subscribeToPlan)
    r.post('/api/cancelSubscription', payments.cancelSubscription)
    r.post('/api/contact', sendContactMessage)
    r.post('/api/debug', debugHandler)
    r.all('/api/admin/.*', admin.processRequest)

    return await r.route(req as SessionRequest)
}

async function getProgress(req: SessionRequest): Promise<{ items: UserProgressItem[] }> {
    const { userId } = req.session
    return { items: await db.progressItems.allFor(userId) }
}

/** 
 * Called when a user has completed the lesson for a Lesson and is moving
 * on to reviews
 */
async function completeLesson(req: SessionRequest) {
    const { exerciseIds } = expectKeys(req.json, 'exerciseIds')
    const { userId } = req.session

    const toSave = []
    const now = Date.now()
    for (const exerciseId of exerciseIds) {
        const item = await db.progressItems.get(userId, exerciseId)
        if (!item) {
            toSave.push({
                userId: userId,
                exerciseId: exerciseId,
                level: 1,
                learnedAt: now,
                reviewedAt: now
            })
        }
    }

    await db.progressItems.saveAll(userId, toSave)
}

/** Retrieve the currently logged in user info */
async function getCurrentUser(req: SessionRequest) {
    const user = await db.users.expect(req.session.userId)
    return _.omit(user, 'cryptedPassword')
}


/** 
 * When a user successfully completes an exercise, we increase the
 * SRS level in their exercise progress.
 **/
async function submitProgress(req: SessionRequest) {
    // TODO check level matches
    const { exerciseId, remembered } = expectKeys(req.json, 'exerciseId', 'remembered')

    const { userId } = req.session

    let progressItem = await db.progressItems.get(userId, exerciseId)
    const now = Date.now()

    if (!progressItem) {
        if (!remembered)
            return // Still haven't actually learned this

        progressItem = {
            userId: userId,
            exerciseId: exerciseId,
            level: 1,
            learnedAt: now,
            reviewedAt: now
        }
    } else {
        if (remembered) {
            progressItem.reviewedAt = now
            progressItem.level = Math.min(progressItem.level + 1, 9)
        } else {
            progressItem.level = Math.max(progressItem.level - 1, 1)
        }
    }

    await db.progressItems.save(progressItem)
}

async function debugHandler(req: SessionRequest) {
    const { userId } = req.session
    const json = trimStrings(req.json, 'action')

    if (json.action === 'resetProgress') {
        await db.progressItems.resetAllProgressTo(userId, [])
    } else if (json.action === 'moveReviewsForward') {
        const items = await db.progressItems.allFor(userId)

        const now = Date.now()
        for (const item of items) {
            const nextReview = getReviewTime(item)
            if (nextReview > now)
                item.reviewedAt -= (nextReview - now)
        }
        await db.progressItems.resetAllProgressTo(userId, items)
    } else {
        throw new Error(`Unknown debug action ${json.action}`)
    }
}

async function changeUsername(req: SessionRequest) {
    const { newUsername } = trimStrings(req.json, 'newUsername')
    await db.users.changeUsername(req.session.userId, newUsername)
}

async function changeEmail(req: SessionRequest) {
    const { newEmail, password } = trimStrings(req.json, 'newEmail', 'password')
    const user = await db.users.expect(req.session.userId)

    if (user.email === newEmail && user.emailConfirmed)
        return // Nothing to do here!

    const existingUser = await db.users.getByEmail(newEmail)
    if (existingUser && existingUser.id !== user.id)
        throw new ResponseError(`Email ${newEmail} is already associated with an account`, 409)

    const validPassword = bcrypt.compareSync(password, user.cryptedPassword)
    if (validPassword) {
        const token = await db.emailConfirmTokens.create(user.id, newEmail)
        const confirmUrl = absurl(`/account/confirmation/${token}`)
        await sendMail({
            to: newEmail,
            subject: "Confirm your email address",
            text: `Hello! You've requested an email change to your account. In order to finalize the change, follow this link: ${confirmUrl}`
        })
    } else {
        throw new ResponseError("Unauthorized", 401)
    }
}

async function changePassword(req: SessionRequest) {
    const { newPassword, currentPassword } = trimStrings(req.json, 'newPassword', 'currentPassword')
    const user = await db.users.expect(req.session.userId)

    if (newPassword.length < 10) {
        throw new ResponseError(`Please use a password at least 10 characters long`, 422)
    }

    const validPassword = bcrypt.compareSync(currentPassword, user.cryptedPassword)
    if (validPassword) {
        await db.users.update(user.id, { cryptedPassword: db.users.hashPassword(newPassword) })
        return { success: true }
    } else {
        return new Response("Unauthorized", { status: 401 })
    }
}

async function getNotificationSettings(req: SessionRequest) {
    return await db.notificationSettings.get(req.session.userId)
}

async function updateNotificationSettings(req: SessionRequest) {
    const settings = await db.notificationSettings.get(req.session.userId)

    if ('disableNotificationEmails' in req.json) {
        settings.disableNotificationEmails = !!req.json.disableNotificationEmails
    }

    if ('emailAboutNewConcepts' in req.json) {
        settings.emailAboutNewConcepts = !!req.json.emailAboutNewConcepts
    }

    if ('emailAboutWeeklyReviews' in req.json) {
        settings.emailAboutWeeklyReviews = !!req.json.emailAboutWeeklyReviews
    }

    await db.notificationSettings.set(req.session.userId, settings)
}

async function sendContactMessage(req: SessionRequest) {
    const user = await db.users.expect(req.session.userId)
    const { subject, body } = trimStrings(req.json, 'subject', 'body')
    return await sendMail({
        to: CONTACT_FORM_EMAIL,
        subject: `Contact from ${user.username}: ${subject}`,
        text: body + `\n\nDawnguide user email: ${user.email}`
    })
}

export namespace admin {
    export async function processRequest(req: SessionRequest) {
        const user = await db.users.get(req.session.userId)
        if (!user || user.email !== "lumebug@gmail.com") {
            return new Response("Unauthorized", { status: 401 })
        }

        const r = new Router<SessionRequest>()
        r.get('/api/admin/users', getUsers)
        r.delete('/api/admin/users/(.*)', deleteUser)
        r.post('/api/admin/testLessonEmail', testLessonEmail)
        r.post('/api/admin/testReviewsEmail', testReviewsEmail)
        r.post('/api/admin/emailEveryone', emailEveryone)

        return await r.route(req)
    }

    export async function getUsers(): Promise<UserAdminReport[]> {
        const users = await db.users.all()
        const userProgress = await Promise.all(users.map(u => db.progressItems.allFor(u.id)))
        const notificationSettings = await Promise.all(users.map(u => db.notificationSettings.get(u.id)))

        return users.map((u, i) => {
            const progress = userProgress[i]
            const progressByExercise = _.keyBy(progress, p => p.exerciseId)
            const meanLevel = _.meanBy(content.exercises, e => progressByExercise[e.id]?.level || 0)
            const lessonsStudied = content.lessons.filter(c => _.some(c.exercises, e => progressByExercise[e.id])).length

            return Object.assign(
                _.pick(u, 'id', 'email', 'username', 'createdAt', 'updatedAt', 'lastSeenAt'),
                { meanLevel: meanLevel, lessonsStudied: lessonsStudied, notificationSettings: notificationSettings[i]! }
            )
        })
    }

    export async function deleteUser(req: SessionRequest, userId: string) {
        await db.users.del(userId)
        return { userId: userId, deleted: true }
    }

    export async function testLessonEmail(req: SessionRequest) {
        const { lessonId } = trimStrings(req.json, 'lessonId')
        const lesson = content.expectLesson(lessonId)

        const user = await db.users.expect(req.session.userId)
        await sendLessonEmail(user, lesson)
    }

    export async function testReviewsEmail(req: SessionRequest) {
        const user = await db.users.expect(req.session.userId)
        await sendReviewsEmail(user)
    }

    export async function emailEveryone(req: SessionRequest) {
        const { lessonId } = trimStrings(req.json, 'lessonId')
        const Lesson = content.expectLesson(lessonId)

        const promises = []
        for (const user of await db.users.all()) {
            const settings = await db.notificationSettings.get(user.id)
            if (settings.emailAboutNewConcepts && !settings.disableNotificationEmails) {
                promises.push(sendLessonEmail(user, Lesson))
            }
        }

        await Promise.all(promises)
    }
}