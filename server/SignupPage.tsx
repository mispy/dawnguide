import * as React from 'react'
import { Head } from "./Head"
import { pageResponse } from './utils'

export function SignupPage(props: { then?: string, error?: string }) {
    return <html lang="en">
        <Head pageTitle="Signup" canonicalUrl="/signup" />

        <body>
            <main className="SignupPage">
                <form action="/signup" method="post">
                    {props.error && <div className="alert alert-danger">
                        {props.error}
                    </div>}
                    <h4 className="mb-4">Create your account</h4>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" type="email" className="form-control" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" type="password" className="form-control" placeholder="Password" required />
                    </div>
                    <input type="hidden" name="then" value={props.then} />
                    <button type="submit" className="btn btn-dawn">✨ Sign up</button>
                    <hr />
                    <div><a className="text-link" href={props.then ? `/login?then=${props.then}` : `/login`}>Sign in</a></div>
                </form>
            </main>
        </body>

    </html>
}
