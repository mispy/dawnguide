import * as React from 'react'
import { content } from "../common/content"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Logo } from "../common/Logo"

/** Dropdown part is implemented in pure css in site.sass */
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

export function SiteHeader() {
    return <header className="SiteHeader">
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <Logo /> Dawnguide
                </a>
                <ul className="navbar-nav ml-auto">
                    <LessonsDropdown />
                    <li className="nav-item">
                        <a className="nav-link" href="/login">Sign in</a>
                    </li>
                    <li className="nav-item signup">
                        <a className="nav-link btn btn-landing" href="/signup">Sign up</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
}
