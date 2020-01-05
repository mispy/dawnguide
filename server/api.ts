import { SessionRequest } from "./authentication"
import Router from "./router"
import { expectRequestJson, expectStrings, JsonResponse } from "./utils"
import db = require('./db')
import { STRIPE_SECRET_KEY, BASE_URL } from "./settings"
import http from "./http"
import { UserConceptProgress } from "../shared/types"

export async function processRequest(req: SessionRequest) {
    const r = new Router()
    r.get('/api/progress', getProgress)
    r.put('/api/progress', submitProgress)
    r.post('/api/checkout', startCheckout)

    const resp = await r.route(req)
    return new JsonResponse(resp)
}

async function getProgress(req: SessionRequest): Promise<UserConceptProgress> {
    const { userId } = req.session
    return await db.learningProgress.get(userId)
}

/** 
 * When a user successfully reviews a lesson, we increase the
 * SRS level in their lesson progress.
 **/
async function submitProgress(req: SessionRequest) {
    // TODO check level matches
    const json = await expectRequestJson<{ conceptId: string, remembered: boolean }>(req)
    const { conceptId, remembered } = json

    const { userId } = req.session

    const progress = await db.learningProgress.get(req.session.userId)
    const now = Date.now()

    let concept = progress.concepts[conceptId]
    if (!concept) {
        concept = {
            conceptId: conceptId,
            level: remembered ? 1 : 0,
            learnedAt: now,
            reviewedAt: now
        }
        progress.concepts[conceptId] = concept
    } else {
        concept.reviewedAt = now
        if (remembered) {
            concept.level = Math.min(concept.level + 1, 9)
        } else {
            concept.level = Math.max(concept.level - 1, 0)
        }
    }

    await db.learningProgress.set(userId, progress)
}

/** 
 * Create a Stripe Checkout Session when a user
 * wants to buy a subscription
 */
async function startCheckout(req: SessionRequest): Promise<{ checkoutSessionId: string }> {
    const user = await db.users.get(req.session.userId)
    const { planId } = expectStrings(req.params, 'planId')

    if (planId === 'sunpeep_monthly' || planId === 'sunpeep_annual') {
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
    } else if (planId === 'sunpeep_lifetime') {
        const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", {
            customer_email: user!.email,
            payment_method_types: ['card'],
            line_items: [{
                name: 'Sunpeep Lifetime',
                description: 'Lifetime subscription to sunpeep',
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