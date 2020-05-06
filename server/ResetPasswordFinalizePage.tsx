import React = require("react")
import { Head } from "./Head"

export function ResetPasswordFinalizePage(props: { token: string, email: string | undefined }) {
    const { token, email } = props

    return <html lang="en">
        <Head pageTitle="Choose New Password" canonicalUrl={null} />

        <body>
            <main className="ResetPasswordFinalizePage">
                <form action={`/reset-password/${token}`} method="post">
                    {!email && <div className="alert alert-danger">Invalid or expired token</div>}
                    <h4 className="mb-4">Reset password for {email}</h4>
                    <div className="form-group">
                        <label htmlFor="newPassword">New password</label>
                        <input name="newPassword" id="newPassword" type="password" className="form-control" placeholder="New password" required autoFocus />
                    </div>
                    <input type="submit" className="btn btn-success" value="Reset password" />
                </form>
            </main>
        </body>
    </html>
}
