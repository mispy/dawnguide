import React = require("react")
import { Head } from "./Head"
import { pageResponse } from './utils'

export function loginPage(props: { error?: string, status?: number } = {}) {
    return pageResponse(<LoginPage {...props} />, { status: props.status || 200 })
}

export function LoginPage(props: { error?: string }) {
    return <html lang="en">
        <Head pageTitle="Login" canonicalUrl="/login" />

        <body>
            <main className="LoginPage">
                <form action="/login" method="post">
                    {props.error && <div className="alert alert-danger">
                        {props.error}
                    </div>}
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" className="form-control" placeholder="Email" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" placeholder="Password" required />
                    </div>
                    <input type="submit" className="btn btn-outline-dawn" value="Sign in" />
                    <hr />
                    <div><a href="/signup">Sign up</a></div>
                    <div><a href="/reset-password">Forgot password?</a></div>
                </form>
            </main>
        </body>

    </html>
}
