import Router from "./router"
import { expectStrings, JsonResponse, absurl, ResponseError, expectKeys } from "./utils"
import db = require('./db')
import { STRIPE_SECRET_KEY, BASE_URL } from "./settings"
import http from "./http"
import { User, UserProgressItem } from '../shared/types'
import { getReviewTime } from "../shared/logic"
import _ = require("lodash")
import { sendLearningReminders, sendMail } from "./mail"
import bcrypt = require('bcryptjs')
import { SessionRequest } from "./requests"
import { Sunpedia } from "../shared/sunpedia"

export async function processRequest(req: SessionRequest) {
    const r = new Router<SessionRequest>()
    r.get('/api/progress', getProgress)
    r.put('/api/progress', submitProgress)
    r.post('/api/lesson', completeLesson)
    r.post('/api/changeEmail', changeEmail)
    r.post('/api/changeUsername', changeUsername)
    r.post('/api/changePassword', changePassword)
    r.patch('/api/notificationSettings', updateNotificationSettings)
    r.post('/api/checkout', startCheckout)
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

/** 
 * Create a Stripe Checkout Session when a user
 * wants to buy a subscription
 */
async function startCheckout(req: SessionRequest): Promise<{ checkoutSessionId: string }> {
    const user = await db.users.get(req.session.userId)
    const { planId } = expectStrings(req.params, 'planId')

    if (planId === 'dawnguide_monthly' || planId === 'dawnguide_annual') {
        const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", {
            customer_email: user!.email,
            payment_method_types: ['card'],
            subscription_data: {
                items: [{
                    plan: planId,
                }],
            },
            success_url: `${BASE_URL}/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/account/subscribe`,
        }, {
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            }
        })

        if (!resp.id) {
            console.error(resp)
            throw new Error("Unable to communicate with Stripe")
        }

        return { checkoutSessionId: resp.id }
    } else if (planId === 'dawnguide_lifetime') {
        const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", {
            customer_email: user!.email,
            payment_method_types: ['card'],
            line_items: [{
                name: 'Dawnguide Lifetime',
                description: 'Lifetime subscription to dawnguide',
                amount: 29900,
                currency: 'usd',
                quantity: 1,
            }],
            success_url: `${BASE_URL}/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/account/subscribe`,
        }, {
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            }
        })

        if (!resp.id) {
            console.error(resp)
            throw new Error("Unable to communicate with Stripe")
        }

        return { checkoutSessionId: resp.id }
    } else {
        throw new Error(`Unexpected planId ${planId}`)
    }
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
            subject: "Dawnguide email change confirmation",
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
        user.cryptedPassword = db.users.hashPassword(newPassword)
        await db.users.save(user)
    } else {
        return new Response("Unauthorized", { status: 401 })
    }
}

async function updateNotificationSettings(req: SessionRequest) {
    const user = await db.users.expect(req.session.userId)

    if ('newConcepts' in req.json) {
        user.emailNewConcepts = !!req.json.newConcepts
    }

    if ('weeklyReviews' in req.json) {
        user.emailWeeklyReviews = !!req.json.weeklyReviews
    }

    await db.users.save(user)
}

export namespace admin {
    export async function processRequest(req: SessionRequest) {
        const user = await db.users.get(req.session.userId)
        if (!user || user.email !== "foldspark@gmail.com") {
            return new Response("Unauthorized", { status: 401 })
        }

        const r = new Router<SessionRequest>()
        r.get('/api/admin/users', getUsers)
        r.get('/api/admin/reminders', sendLearningReminders)
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
        const { conceptId } = expectStrings(req.json, 'conceptId')
        const concept = new Sunpedia().expectConcept(conceptId)

        await sendMail({
            to: "foldspark@gmail.com",
            subject: concept.title,
            text: concept.introduction
        })
    }
}