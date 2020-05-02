import db = require('./db')
import { EventRequest, SessionRequest } from './requests'
import { expectStrings, absurl } from './utils'
import { MONTHLY_PLAN_ID, ANNUAL_PLAN_ID } from '../shared/settings'
import http from './http'
import { STRIPE_SECRET_KEY } from './settings'

/** 
 * Create a Stripe Checkout Session when a user
 * wants to buy a subscription
 */
export async function startCheckout(req: SessionRequest): Promise<{ checkoutSessionId: string }> {
    const user = await db.users.get(req.session.userId)
    const { planId } = expectStrings(req.params, 'planId')

    if (planId === MONTHLY_PLAN_ID || planId === ANNUAL_PLAN_ID) {
        const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", {
            customer_email: user!.email,
            payment_method_types: ['card'],
            subscription_data: {
                items: [{
                    plan: planId,
                }],
            },
            success_url: absurl('/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}'),
            cancel_url: absurl('/account/subscribe'),
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
            success_url: absurl('/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}'),
            cancel_url: absurl('/account/subscribe'),
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

/**
 * Example (test) stripe subscription event:
 * 
 {"id":"evt_1GeInQA4KKKbUIB5QCQPC55I","object":"event","api_version":"2019-03-14","created":1588416131,"data":{"object":{"id":"cs_test_hR9PNV6BskWg7xCDKYddNU3Rg3Fj2n1i362H8nkU0CuiGbOrBes2TNT8","object":"checkout.session","billing_address_collection":null,"cancel_url":"http://localhost:3000/account/subscribe","client_reference_id":null,"customer":"cus_HCiDzRqkc5HvPr","customer_email":"foldspark@gmail.com","display_items":[{"amount":900,"currency":"usd","plan":{"id":"dawnguide_monthly","object":"plan","active":true,"aggregate_usage":null,"amount":900,"amount_decimal":"900","billing_scheme":"per_unit","created":1588383259,"currency":"usd","interval":"month","interval_count":1,"livemode":false,"metadata":{},"nickname":"dawnguide_monthly","product":"prod_GNIen0S7DCdB4W","tiers":null,"tiers_mode":null,"transform_usage":null,"trial_period_days":null,"usage_type":"licensed"},"quantity":1,"type":"plan"}],"livemode":false,"locale":null,"metadata":{},"mode":"subscription","payment_intent":null,"payment_method_types":["card"],"setup_intent":null,"shipping":null,"shipping_address_collection":null,"submit_type":null,"subscription":"sub_HCiDmh9FhO81Lm","success_url":"http://localhost:3000/account/subscribe/success?session_id={CHECKOUT_SESSION_ID}"}},"livemode":false,"pending_webhooks":1,"request":{"id":"req_OFGBkAcu2Uc8FC","idempotency_key":null},"type":"checkout.session.completed"}
 */
export async function stripeWebhook(req: EventRequest) {
    const event = req.json

    if (event.type === 'checkout.session.completed') {
        const planId = event.data.object.display_items[0].plan.id
        const userEmail = event.data.object.customer_email

        const user = await db.users.expectByEmail(userEmail)
        await db.users.update(user.id, {
            planId: planId
        })
    }

    return { received: true }
}

