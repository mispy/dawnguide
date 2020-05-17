import * as React from 'react'
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"
import { Sunpedia } from '../shared/sunpedia'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export function FrontPage() {
    const sunpedia = new Sunpedia()
    const { concepts } = sunpedia

    return <html lang="en">
        <Head pageTitle="Dawnguide, an application for learning to be happy" canonicalUrl="/" />
        <body>
            <main className="FrontPage">
                <SiteHeader />
                <section className="tagline">
                    <div className="container d-flex align-items-center">
                        <main className="masthead">
                            <h1 className="mb-3">Learn the science of human happiness</h1>
                        </main>
                    </div>
                </section>
                <section className="intro">
                    <div className="container">
                        <hr />
                        <p>A project by <a href="https://twitter.com/jakeleoht">Jake Leoht</a></p>
                        <p>Hello! This site is still pretty new!</p>
                        <p>Dawnguide is a collection of research about people, condensed into summaries of what is most useful to know for maintaining good mental health. It's also a spaced learning system for memorizing those results long-term.</p>
                        <p>I'm working on this because I feel there really needs to be an easily accessible evidence-based resource for this stuff. However, I'm not a clinical psychologist, so please use your own judgment in determining whether what I've written is true for you 💛</p>
                        <p>Dawnguide is open access and <a href="https://github.com/leohtj/dawnguide.com">open source</a>. The content will always be free, but the spaced learning part may later become subscription-based so that the project has an independent means of supporting itself. Thanks for reading!</p>
                        <hr />
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
