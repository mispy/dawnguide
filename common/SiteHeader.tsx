import * as React from 'react'
import { Navbar, Container, Nav } from "react-bootstrap"
import { Logo } from "../common/Logo"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Observer } from 'mobx-react-lite'
import { useProgressiveEnhancement, expectAuthed } from './ProgressiveEnhancement'
import { content } from './content'
import { ULink } from './ULink'

/** Dropdown part is implemented in pure css in shared.sass */
function LessonsDropdown() {
    return <li className="nav-item LessonsDropdown">
        <input id="lessonsDropdownToggle" type="checkbox" />
        <label className="nav-link" htmlFor="lessonsDropdownToggle">Lessons <FontAwesomeIcon icon={faAngleDown} /></label>
        <ul>
            {content.lessons.map(lesson => <li key={lesson.id}>
                <a href={`/${lesson.slug}`}>{lesson.title}</a>
            </li>)}
        </ul>
    </li>
}

function UserDropdown() {
    const { user } = expectAuthed()
    return <li className="nav-item UserDropdown">
        <input id="userDropdownToggle" type="checkbox" />
        <label className="nav-link" htmlFor="userDropdownToggle">{user.username} <FontAwesomeIcon icon={faAngleDown} /></label>
        <ul>
            <li>
                <ULink href="/settings">Settings</ULink>
            </li>
            <li>
                <a href="/logout">Sign out</a>
            </li>
        </ul>
    </li>
}

export function SiteHeader() {
    const { authed, js, srs } = useProgressiveEnhancement()

    return <Observer>{() => <header className="SiteHeader">
        <Navbar>
            <Container>
                <Navbar.Brand as={ULink} href="/">
                    <Logo /> Dawnguide {js && <span className="environment">{js.window.location.origin.match(/localhost/) ? 'dev' : ''}</span>}
                </Navbar.Brand>
                <div className="ml-auto d-flex align-items-center">
                    {srs && <Nav>
                        <ul className="navigation-shortcuts">
                            <li className="navigation-shortcut navigation-shortcut--reviews">
                                <ULink href="/review" className={srs.availableReviews.length === 0 ? 'inactive' : undefined}>
                                    <span>{srs.availableReviews.length}</span> Reviews
                                </ULink>
                            </li>
                        </ul>
                    </Nav>}
                    {!authed && <ul className="navbar-nav ml-auto">
                        <LessonsDropdown />
                        <li className="nav-item">
                            <a className="nav-link" href="/login">Sign in</a>
                        </li>
                        <li className="nav-item signup">
                            <a className="nav-link btn btn-landing" href="/signup">Sign up</a>
                        </li>
                    </ul>}
                    {authed && <Nav className="other">
                        <UserDropdown />
                    </Nav>}
                </div>
            </Container>
        </Navbar>
    </header>}</Observer>
}
