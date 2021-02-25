import { AppLayout } from "./AppLayout"
import * as React from 'react'
import { Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import classNames = require("classnames")
import { AppFooter } from "./AppFooter"

export function AdminLayout(props: { active?: 'users' | 'emails', children?: any }) {
    return <AppLayout title="Admin" noFooter>
        <main className="AdminLayout">
            <Container>
                <h1>Admin</h1>
                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <Link to="/admin" className={classNames('nav-link', props.active === 'users' && 'active')}>Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/emails" className={classNames('nav-link', props.active === 'emails' && 'active')}>Emails</Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link to="/subscription" className={classNames('nav-link', props.active === 'subscription' && 'active')}>Subscription</Link>
                    </li> */}
                </ul>
            </Container>
            {props.children}
            <AppFooter />
        </main>
    </AppLayout>
}