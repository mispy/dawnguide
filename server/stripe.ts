/**
 * Since Cloudflare Workers run in a service worker execution environment
 * rather than a node environment, we can't use the actual Stripe npm package.
 * So we roll our own wrapper for the API here.
 */

import http from './http'
import { STRIPE_SECRET_KEY } from './settings'



/** Stripe subscription */
interface Subscription {
    items: {
        data: {
            id: string
            object: "subscription_item"
        }[]
    }
    // More stuff 
}

/** Retrieve a subscription by id */
export async function subscriptionsRetrieve(subscriptionId: string): Promise<Subscription> {
    const resp = await http.get(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
        {
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            }
        }
    )
    return resp
}

interface SubscriptionUpdateOptions {
    cancel_at_period_end: boolean
    proration_behavior: 'create_prorations'
    items: {
        id: string
        plan: string
    }[]
}

export async function subscriptionsUpdate(subscriptionId: string, options: SubscriptionUpdateOptions) {
    const resp = await http.post(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, options, {
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
        }
    })

    return resp
}

interface CheckoutSessionCreateOptions {
    customer_email: string
    payment_method_types: ['card']
    subscription_data: {
        items: {
            plan: string
        }[]
    }
    success_url: string
    cancel_url: string
}

export async function checkoutSessionsCreate(options: CheckoutSessionCreateOptions) {
    const resp = await http.post("https://api.stripe.com/v1/checkout/sessions", options, {
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
        }
    })

    return resp
}

export async function subscriptionsDel(subscriptionId: string) {
    const resp = await http.del(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
        }
    })

    return resp
}