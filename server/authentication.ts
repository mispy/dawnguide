import bcrypt = require('bcryptjs')
import cookie = require('cookie')
import db = require('./db')
import { redirect, expectRequestJson, expectStrings, QueryParams, EventRequest } from './utils'
import { sendMail } from './mail'
import { BASE_URL } from './settings'
import _ = require('lodash')
import { resetPasswordPage } from './ResetPasswordPage'

export interface SessionRequest extends EventRequest {
    session: db.Session
}

export async function signup(req: EventRequest) {
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

    req.event.waitUntil(sendMail({
        to: "misprime@gmail.com",
        subject: `New user ${email}`,
        text: `Yay, how exciting! :D`
    }))

    return res
}

export async function login(req: EventRequest) {
    const body = await expectRequestJson(req)
    const { email, password } = expectStrings(body, 'email', 'password')

    const sessionKey = await expectLogin(email, password)

    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function resetPasswordStart(req: EventRequest) {
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

    return resetPasswordPage(req, email)
}

export async function resetPasswordFinish(req: EventRequest, token: string) {
    const body = await expectRequestJson(req)
    const { newPassword } = expectStrings(body, 'newPassword')

    const email = await db.passwordResets.get(token)
    if (!email) {
        throw new Error("Invalid or expired token")
    }

    const user = await db.users.expectByEmail(email)
    user.cryptedPassword = db.users.encryptPassword(newPassword)
    await db.users.save(user)

    // Expire the token now that it's used
    await db.passwordResets.destroy(token)

    // Password updated, now log the user in
    const sessionKey = await db.sessions.create(user.id)
    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function logout(req: EventRequest) {
    const session = await getSession(req)
    if (session) {
        await db.sessions.expire(session.key)
    }
    return redirect('/')
}

export async function getSession(req: EventRequest) {
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
