import Router from "./router"
import { expectStrings, absurl, ResponseError, expectKeys } from "./utils"
import * as db from './db'
import { User, UserProgressItem } from '../shared/types'
import { getReviewTime } from "../shared/logic"
import * as _ from 'lodash'
import { sendMail } from "./mail"
import bcrypt = require('bcryptjs')
import { SessionRequest } from "./requests"
import { reviewsEmailHtml } from "./reviewsEmail"
import * as payments from './paymentsController'
import { CONTACT_FORM_EMAIL } from "./settings"

export async function processRequest(req: SessionRequest) {
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

    return await r.route(req)
}

async function getProgress(req: SessionRequest): Promise<{ items: UserProgressItem[] }> {
    const { userId } = req.session
    return { items: await db.progressItems.allFor(userId) }
}

/** 
 * Called when a user has completed the lesson for a concept and is moving
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
        progressItem.reviewedAt = now
        if (remembered) {
            progressItem.level = Math.min(progressItem.level + 1, 9)
        } else {
            progressItem.level = Math.max(progressItem.level - 1, 1)
        }
    }

    await db.progressItems.save(progressItem)
}

async function debugHandler(req: SessionRequest) {
    const { userId } = req.session
    const json = expectStrings(req.json, 'action')

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
    const { newUsername } = expectStrings(req.json, 'newUsername')
    await db.users.changeUsername(req.session.userId, newUsername)
}

async function changeEmail(req: SessionRequest) {
    const { newEmail, password } = expectStrings(req.json, 'newEmail', 'password')
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
    const { newPassword, currentPassword } = expectStrings(req.json, 'newPassword', 'currentPassword')
    const user = await db.users.expect(req.session.userId)

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
    const { subject, body } = expectStrings(req.json, 'subject', 'body')
    return await sendMail({
        to: CONTACT_FORM_EMAIL,
        subject: `Contact from ${user.username}: ${subject}`,
        text: body + `\n\nDawnguide user email: ${user.email}`
    })
}

export namespace admin {
    export async function processRequest(req: SessionRequest) {
        const user = await db.users.get(req.session.userId)
        if (!user || user.email !== "foldspark@gmail.com") {
            return new Response("Unauthorized", { status: 401 })
        }

        const r = new Router<SessionRequest>()
        r.get('/api/admin/users', getUsers)
        r.delete('/api/admin/users/(.*)', deleteUser)
        r.post('/api/admin/testConceptEmail', testConceptEmail)

        return await r.route(req)
    }

    export async function getUsers(): Promise<User[]> {
        const users = await db.users.all()
        return users.map(u => _.pick(u, 'id', 'email', 'username', 'createdAt', 'updatedAt'))
    }

    export async function deleteUser(req: SessionRequest, userId: string) {
        await db.users.del(userId)
        return { userId: userId, deleted: true }
    }

    export async function testConceptEmail(req: SessionRequest) {
        // const { conceptId } = expectStrings(req.json, 'conceptId')
        // const concept = new Sunpedia().expectConcept(conceptId)

        // await sendMail({
        //     to: "foldspark@gmail.com",
        //     subject: concept.title,
        //     html: concept.introduction
        // })

        const user = await db.users.expect(req.session.userId)

        await sendMail({
            to: "misprime@gmail.com",
            subject: "Your Lessons and Reviews Update",
            html: await reviewsEmailHtml(user, 0, 9)
        })

    }
}