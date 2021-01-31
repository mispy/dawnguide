import Router from "./router"
import { ResponseError } from "./utils"
import * as db from './db'
import type { UserAdminReport, UserLesson, UserProgress } from '../common/types'
import { getReviewDelayByLevel, SRSProgress } from "../common/SRSProgress"
import * as _ from 'lodash'
import { sendMail } from "./mail"
import * as bcrypt from "bcryptjs"
import type { SessionRequest, EventRequest } from "./requests"
import * as payments from './paymentsController'
import { CONTACT_FORM_EMAIL } from "./settings"
import { content } from "../common/content"
import { sendLessonEmail } from "./lessonEmail"
import { absurl } from "../common/utils"
import { sendReviewsEmail } from "./reviewsEmail"
import * as z from 'zod'
import type { SRSProgressStore } from "../common/SRSProgress"

export async function processRequest(req: EventRequest) {
    if (!req.session) {
        throw new ResponseError("Login required", 401)
    }

    const r = new Router<SessionRequest>()
    r.get('/api/progress', getProgress)
    r.patch('/api/progress', reconcileProgress)
    r.put('/api/srs', srsUpdate)
    r.post('/api/lesson', completeLesson)
    r.patch('/api/userLessons/(.*)', updateUserLesson)
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

async function getProgress(req: SessionRequest): Promise<UserProgress> {
    const { userId } = req.session
    return await db.progressItems.getProgressFor(userId)
}

const reconcileProgressForm = z.object({
    changes: z.array(z.object({
        cardId: z.string(),
        level: z.number(),
        reviewedAt: z.number(),
        learnedAt: z.number()
    }))
})
async function reconcileProgress(req: SessionRequest): Promise<void> {
    const { userId } = req.session
    const { changes } = reconcileProgressForm.parse(req.json)
    const { progressStore } = await db.progressItems.getProgressFor(userId)
    const srs = new SRSProgress(progressStore)
    const { changedItems } = srs.reconcile(changes)

    const dbItems = changedItems.map(d => ({
        userId,
        exerciseId: d.cardId,
        level: d.level,
        reviewedAt: d.reviewedAt,
        learnedAt: d.learnedAt
    }))

    await db.progressItems.saveAll(userId, dbItems)
}

/** 
 * Called when a user has completed the lesson for a Lesson and is moving
 * on to reviews
 */
const completeLessonForm = z.object({
    exerciseIds: z.array(z.string()).min(1)
})
async function completeLesson(req: SessionRequest) {
    const { exerciseIds } = completeLessonForm.parse(req.json)
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

const updateLessonForm = z.object({
    disabled: z.boolean()
})
async function updateUserLesson(req: SessionRequest, lessonId: string): Promise<UserLesson> {
    const changes = updateLessonForm.parse(req.json)
    return await db.userLessons.update(req.session.userId, lessonId, changes)
}

/** 
 * When a user successfully completes an exercise, we increase the
 * SRS level in their exercise progress.
 **/
const srsUpdateForm = z.object({
    exerciseId: z.string(),
    remembered: z.boolean()
})
async function srsUpdate(req: SessionRequest) {
    const { exerciseId, remembered } = srsUpdateForm.parse(req.json)
    const { userId } = req.session

    const dbProgressItem = await db.progressItems.get(userId, exerciseId)
    const store: SRSProgressStore = { items: [] }
    if (dbProgressItem) {
        store.items.push({
            cardId: exerciseId,
            level: dbProgressItem.level,
            reviewedAt: dbProgressItem.reviewedAt,
            learnedAt: dbProgressItem.learnedAt
        })
    }
    const srs = new SRSProgress(store)
    srs.update({ cardId: exerciseId, remembered })

    if (srs.updates.length) {
        const item = srs.expect(exerciseId)
        await db.progressItems.save({
            userId: userId,
            exerciseId: exerciseId,
            level: item.level,
            reviewedAt: item.reviewedAt,
            learnedAt: item.learnedAt
        })
    }
}

async function debugHandler(req: SessionRequest) {
    const { userId } = req.session
    const { action } = req.json

    if (action === 'resetProgress') {
        await db.progressItems.resetAllProgressTo(userId, [])
    } else if (action === 'moveReviewsForward') {
        const items = await db.progressItems.allFor(userId)

        const now = Date.now()
        for (const item of items) {
            const delay = getReviewDelayByLevel(item.level)
            const nextReviewAt = item.reviewedAt + delay
            if (nextReviewAt > now)
                item.reviewedAt -= (nextReviewAt - now)
        }
        await db.progressItems.resetAllProgressTo(userId, items)
    } else {
        throw new Error(`Unknown debug action ${action}`)
    }
}

const changeUsernameForm = z.object({
    newUsername: z.string().max(100)
})
async function changeUsername(req: SessionRequest) {
    const { newUsername } = changeUsernameForm.parse(req.json)
    await db.users.changeUsername(req.session.userId, newUsername)
}

const changeEmailForm = z.object({
    newEmail: z.string().email(),
    password: z.string()
})
async function changeEmail(req: SessionRequest) {
    const { newEmail, password } = changeEmailForm.parse(req.json)
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

const changePasswordForm = z.object({
    newPassword: z.string().min(10),
    currentPassword: z.string()
})
async function changePassword(req: SessionRequest) {
    const { newPassword, currentPassword } = changePasswordForm.parse(req.json)
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

const notifSettingsForm = z.object({
    disableNotificationEmails: z.boolean().optional(),
    emailAboutNewConcepts: z.boolean().optional(),
    emailAboutWeeklyReviews: z.boolean().optional()
})
async function updateNotificationSettings(req: SessionRequest) {
    const changes = notifSettingsForm.parse(req.json)
    await db.notificationSettings.update(req.session.userId, changes)
}

const contactForm = z.object({
    subject: z.string().max(300),
    body: z.string().max(30000)
})
async function sendContactMessage(req: SessionRequest) {
    const user = await db.users.expect(req.session.userId)
    const { subject, body } = contactForm.parse(req.json)
    return await sendMail({
        to: CONTACT_FORM_EMAIL,
        subject: `Contact from ${user.username}: ${subject}`,
        text: body + `\n\nDawnguide user email: ${user.email}`
    })
}

export namespace admin {
    export async function processRequest(req: SessionRequest) {
        const user = await db.users.get(req.session.userId)
        if (!user || user.email !== "jaiden@mispy.me") {
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
        const lesson = content.expectLesson(req.json.lessonId)

        const user = await db.users.expect(req.session.userId)
        await sendLessonEmail(user, lesson)
    }

    export async function testReviewsEmail(req: SessionRequest) {
        const user = await db.users.expect(req.session.userId)
        await sendReviewsEmail(user)
    }

    export async function emailEveryone(req: SessionRequest) {
        const Lesson = content.expectLesson(req.json.lessonId)

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