import bcrypt = require('bcryptjs')
import cookie = require('cookie')
import db = require('./db')
import { redirect, expectStrings, QueryParams, absurl, pageResponse, ResponseError } from './utils'
import { sendMail } from './mail'
import { BASE_URL } from './settings'
import _ = require('lodash')
import { resetPasswordPage } from './ResetPasswordPage'
import { weeks } from './time'
import { loginPage } from './LoginPage'
import { signupPage } from './SignupPage'
import { EventRequest } from './requests'

export async function signup(req: EventRequest) {
    try {
        const { username, email, password } = expectStrings(req.json, 'username', 'email', 'password')

        let existingUser = await db.users.getByEmail(email)
        if (existingUser) {
            throw new ResponseError(`User with email ${email} already exists`, 409)
        }

        existingUser = await db.users.getByUsername(username)
        if (existingUser) {
            throw new ResponseError(`User with username ${username} already exists`, 409)
        }


        const user = await db.users.create({ username, email, password })

        // Send confirmation email
        const token = await db.emailConfirmTokens.create(user.id, email)
        const confirmUrl = absurl(`/account/confirmation/${token}`)
        await sendMail({
            to: email,
            subject: "Dawnguide email change confirmation",
            text: `Welcome to Dawnguide! Please confirm your account by following this link: ${confirmUrl}`
        })

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
    } catch (err) {
        if ('status' in err) {
            return signupPage({ error: err.message, status: err.status })
        } else {
            throw err
        }
    }
}

export async function login(req: EventRequest) {
    try {
        const { email, password } = expectStrings(req.json, 'email', 'password')

        const sessionKey = await expectLogin(email, password)

        const res = redirect('/')
        res.headers.set('Set-Cookie', sessionCookie(sessionKey))
        return res
    } catch (err) {
        if ('status' in err) {
            return loginPage({ error: err.message, status: err.status })
        } else {
            throw err
        }
    }
}

export async function resetPasswordStart(req: EventRequest) {
    const { email } = expectStrings(req.json, 'email')
    const user = await db.users.getByEmail(email)

    if (user) {
        const token = await db.passwordResets.create(user.email)
        await sendMail({
            to: user.email,
            subject: "Reset your password",
            text: `Reset password here: ${BASE_URL}/reset-password/${token}`
        })
    }

    return resetPasswordPage(req, email)
}

export async function resetPasswordFinish(req: EventRequest, token: string) {
    const { newPassword } = expectStrings(req.json, 'newPassword')

    const email = await db.passwordResets.get(token)
    if (!email) {
        throw new ResponseError(`Invalid or expired token ${token}`, 403)
    }

    const user = await db.users.expectByEmail(email)
    user.cryptedPassword = db.users.hashPassword(newPassword)
    await db.users.save(user)

    // Expire the token now that it's used
    await db.passwordResets.destroy(token)

    // Password updated, now log the user in
    const sessionKey = await db.sessions.create(user.id)
    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function emailConfirmFinish(req: EventRequest, token: string) {
    const json = await db.emailConfirmTokens.get(token)
    if (!json) {
        throw new ResponseError(`Invalid or expired token ${token}`, 403)
    }

    const { userId, email } = json
    await db.users.changeEmail(userId, email)

    // Log the user in if they weren't already
    const res = redirect('/')
    const sessionKey = await db.sessions.create(userId)
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function logout(req: EventRequest) {
    if (req.session) {
        await db.sessions.expire(req.session.key)
    }
    return redirect('/')
}

export async function getSession(event: FetchEvent) {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '')
    const sessionKey = cookies['sessionKey']
    return sessionKey ? await db.sessions.get(sessionKey) : null
}

function sessionCookie(sessionKey: string) {
    return cookie.serialize('sessionKey', sessionKey, {
        httpOnly: true,
        maxAge: weeks(1)
    })
}

async function expectLogin(email: string, password: string): Promise<string> {
    const user = await db.users.getByEmail(email)
    if (!user) {
        throw new ResponseError(`Invalid email or password`, 401)
    }

    // Must be done synchronously or CF will think worker never exits
    const validPassword = bcrypt.compareSync(password, user.cryptedPassword)

    if (validPassword) {
        // Login successful
        const sessionKey = await db.sessions.create(user.id)
        return sessionKey
    } else {
        throw new ResponseError(`Invalid email or password`, 401)
    }
}
