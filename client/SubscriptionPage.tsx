import * as React from 'react'
import { Row, Col, Badge } from "react-bootstrap"
import { STRIPE_PUBLIC_KEY } from "./settings"
import { AppContext } from "./AppContext"
import { MONTHLY_PLAN_ID, ANNUAL_PLAN_ID } from "../shared/settings"
import { SettingsLayout } from "./SettingsLayout"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { loadStripe } from '@stripe/stripe-js'
import { AppStore } from "./AppStore"
import { runInAction, observable, action } from "mobx"
import { bind } from "decko"

declare const window: any

class SubscriptionPageState {
    @observable loading: boolean = false
    constructor(readonly app: AppStore) { }

    @action startLoading() {
        this.loading = true
    }

    @action stopLoading() {
        this.loading = false
    }

    @bind async subscribeMonthly() {
        const { user, api } = this.app

        if (user.subscription && !window.confirm(`Change to the monthly plan? Stripe will apply an appropriate proration against your current plan.`)) {
            return
        }

        this.startLoading()
        try {
            const result = await api.subscribe(MONTHLY_PLAN_ID)

            if ('checkoutSessionId' in result) {
                const stripe = await loadStripe(STRIPE_PUBLIC_KEY)

                const { error } = await stripe!.redirectToCheckout({
                    sessionId: result.checkoutSessionId
                })

                if (error) {
                    throw error
                }
            } else {
                runInAction(() => user.subscription = result.user.subscription)
            }
        } finally {
            this.stopLoading()
        }
    }

    @bind async subscribeAnnual() {
        const { user, api } = this.app

        if (user.subscription && !window.confirm(`Change to the annual plan? Stripe will apply an appropriate proration against your current plan.`)) {
            return
        }

        this.startLoading()
        try {
            const result = await api.subscribe(ANNUAL_PLAN_ID)

            if ('checkoutSessionId' in result) {
                const stripe = await loadStripe(STRIPE_PUBLIC_KEY)

                const { error } = await stripe!.redirectToCheckout({
                    sessionId: result.checkoutSessionId
                })

                if (error) {
                    throw error
                }
            } else {
                runInAction(() => user.subscription = result.user.subscription)
            }
        } finally {
            this.stopLoading()
        }
    }

    @bind async cancelSubscription() {
        const { user, api } = this.app

        if (!window.confirm(`Really cancel your active subscription?`)) {
            return
        }

        this.startLoading()
        try {
            const result = await api.cancelSubscription()
            runInAction(() => user.subscription = result.user.subscription)
        } finally {
            this.stopLoading()
        }
    }
}

export const SubscriptionPage = () => {
    const { app } = React.useContext(AppContext)
    const state = useLocalStore(() => new SubscriptionPageState(app))

    return useObserver(() => {
        // Allow Stripe redirect to override currently known plan id
        // Solves eventual consistency problem with reloading immediately after subscribing
        const urlParams = new URLSearchParams(window.location.search)
        const urlPlanId = urlParams.get('planId')
        const activePlanId = urlPlanId || app.user.subscription?.planId

        return <SettingsLayout active="subscription">
            <div className="SubscriptionPage">
                <Row>
                    <Col>
                        <div className="account-subscription-plan account-subscription-plan-month" data-active={activePlanId === MONTHLY_PLAN_ID} onClick={activePlanId === MONTHLY_PLAN_ID ? undefined : state.subscribeMonthly}>
                            <ul>
                                <li className="account-subscription-plan-type">Monthly</li>
                                <li className="account-subscription-plan-price"><span className="account-subscription-plan-price-num">9.00</span><br /><span className="account-subscription-plan-price-denom-rate">USD/mo</span></li>
                                <li>&nbsp;</li>
                                <li>Full access to all lessons and reviews while subscription is active</li>
                                <li>Recurring charge every month</li>
                            </ul>
                            <div className="account-subscription-plan-select"><button type="button" className="btn" disabled={state.loading}>{activePlanId === MONTHLY_PLAN_ID ? "Active" : "Select"}</button></div>
                        </div>
                    </Col>
                    <Col>
                        <div className="account-subscription-plan account-subscription-plan-annual" data-active={activePlanId === ANNUAL_PLAN_ID} onClick={activePlanId === ANNUAL_PLAN_ID ? undefined : state.subscribeAnnual}>
                            <ul>
                                <li className="account-subscription-plan-type">Annual</li>
                                <li className="account-subscription-plan-price"><span className="account-subscription-plan-price-num">89.00</span><br /><span className="account-subscription-plan-price-denom-rate">USD/yr</span></li>
                                <li><Badge variant="info">2 months free</Badge></li>
                                <li>Full access to all lessons and reviews while subscription is active</li>
                                <li>Recurring charge every year</li>
                            </ul>
                            <div className="account-subscription-plan-select"><button type="button" className="btn" disabled={state.loading}>{activePlanId === ANNUAL_PLAN_ID ? "Active" : "Select"}</button></div>
                        </div>
                    </Col>
                    {/* <Col>
                    <div className="account-subscription-plan account-subscription-plan-lifetime" onClick={subscribeLifetime}>
                        <ul>
                            <li className="account-subscription-plan-type">Lifetime</li>
                            <li className="account-subscription-plan-price"><span className="account-subscription-plan-price-num">299.00</span><br /><span className="account-subscription-plan-price-denom-rate">One-time Purchase</span></li>
                            <li><Badge variant="info">Committed to the Sunshine</Badge></li>
                            <li>Full access to all levels of CBT exercises for the <em>lifetime of the application</em></li>
                            <li>One time charge</li>
                        </ul>
                        <div className="account-subscription-plan-select"><button type="button" className="btn">Select</button></div>
                    </div>
                </Col> */}
                </Row>
                {activePlanId ? <><p className="mt-2">Thank you for your support, nice human! 💛</p><button onClick={state.cancelSubscription} className="btn cancelSubscription">Cancel subscription</button></> : <p className="disclaimer">Please keep in mind that Dawnguide is still very young! By subscribing at this early stage, you're helping to fund the expansion of content and features.</p>}
            </div>
        </SettingsLayout>
    })
}


    // const subscribeLifetime = async () => {
    //     const { checkoutSessionId } = await api.startCheckout('dawnguide_lifetime')

    //     const stripe = Stripe(STRIPE_PUBLIC_KEY)
    //     const { error } = await stripe.redirectToCheckout({
    //         sessionId: checkoutSessionId
    //     })

    //     if (error) {
    //         throw error
    //     }
    // }