import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'
import { SessionRequest } from "./authentication"
import * as db from './db'
import { User } from "../shared/types"

export async function appPage(req: SessionRequest) {
    const user = await db.users.expect(req.session.userId)
    return pageResponse(<AppPage user={user} />)
}

export function AppPage(props: { user: User }) {
    const script = `window.initApp(${JSON.stringify(props.user)})`
    return <html lang="en">
        <Head canonicalUrl={null} cssUrl="/app.css" />
        <body>
            <noscript>
                You need to enable JavaScript to run this app.
            </noscript>
            <div id="root"></div>
            <script src="/app.js"></script>
            <script dangerouslySetInnerHTML={{ __html: script }}>
            </script>
        </body>
    </html >
}