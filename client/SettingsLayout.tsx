import { AppLayout } from "./AppLayout"
import React = require("react")
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import classNames = require("classnames")


export function SettingsLayout(props: { active?: 'account' | 'notifications' | 'subscription', children?: any }) {
    return <AppLayout>
        <main className="SettingsLayout">
            <Container>
                <h1>Settings</h1>
                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <Link to="/account" className={classNames('nav-link', props.active === 'account' && 'active')}>Account</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/notifications" className={classNames('nav-link', props.active === 'notifications' && 'active')}>Notifications</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/subscription" className={classNames('nav-link', props.active === 'subscription' && 'active')}>Subscription</Link>
                    </li>
                </ul>

                {props.children}
            </Container>
        </main>
    </AppLayout>
}