import db = require('./db')
import { EventRequest, SessionRequest } from './requests'
import { expectStrings, absurl } from './utils'
import { MONTHLY_PLAN_ID, ANNUAL_PLAN_ID } from '../shared/settings'

import stripe = require('./stripe')
import { User } from '../shared/types'

export async function subscribeToPlan(req: SessionRequest): Promise<{ checkoutSessionId: string } | { user: User }> {
    const user = await db.users.expect(req.session.userId)

    const { planId } = expectStrings(req.params, 'planId')

    if (user.subscription) {
        if (user.subscription.planId === planId) {
            // User already subscribed to this plan, just pretend we did something
            return { user: user }
        } else {
            // User subscribed to different plan than requested, let's change it
            const { subscriptionId } = user.subscription

            const sub = await stripe.subscriptionsRetrieve(subscriptionId)
            // TODO error handling
            await stripe.subscriptionsUpdate(subscriptionId, {
                cancel_at_period_end: false,
                proration_behavior: 'create_prorations',
                items: [{
                    id: sub.items.data[0].id,
                    plan: planId,
                }]
            });

            const newUser = await db.users.update(user.id, {
                subscription: {
                    planId: planId,
                    subscriptionId: subscriptionId,
                    customerId: user.subscription.customerId,
                    subscribedAt: Date.now()
                }
            })

            return { user: newUser }
        }
    } else {
        // User has no currently active subscription, do a checkout session
        if (planId === MONTHLY_PLAN_ID || planId === ANNUAL_PLAN_ID) {
            const resp = await stripe.checkoutSessionsCreate({
                customer_email: user!.email,
                payment_method_types: ['card'],
                subscription_data: {
                    items: [{
                        plan: planId,
                    }],
                },
                success_url: absurl(`/subscription?planId=${planId}`),
                cancel_url: absurl('/subscription'),
            })

            if (!resp.id) {
                console.error(resp)
                throw new Error("Unable to communicate with Stripe")
            }

            return { checkoutSessionId: resp.id }
            // } else if (planId === 'dawnguide_lifetime') {
            //     const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", {
            //         customer_email: user!.email,
            //         payment_method_types: ['card'],
            //         line_items: [{
            //             name: 'Dawnguide Lifetime',
            //             description: 'Lifetime subscription to dawnguide',
            //             amount: 29900,
            //             currency: 'usd',
            //             quantity: 1,
            //         }],
            //         success_url: absurl('/subscription'),
            //         cancel_url: absurl('/subscription'),
            //     }, {
            //         headers: {
            //             'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            //         }
            //     })

            //     if (!resp.id) {
            //         console.error(resp)
            //         throw new Error("Unable to communicate with Stripe")
            //     }

            //     return { checkoutSessionId: resp.id }
        } else {
            throw new Error(`Unexpected planId ${planId}`)
        }
    }
}

export async function cancelSubscription(req: SessionRequest): Promise<{ user: User }> {
    const user = await db.users.expect(req.session.userId)

    if (!user.subscription) {
        return { user: user }
    }

    await stripe.subscriptionsDel(user.subscription.subscriptionId)

    const newUser = await db.users.update(user.id, {
        subscription: undefined
    })

    return { user: newUser }
}


/**
 * Example (test) stripe subscription event:
 * 
{
  "id": "evt_1GeInQA4KKKbUIB5QCQPC55I",
  "object": "event",
  "api_version": "2019-03-14",
  "created": 1588416131,
  "data": {
    "object": {
      "id": "cs_test_hR9PNV6BskWg7xCDKYddNU3Rg3Fj2n1i362H8nkU0CuiGbOrBes2TNT8",
      "object": "checkout.session",
      "billing_address_collection": null,
      "cancel_url": "http://localhost:3000/subscription",
      "client_reference_id": null,
      "customer": "cus_HCiDzRqkc5HvPr",
      "customer_email": "foldspark@gmail.com",
      "display_items": [
        {
          "amount": 900,
          "currency": "usd",
          "plan": {
            "id": "dawnguide_monthly",
            "object": "plan",
            "active": true,
            "aggregate_usage": null,
            "amount": 900,
            "amount_decimal": "900",
            "billing_scheme": "per_unit",
            "created": 1588383259,
            "currency": "usd",
            "interval": "month",
            "interval_count": 1,
            "livemode": false,
            "metadata": {},
            "nickname": "dawnguide_monthly",
            "product": "prod_GNIen0S7DCdB4W",
            "tiers": null,
            "tiers_mode": null,
            "transform_usage": null,
            "trial_period_days": null,
            "usage_type": "licensed"
          },
          "quantity": 1,
          "type": "plan"
        }
      ],
      "livemode": false,
      "locale": null,
      "metadata": {},
      "mode": "subscription",
      "payment_intent": null,
      "payment_method_types": [
        "card"
      ],
      "setup_intent": null,
      "shipping": null,
      "shipping_address_collection": null,
      "submit_type": null,
      "subscription": "sub_HCiDmh9FhO81Lm",
      "success_url": "http://localhost:3000/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}"
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_OFGBkAcu2Uc8FC",
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
} */
export async function stripeWebhook(req: EventRequest) {
    const event = req.json

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const planId = session.display_items[0].plan.id
        const userEmail = session.customer_email

        const user = await db.users.expectByEmail(userEmail)
        await db.users.update(user.id, {
            subscription: {
                planId: planId,
                customerId: session.customer,
                subscriptionId: session.subscription,
                subscribedAt: Date.now()
            }
        })
    }

    return { received: true }
}

