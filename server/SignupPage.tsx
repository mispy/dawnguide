import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'

export function signupPage() {
    return pageResponse(<SignupPage />)
}

export function SignupPage() {
    return <html lang="en">
        <Head pageTitle="Signup" canonicalUrl="/signup" />

        <body>
            <main className="SignupPage">
                <form action="/signup" method="post">
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" className="form-control" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" placeholder="Password" required />
                    </div>
                    <input type="submit" className="btn btn-success" value="Sign up" />
                </form>
            </main>
        </body>

    </html>
}
