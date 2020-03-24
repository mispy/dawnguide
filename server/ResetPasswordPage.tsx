import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'

export function resetPasswordPage() {
    return pageResponse(<ResetPasswordPage />)
}

export function ResetPasswordPage() {
    return <html lang="en">
        <Head pageTitle="Reset Password" canonicalUrl="/reset-password" />

        <body>
            <main className="ResetPasswordPage">
                <form action="/reset-password" method="post">
                    <div className="form-group">
                        <label>Email address</label>
                        <input name="email" className="form-control" placeholder="Email address" required />
                    </div>
                    <input type="submit" className="btn btn-success" value="Reset password" />
                    <hr />
                    <div><a href="/login">Sign in</a></div>
                    <div><a href="/signup">Sign up</a></div>
                </form>
            </main>
        </body>

    </html>
}
