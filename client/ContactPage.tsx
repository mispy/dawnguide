import * as _ from 'lodash'
import * as React from 'react'
import { AppLayout } from "./AppLayout"
import { Container } from "react-bootstrap"
import { useLocalStore, useObserver } from "mobx-react-lite"
import { action } from "mobx"
import { AppContext } from "./AppContext"
import { useContext } from "react"

export function ContactPage() {
    const { api } = useContext(AppContext)
    const state = useLocalStore(() => ({ subject: "", body: "", loading: false }))

    async function sendMessage(ev: React.FormEvent) {
        ev.preventDefault()

        state.loading = true
        try {
            await api.contact({
                subject: state.subject,
                body: state.body
            })
        } finally {
            state.loading = false
        }
    }

    return useObserver(() => <AppLayout>
        <main className="ContactPage mt-4">
            <Container style={{ maxWidth: 800 }}>
                <h1>Contact</h1>
                <p>Use the form below to send any questions, comments, bug reports, or happy thoughts.</p>
                <p>If you are contacting about a bug, please mention as much information as you can so we can better assist you. Examples of helpful information are the following: steps on how to reproduce the issue, a link to the problematic page, or a link to a screenshot.</p>
                <p>Alternatively, you can contact Jake at <a href="mailto:jake@dawnguide.com">jake@dawnguide.com</a> or via Twitter <a target="_blank" href="https://twitter.com/dawnguideapp">@DawnguideApp</a>.</p>
                <form onSubmit={sendMessage}>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input name="subject" id="subject" type="text" className="form-control" placeholder="Subject" required value={state.subject} onChange={action(e => state.subject = e.currentTarget.value)} autoFocus />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body">Message</label>
                        <textarea name="body" id="body" className="form-control" placeholder="What would you like to share with Dawnguide?" required onChange={action(e => state.body = e.currentTarget.value)} />
                    </div>
                    <hr />
                    <button type="submit" className="btn btn-outline-secondary" disabled={state.loading}>
                        {state.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : undefined} Send
                    </button>
                </form>
            </Container>
        </main>
    </AppLayout>)
}