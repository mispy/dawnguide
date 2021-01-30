import { AppLayout } from "./AppLayout"
import * as React from 'react'
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import classNames = require("classnames")
import { AppFooter } from "./AppFooter"
import { useEffect, useContext, useRef } from "react"
import { expectAuthed } from "../common/ProgressiveEnhancement"

export function SettingsLayout(props: { active?: 'account' | 'notifications' | 'subscription', children?: any }) {
    const { authed } = expectAuthed()
    useEffect(() => {
        // Refresh user on settings layout change
        authed.reloadUser()
    }, [props.active])

    return <AppLayout title="Settings" noFooter>
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
                    {/* <li className="nav-item">
                        <Link to="/subscription" className={classNames('nav-link', props.active === 'subscription' && 'active')}>Subscription</Link>
                    </li> */}
                </ul>

                {props.children}
            </Container>
            <AppFooter />
        </main>
    </AppLayout>
}