import bcrypt = require('bcryptjs')
import cookie = require('cookie')
import db = require('./db')
import { redirect } from './utils'

export interface SessionRequest extends Request {
    session: db.Session
}

export async function signup(req: Request) {
    const { username, email, password } = JSON.parse(await readRequestBody(req))
    const user = await db.users.create({ username, email, password })

    // Log the user in to their first session
    const sessionKey = await db.sessions.create(user.id)


    const res = redirect('/')
    res.headers.set('Set-Cookie', sessionCookie(sessionKey))
    return res
}

export async function login(req: Request) {
    const { usernameOrEmail, password } = JSON.parse(await readRequestBody(req))

    const sessionKey = await expectLogin(usernameOrEmail, password)

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

async function expectLogin(usernameOrEmail: string, password: string): Promise<string> {
    let user = await db.users.getByEmail(usernameOrEmail)
    if (!user) {
        user = await db.users.getByUsername(usernameOrEmail)
    }
    if (!user) {
        throw new Error("Invalid user or password")
    }

    const validPassword = bcrypt.compareSync(password, user.password)

    if (validPassword) {
        // Login successful

        const sessionKey = db.sessions.create(user.id)
        return sessionKey
    } else {
        throw new Error("Invalid user or password")
    }
}


async function readRequestBody(request: Request) {
    const { headers } = request
    const contentType = headers.get('content-type')
    if (!contentType) {
        throw new Error("No content type")
    }
    if (contentType.includes('application/json')) {
        const body = await request.json()
        return JSON.stringify(body)
    } else if (contentType.includes('application/text')) {
        const body = await request.text()
        return body
    } else if (contentType.includes('text/html')) {
        const body = await request.text()
        return body
    } else if (contentType.includes('form')) {
        const formData = await request.formData()
        let body: { [key: string]: string } = {}
        for (let entry of (formData as any).entries()) {
            body[entry[0]] = entry[1]
        }
        return JSON.stringify(body)
    } else {
        let myBlob = await request.blob()
        var objectURL = URL.createObjectURL(myBlob)
        return objectURL
    }
}