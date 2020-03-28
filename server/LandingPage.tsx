import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'
import { Sunpedia, Concept } from "../shared/sunpedia"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

export function landingPage() {
    return pageResponse(<LandingPage />)
}

function ConceptsDropdown() {
    const sunpedia = new Sunpedia()

    return <li className="nav-item ConceptsDropdown">
        <button className="nav-link">Concepts <FontAwesomeIcon icon={faAngleDown} /></button>
        <ul>
            {sunpedia.concepts.map(concept => <li>
                <a href={`/concepts/${concept.id}`}>{concept.title}</a>
            </li>)}
        </ul>
    </li>
}

export function LandingPage() {

    return <html lang="en">
        <Head pageTitle="Sunpeep, an app for learning to be happy" canonicalUrl="/" />

        <body>
            <main className="LandingPage">
                <header>
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                            <a className="navbar-brand" href="#">Sunpeep</a>
                            <ul className="navbar-nav ml-auto">
                                <ConceptsDropdown />
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Sign In</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link btn btn-landing" href="/signup">Join Us</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <section className="tagline">
                    <div className="container d-flex align-items-center">
                        <main className="masthead">
                            <h1 className="mb-3">Mental health skills can be learned</h1>
                            <p>Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy.</p>
                            <a href="/signup" className="btn btn-lg btn-landing">Get started</a>
                        </main>
                    </div>
                </section>
            </main>
        </body>
    </html>
}
