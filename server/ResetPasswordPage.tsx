import React = require("react")
import { Head } from "./Head"
import { pageResponse, EventRequest } from './utils'

export function resetPasswordPage(req: EventRequest, emailSent?: string) {
    return pageResponse(<ResetPasswordPage emailSent={emailSent} />)
}

export function ResetPasswordPage(props: { emailSent?: string }) {
    return <html lang="en">
        <Head pageTitle="Reset Password" canonicalUrl="/reset-password" />

        <body>
            <main className="ResetPasswordPage">
                <form action="/reset-password" method="post">
                    {props.emailSent && <div className="alert alert-success">
                        Check your email at {props.emailSent} for a password reset link.
                    </div>}
                    <div className="form-group">
                        <label>Email address</label>
                        <input name="email" className="form-control" placeholder="Email address" required />
                    </div>
                    <button type="submit" className="btn btn-sun">Reset password</button>
                    <hr />
                    <div><a href="/login">Login</a></div>
                    <div><a href="/signup">Sign up</a></div>
                </form>
            </main>
        </body>

    </html>
}
