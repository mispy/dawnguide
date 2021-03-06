import * as React from 'react'
import { Head } from "./Head"
import { SiteHeader } from "../common/SiteHeader"
import { ContentOverview } from '../common/ContentOverview'
// @ts-ignore
import socialMediaLarge from '../public/social-media-large.jpg'
import { SiteFooter } from '../common/SiteFooter'

export function FrontPage() {
    const pageDesc = "A mnemonic publication about human minds. Dawnguide aims to help people internalize good mental health habits and self-knowledge using the cognitive spacing effect."

    return <html lang="en">
        <Head pageTitle="Dawnguide" pageDesc={pageDesc} canonicalUrl="/" imageUrl={socialMediaLarge} />
        <body>
            <SiteHeader />
            <main className="FrontPage">
                <section className="intro">
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col masthead">
                                    <div>
                                        <h1>Dawnguide</h1>
                                        <p>A <em>mnemonic publication</em> about human minds. Dawnguide aims to help people internalize good mental health habits and self-knowledge using the cognitive spacing effect.</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <form action="/signup" method="post">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input name="email" id="email" type="email" className="form-control" placeholder="Email" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input name="password" id="password" type="password" className="form-control" placeholder="Password" minLength={10} required />
                                        </div>
                                        <button type="submit" className="btn btn-dawn">✨ Sign up for Dawnguide</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="lessons">
                    <ContentOverview />
                </section>
                <SiteFooter />
            </main>
        </body>
    </html >
}
