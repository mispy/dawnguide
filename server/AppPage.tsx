import * as React from 'react'
import { Head } from "./Head"
import { User } from "../shared/types"
import * as _ from 'lodash'
import { resolveAsset } from './utils'

export function AppPage(props: { user: User }) {
    const script = `window.initApp(${JSON.stringify(props.user)})`
    return <html lang="en">
        <Head canonicalUrl={null} cssUrl={resolveAsset("app.css")} />
        <body>
            <noscript>
                You need to enable JavaScript to run this app.
            </noscript>
            <div id="root"></div>
            <script src={resolveAsset("app.js")}></script>
            <script dangerouslySetInnerHTML={{ __html: script }}>
            </script>
        </body>
    </html >
}