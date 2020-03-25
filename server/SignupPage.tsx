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
                        <input name="email" type="email" className="form-control" placeholder="Email" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn btn-sun-outline">✨ Sign up</button>
                </form>
            </main>
        </body>

    </html>
}
