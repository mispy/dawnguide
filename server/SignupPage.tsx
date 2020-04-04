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
                    <h4 className="mb-4">Create your account</h4>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input name="username" id="username" type="text" className="form-control" placeholder="Username" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" type="email" className="form-control" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" type="password" className="form-control" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn btn-dawn-outline">✨ Sign up</button>
                </form>
            </main>
        </body>

    </html>
}
