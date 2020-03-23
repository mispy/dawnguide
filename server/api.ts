import { SessionRequest } from "./authentication"
import Router from "./router"
import { expectRequestJson, expectStrings, JsonResponse } from "./utils"
import db = require('./db')
import { STRIPE_SECRET_KEY, BASE_URL } from "./settings"
import http from "./http"
import { UserProgressItem } from '../shared/types'
import { User, getReviewTime } from "../shared/logic"

export async function processRequest(req: SessionRequest) {
  const r = new Router()
  r.get('/api/progress', getProgress)
  r.put('/api/progress', submitProgress)
  r.post('/api/checkout', startCheckout)
  r.post('/api/debug', debugHandler)

  const resp = await r.route(req)
  return new JsonResponse(resp)
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
  const json = await expectRequestJson<{ exerciseId: string, remembered: boolean }>(req)
}

/** 
 * When a user successfully completes an exercise, we increase the
 * SRS level in their exercise progress.
 **/
async function submitProgress(req: SessionRequest) {
  // TODO check level matches
  const json = await expectRequestJson<{ exerciseId: string, remembered: boolean }>(req)
  const { exerciseId, remembered } = json

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

async function debugHandler(req: SessionRequest) {
  const { userId } = req.session
  const json = await expectRequestJson<{ action: string }>(req)

  if (json.action === 'resetProgress') {
    await db.progressItems.setAll(userId, [])
  } else if (json.action === 'moveReviewsForward') {
    const items = await db.progressItems.allFor(userId)

    const now = Date.now()
    for (const item of items) {
      const nextReview = getReviewTime(item)
      if (nextReview > now)
        item.reviewedAt -= (nextReview - now)
    }
    await db.progressItems.setAll(userId, items)
  } else {
    throw new Error(`Unknown debug action ${json.action}`)
  }
}

// TODO
export namespace admin {
  export async function getUsers(): Promise<{ users: User[] }> {
    return { users: await db.users.list() }
  }
}