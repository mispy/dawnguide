import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"
import { AppLayout } from "./AppLayout"
import { Row, Col, Badge } from "react-bootstrap"

export const SubscriptionPage = () => {
    return <AppLayout>
        <main className="SubscriptionPage">
            <div>
                Subscription page!
            </div>
            <Row>
                <Col>
                    <div className="account-subscription-plan account-subscription-plan-month" data-plan="20170721-month" data-name="Month">
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
                    <div className="account-subscription-plan account-subscription-plan-annual" data-plan="20170721-year" data-name="Annual">
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
                    <div className="account-subscription-plan account-subscription-plan-lifetime" data-plan="default-lifetime" data-name="Lifetime">
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
        </main>
    </AppLayout>
}