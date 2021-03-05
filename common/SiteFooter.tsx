import * as React from 'react'
import { ULink } from './ULink'

export function SiteFooter() {
    return <footer className="SiteFooter">
        <div className="container">
            <ul>
                <li>
                    <a href="https://github.com/mispy/dawnguide">GitHub</a>
                </li>
                <li>
                    <a href="https://twitter.com/mispy11">Twitter</a>
                </li>
                <li>
                    <ULink href="/contact">Contact</ULink>
                </li>
            </ul>
        </div>
    </footer>
}
