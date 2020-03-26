import bcrypt = require('bcryptjs')
import cookie = require('cookie')
import db = require('./db')
import { redirect, expectRequestJson, expectStrings, QueryParams } from './utils'
import { sendMail } from './mail'
import { BASE_URL } from './settings'
import _ = require('lodash')

export interface SessionRequest extends Request {
    session: db.Session
    params: QueryParams
}

export async function signup(req: Request) {
    const body = await expectRequestJson(req)
    const { email, password } = expectStrings(body, 'email', 'password')

    const existingUser = await db.users.getByEmail(email)
    if (existingUser) {
        throw new Error(`User with email ${email} already exists`)
    }

    const user = await db.users.create({ email, password })

    // Log the user in to their first session
    const sessionKey = await db.sessions.create(user.id)

    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function login(req: Request) {
    const body = await expectRequestJson(req)
    const { email, password } = expectStrings(body, 'email', 'password')

    const sessionKey = await expectLogin(email, password)

    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function resetPasswordStart(req: Request) {
    const body = await expectRequestJson(req)
    const { email } = expectStrings(body, 'email')
    const user = await db.users.getByEmail(email)

    if (user) {
        const token = await db.passwordResets.create(user.email)
        await sendMail({
            to: user.email,
            from: "Sunpeep <sunpeep@example.com>",
            subject: "Reset your password",
            text: `Reset password here: ${BASE_URL}/reset-password/${token}`
        })
    }
}

export async function serveResetPasswordForm(req: Request) {
    const token = _.last(req.url.split('/')) as string
    const email = await db.passwordResets.get(token)

    const html = `
    <!doctype html>
    <html lang="en">
    
    <head>
        <title>Reset Password</title>
        <link rel="stylesheet" href="./assets/landing.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sunpeep!" />
        <meta charset="utf-8" />
    </head>
    
    <body>
        <main class="ResetPasswordFormPage">
            ${email ? '' : '<div class="alert alert-danger">Invalid or expired token</div>'}
            <form action="/reset-password/${token}" method="post">
                <div class="form-group">
                    <label>New password</label>
                    <input name="newPassword" class="form-control" placeholder="New password" required />
                </div>
                <input type="submit" class="btn btn-success" value="Reset password" />
            </form>
        </main>
    </body>
    
    </html>
    `.trim()

    return new Response(html)
}


export async function resetPasswordFinish(req: Request) {
    const body = await expectRequestJson(req)
    const { newPassword, token } = expectStrings(body, 'newPassword', 'token')

    const email = await db.passwordResets.get(token)
    if (!email) {
        throw new Error("Invalid or expired token")
    }

    const user = await db.users.expectByEmail(email)
    user.cryptedPassword = db.users.encryptPassword(newPassword)
    await db.users.save(user)

    // Password updated, now log the user in
    const sessionKey = await db.sessions.create(user.id)
    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function logout(req: Request) {
    const session = await getSession(req)
    if (session) {
        await db.sessions.expire(session.key)
    }
    return redirect('/')
}

export async function getSession(req: Request) {
    const cookies = cookie.parse(req.headers.get('cookie') || '')
    const sessionKey = cookies['sessionKey']
    return sessionKey ? await db.sessions.get(sessionKey) : null
}

function sessionCookie(sessionKey: string) {
    return cookie.serialize('sessionKey', sessionKey, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
}

async function expectLogin(email: string, password: string): Promise<string> {
    const user = await db.users.getByEmail(email)
    if (!user) {
        throw new Error("Invalid email or password")
    }

    // Must be done synchronously or CF will think worker never exits
    const validPassword = bcrypt.compareSync(password, user.cryptedPassword)

    if (validPassword) {
        // Login successful
        const sessionKey = await db.sessions.create(user.id)
        return sessionKey
    } else {
        throw new Error("Invalid email or password")
    }
}
