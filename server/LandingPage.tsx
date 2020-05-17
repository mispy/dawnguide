import * as React from 'react'
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"
import { Sunpedia } from '../shared/sunpedia'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export function LandingPage() {
    const sunpedia = new Sunpedia()
    const { concepts } = sunpedia

    return <html lang="en">
        <Head pageTitle="Dawnguide, an application for learning to be happy" canonicalUrl="/" />
        <body>
            <main className="LandingPage">
                <SiteHeader />
                <section className="tagline">
                    <div className="container d-flex align-items-center">
                        <main className="masthead">
                            <h1 className="mb-3">Learn the science of human happiness</h1>
                            <p>Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy.</p>
                            <a href="/signup" className="btn btn-lg btn-dawn">Get started</a>
                        </main>
                    </div>
                </section>
                <section className="concepts">
                    <div className="container">
                        <h3>Key Findings</h3>
                        <div className="conceptsGrid">
                            {concepts.map(concept => <a className="concept" href={`/${concept.id}`}>
                                <div>
                                    <div className="keyFinding">
                                        {concept.keyFinding}
                                    </div>
                                    <h5>
                                        {concept.title} <FontAwesomeIcon icon={faArrowRight} />
                                    </h5>
                                </div>
                            </a>)}
                        </div>
                    </div>
                </section>
            </main>
        </body>
    </html >
}
