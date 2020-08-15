import * as React from 'react'
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"
import { content } from '../shared/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
// @ts-ignore
import socialMediaLarge from '../public/social-media-large.jpg'

export function FrontPage() {
    const { lessons } = content

    const pageDesc = "Dawnguide collects key research findings that help maintain good mental health. Memorize them forever using our spaced learning system."

    return <html lang="en">
        <Head pageTitle="Dawnguide: Learn the science of human happiness" pageDesc={pageDesc} canonicalUrl="/" imageUrl={socialMediaLarge} />
        <body>
            <main className="FrontPage">
                <section className="intro">
                    <SiteHeader />
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col masthead">
                                    <h1 className="mb-3">Learn the science of human happiness</h1>
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
                <section className="desc">
                    <div className="container">
                        <hr />
                        <p>A project by <a href="https://twitter.com/jakeleoht">Jake Leoht</a></p>
                        <p>Hello! This site is still pretty new!</p>
                        <p>Dawnguide is a collection of research about people, condensed into summaries of what is most useful to know for maintaining good mental health. It's also a spaced learning system for memorizing those results long-term.</p>
                        <p>I'm working on this because I feel there really needs to be an easily accessible evidence-based resource for this stuff. However, I'm not a clinical psychologist, so please use your own judgment in determining whether what I've written is true for you 💛</p>
                        <p>Dawnguide is open access and <a href="https://github.com/leohtj/dawnguide.com">open source</a>. The articles will always be free, but the spaced learning part may later become subscription-based so that the project has an independent means of supporting itself. Thanks for reading!</p>
                        <hr />
                    </div>
                </section>
                <section className="lessons">
                    <div className="container">
                        <h3>Lessons</h3>
                        <div className="lessonsGrid">
                            {lessons.map(lesson => <a className="lesson" key={lesson.id} href={`/${lesson.id}`}>
                                <div>
                                    <div className="keyFinding">
                                        {lesson.keyFinding}
                                    </div>
                                    <h5>
                                        {lesson.title} <FontAwesomeIcon icon={faArrowRight} />
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
