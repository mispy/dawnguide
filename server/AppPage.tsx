import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'

export function appPage() {
    return pageResponse(<AppPage />)
}

export function AppPage() {
    return <html lang="en">
        <Head canonicalUrl={null} cssUrl="/app.css" />
        <body>
            <noscript>
                You need to enable JavaScript to run this app.
            </noscript>
            <div id="root"></div>
            <script src="/app.js"></script>
        </body>
    </html >
}
