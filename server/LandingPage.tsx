import * as React from 'react'
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"

export function LandingPage() {
    return <html lang="en">
        <Head pageTitle="Dawnguide, an application for learning to be happy" canonicalUrl="/" />
        <body>
            <main className="LandingPage">
                <SiteHeader />
                <section className="tagline">
                    <div className="container d-flex align-items-center">
                        <main className="masthead">
                            <h1 className="mb-3">Mental health skills can be learned</h1>
                            <p>Flashcard practice of mindfulness, self-compassion and cognitive-behavioral therapy.</p>
                            <a href="/signup" className="btn btn-lg btn-dawn">Get started</a>
                        </main>
                    </div>
                </section>
            </main>
        </body>
    </html >
}
