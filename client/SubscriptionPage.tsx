import React = require("react")
import { AppLayout } from "./AppLayout"
import { Row, Col, Badge, Container } from "react-bootstrap"
import { STRIPE_PUBLIC_KEY } from "./settings"
import { AppContext } from "./AppContext"
import { MONTHLY_PLAN_ID, ANNUAL_PLAN_ID } from "../shared/settings"
import { useEffect } from "react"

export const SubscriptionPage = () => {
    const { user, app, api } = React.useContext(AppContext)

    useEffect(() => {
        // TODO wait for this script to load
        const script = document.createElement('script')

        script.src = "https://js.stripe.com/v3/"
        script.async = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const subscribeMonthly = async () => {
        const { checkoutSessionId } = await api.startCheckout(MONTHLY_PLAN_ID)

        const stripe = Stripe(STRIPE_PUBLIC_KEY)
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionId
        })

        if (error) {
            throw error
        }
    }

    const subscribeYearly = async () => {
        const { checkoutSessionId } = await api.startCheckout(ANNUAL_PLAN_ID)

        const stripe = Stripe(STRIPE_PUBLIC_KEY)
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionId
        })

        if (error) {
            throw error
        }
    }

    const subscribeLifetime = async () => {
        const { checkoutSessionId } = await api.startCheckout('dawnguide_lifetime')

        const stripe = Stripe(STRIPE_PUBLIC_KEY)
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionId
        })

        if (error) {
            throw error
        }
    }

    return <AppLayout>
        <main className="SubscriptionPage">
            <Container>
                <div>
                    Subscription page!
            </div>
                <Row>
                    <Col>
                        <div className="account-subscription-plan account-subscription-plan-month" data-active={user.planId === MONTHLY_PLAN_ID} onClick={subscribeMonthly}>
                            <ul>
                                <li className="account-subscription-plan-type">Month</li>
                                <li className="account-subscription-plan-price"><span className="account-subscription-plan-price-num">9.00</span><br /><span className="account-subscription-plan-price-denom-rate">USD/mo</span></li>
                                <li>&nbsp;</li>
                                <li>Full access to all levels of CBT exercises while subscription is active</li>
                                <li>Recurring charge every month<sup>1</sup></li>
                            </ul>
                            <div className="account-subscription-plan-select"><button type="button" className="btn">Select</button></div>
                        </div>
                    </Col>
                    <Col>
                        <div className="account-subscription-plan account-subscription-plan-annual" data-active={user.planId === ANNUAL_PLAN_ID} onClick={subscribeYearly}>
                            <ul>
                                <li className="account-subscription-plan-type">Annual</li>
                                <li className="account-subscription-plan-price"><span className="account-subscription-plan-price-num">89.00</span><br /><span className="account-subscription-plan-price-denom-rate">USD/yr</span></li>
                                <li><Badge variant="info">2 months free</Badge></li>
                                <li>Full access to all levels of CBT exercises while subscription is active</li>
                                <li>Recurring charge every year<sup>1</sup></li>
                            </ul>
                            <div className="account-subscription-plan-select"><button type="button" className="btn">Select</button></div>
                        </div>
                    </Col>
                    <Col>
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
                    </Col>
                </Row>
                <p className="disclaimer">Please keep in mind that Dawnguide is still very young! By subscribing at this early stage, you're helping to fund the expansion of content and features.</p>
            </Container>
        </main>
    </AppLayout>
}