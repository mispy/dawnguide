import _ = require("lodash")
import React = require("react")
import { AppLayout } from "./AppLayout"
import { Container } from "react-bootstrap"

export function ContactPage() {
    return <AppLayout>
        <main className="ContactPage mt-4">
            <Container>
                <h1>Contact</h1>
                <p>Use the form below to send any questions, comments, bug reports, or happy thoughts.</p>
                <p>If you are contacting about a bug, please mention as much information as you can so we can better assist you. Examples of helpful information are the following: steps on how to reproduce the issue, a link to the problematic page, or a link to a screenshot.</p>
                <p>Alternatively, you can contact us at <a href="mailto:hello@dawnguide.com">hello@dawnguide.com</a> or our Twitter <a target="_blank" href="https://twitter.com/DawnguideApp">@DawnguideApp</a>.</p>
            </Container>
        </main>
    </AppLayout>
}