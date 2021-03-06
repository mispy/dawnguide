import * as bcrypt from "bcryptjs"
import * as cookie from "cookie"
import * as db from './db'
import { redirect, trimStrings, QueryParams, pageResponse, ResponseError } from './utils'
import { sendMail } from './mail'
import * as _ from 'lodash'
import { ResetPasswordPage } from './ResetPasswordPage'
import * as time from '../common/time'
import { LoginPage } from './LoginPage'
import { SignupPage } from './SignupPage'
import type { EventRequest } from './requests'
import { ResetPasswordFinalizePage } from './ResetPasswordFinalizePage'
import { absurl } from '../common/utils'
import { BASE_URL } from '../common/settings'
import * as z from 'zod'
import { IS_PRODUCTION } from "./settings"

export async function signupPage(req: EventRequest) {
    const { then } = req.params as { then: string | undefined }
    return pageResponse(SignupPage, { then: then })
}

const signupForm = z.object({
    email: z.string().email(),
    password: z.string().min(10),
    then: z.string().optional()
})

export async function submitSignup(req: EventRequest) {
    try {
        const { email, password } = trimStrings(signupForm.parse(req.json))

        const existingUser = await db.users.getByEmail(email)
        if (existingUser) {
            const sessionKey = await tryLogin(email, password)
            if (sessionKey) {
                // Signup with credentials matching existing account just logs in 
                const res = redirect(req.json.then ? decodeURIComponent(req.json.then) : "/home")
                res.headers.set('Set-Cookie', sessionCookie(sessionKey))
                return res
            } else {
                throw new ResponseError(`User with email ${email} already exists`, 409)
            }
        }

        // Default name is inferred from email
        const name = email.split('@')[0]!
        const user = await db.users.create({ username: name, email: email, password: password })

        // Send confirmation email
        const token = await db.emailConfirmTokens.create(user.id, email)
        const confirmUrl = absurl(`/account/confirmation/${token}`)
        await Promise.all([
            sendMail({
                to: email,
                subject: "Confirm your email address",
                html: `Welcome to Dawnguide! Please <a href="${confirmUrl}">click here to confirm your account</a>.`
            }),
            sendMail({
                to: "misprime@gmail.com",
                subject: `New user ${email}`,
                text: `Yay, how exciting! :D`
            })
        ])

        // Log the user in to their first session
        const sessionKey = await db.sessions.create(user.id)

        const res = redirect(req.json.then ? decodeURIComponent(req.json.then) : "/home")
        res.headers.set('Set-Cookie', sessionCookie(sessionKey))

        return res
    } catch (err) {
        return pageResponse(SignupPage, { then: req.json.then, error: err.message }, { status: err.status || 500 })
    }
}

export async function loginPage(req: EventRequest) {
    const { then } = req.params as { then: string | undefined }
    return pageResponse(LoginPage, { then: then })
}

const loginForm = z.object({
    email: z.string().email(),
    password: z.string(),
    then: z.string().optional()
})

export async function submitLogin(req: EventRequest) {
    try {
        const { email, password } = loginForm.parse(req.json)

        const sessionKey = await expectLogin(email, password)

        const res = redirect(req.json.then ? decodeURIComponent(req.json.then) : "/home")
        res.headers.set('Set-Cookie', sessionCookie(sessionKey))
        return res
    } catch (err) {
        return pageResponse(LoginPage, { then: req.json.then, error: err.message, status: err.status || 500 })
    }
}

export async function resetPasswordPage(req: EventRequest) {
    return pageResponse(ResetPasswordPage)
}

export async function submitResetPassword(req: EventRequest) {
    const { email } = z.object({ email: z.string().email() }).parse(req.json)
    const user = await db.users.getByEmail(email)

    if (user) {
        const token = await db.passwordResets.create(user.email)
        await sendMail({
            to: user.email,
            subject: "Reset your password",
            text: `Reset password here: ${BASE_URL}/reset-password/${token}`
        })
    }

    return pageResponse(ResetPasswordPage, { emailSent: email })
}

export async function resetPasswordConfirmPage(req: EventRequest, token: string) {
    const email = await db.passwordResets.get(token)
    return pageResponse(ResetPasswordFinalizePage, { token: token, email: email })
}

export async function submitResetPasswordConfirm(req: EventRequest, token: string) {
    const { newPassword } = z.object({ newPassword: z.string() }).parse(req.json)

    const email = await db.passwordResets.get(token)
    if (!email) {
        throw new ResponseError(`Invalid or expired token ${token}`, 403)
    }

    const user = await db.users.expectByEmail(email)
    await db.userSecrets.set(user.id, { hashedPassword: db.users.hashPassword(newPassword) })

    // Expire the token now that it's used
    await db.passwordResets.destroy(token)

    // Password updated, now log the user in
    const sessionKey = await db.sessions.create(user.id)
    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function emailConfirmSuccess(req: EventRequest, token: string) {
    const json = await db.emailConfirmTokens.get(token)
    if (!json) {
        throw new ResponseError(`Invalid or expired token ${token}`, 403)
    }

    const { userId, email } = json
    await db.users.changeEmail(userId, email)

    // Log the user in if they weren't already
    const res = redirect('/home')
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

export async function tryTokenLogin(token: string): Promise<string | false> {
    const json = await db.emailConfirmTokens.get(token)
    if (!json) {
        return false
    }

    const { userId, email } = json
    const sessionKey = await db.sessions.create(userId)
    return sessionKey
}

export function sessionCookie(sessionKey: string) {
    return cookie.serialize('sessionKey', sessionKey, {
        httpOnly: true,
        maxAge: time.weeks(1)
    })
}

async function tryLogin(email: string, password: string): Promise<string | false> {
    const user = await db.users.getByEmail(email)
    if (!user) {
        return false
    }

    const { hashedPassword } = await db.userSecrets.expect(user.id)
    // Must be done synchronously or CF will think worker never exits
    const validPassword = (!IS_PRODUCTION && password === 'dev') || bcrypt.compareSync(password, hashedPassword)

    if (validPassword) {
        // Login successful
        const sessionKey = await db.sessions.create(user.id)
        return sessionKey
    } else {
        return false
    }

}

async function expectLogin(email: string, password: string): Promise<string> {
    const user = await db.users.getByEmail(email)
    if (!user) {
        throw new ResponseError(`Invalid email or password`, 401)
    }

    const { hashedPassword } = await db.userSecrets.expect(user.id)
    // Must be done synchronously or CF will think worker never exits
    const validPassword = (!IS_PRODUCTION && password === 'dev') || bcrypt.compareSync(password, hashedPassword)

    if (validPassword) {
        // Login successful
        const sessionKey = await db.sessions.create(user.id)
        return sessionKey
    } else {
        throw new ResponseError(`Invalid email or password`, 401)
    }
}
