import React = require("react")
import { Navbar, Container, Nav } from "react-bootstrap"
import { Sunpedia, Concept } from "../shared/sunpedia"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

/** Dropdown part is implemented in pure css in site.sass */
function ConceptsDropdown() {
    const sunpedia = new Sunpedia()

    return <li className="nav-item ConceptsDropdown">
        <input id="conceptsDropdownToggle" type="checkbox" />
        <label className="nav-link" htmlFor="conceptsDropdownToggle">Concepts <FontAwesomeIcon icon={faAngleDown} /></label>
        <ul>
            {sunpedia.concepts.map(concept => <li key={concept.id}>
                <a href={`/concept/${concept.id}`}>{concept.title}</a>
            </li>)}
        </ul>
    </li>
}

export function SiteHeader() {
    return <header className="SiteHeader">
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <a className="navbar-brand" href="/">Dawnguide</a>
                <ul className="navbar-nav ml-auto">
                    <ConceptsDropdown />
                    <li className="nav-item">
                        <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item signup">
                        <a className="nav-link btn btn-landing" href="/signup">Sign up</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
}
