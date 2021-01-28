import * as React from 'react'
import { useContext } from "react"
import { Navbar, Container, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AppContext } from "./AppContext"
import { Logo } from "../common/Logo"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Observer } from 'mobx-react-lite'

function UserDropdown() {
    const { app } = useContext(AppContext)
    return <li className="nav-item UserDropdown">
        <input id="userDropdownToggle" type="checkbox" />
        <label className="nav-link" htmlFor="userDropdownToggle">{app.user.username} <FontAwesomeIcon icon={faAngleDown} /></label>
        <ul>
            <li>
                <Link to="/settings">Settings</Link>
            </li>
            <li>
                <a href="/logout">Sign out</a>
            </li>
        </ul>
    </li>
}

export function AppHeader() {
    const { app } = useContext(AppContext)
    return <Observer>{() => <header className="AppHeader">
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to="/home">
                    <Logo /> Dawnguide <span className="environment">{window.location.origin.match(/localhost/) ? 'dev' : ''}</span>
                </Navbar.Brand>
                <div className="ml-auto d-flex align-items-center">
                    <Nav>
                        <ul className="navigation-shortcuts">
                            <li className="navigation-shortcut navigation-shortcut--lessons">
                                <Link to="/lesson" className={app.numLessons === 0 ? 'inactive' : undefined}>
                                    <span>{app.numLessons}</span> Lessons
                                </Link>
                            </li>
                            <li className="navigation-shortcut navigation-shortcut--reviews">
                                <Link to="/review" className={app.numReviews === 0 ? 'inactive' : undefined}>
                                    <span>{app.numReviews}</span> Reviews
                                </Link>
                            </li>
                        </ul>
                    </Nav>
                    <Nav className="other">
                        <UserDropdown />
                    </Nav>
                </div>
            </Container>
        </Navbar>
    </header>}</Observer>
}
