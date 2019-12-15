import uuidv4 = require('uuid/v4')
import bcrypt = require('bcryptjs')
import { KVNamespace } from '@cloudflare/workers-types'

declare const global: any
const CloudflareStore: KVNamespace = global.STORE

export async function get(key: string): Promise<string | null> {
    return await CloudflareStore.get(key)
}

export async function getJson<T>(key: string): Promise<T | null> {
    const item = await CloudflareStore.get(key)
    if (item === null) {
        return null
    } else {
        return JSON.parse(item)
    }
}

export async function put(key: string, value: string) {
    return await CloudflareStore.put(key, value)
}

export async function putJson(key: string, value: Object) {
    await CloudflareStore.put(key, JSON.stringify(value))
}

async function deleteKey(key: string) {
    await CloudflareStore.delete(key)
}

export { deleteKey as delete }

const db = { get, getJson, put, putJson, delete: deleteKey }

export interface User {
    id: string
    username: string
    email: string
    password: string
}

export namespace users {
    export async function get(userId: string): Promise<User | null> {
        return await db.getJson(`users:${userId}`)
    }

    export async function getByEmail(email: string): Promise<User | null> {
        const userId = await db.get(`user_id_by_email:${email}`)
        if (!userId)
            return null
        return users.get(userId)
    }

    export async function getByUsername(username: string): Promise<User | null> {
        const userId = await db.get(`user_id_by_username:${username}`)
        if (!userId)
            return null
        return users.get(userId)
    }

    export async function create(props: Pick<User, 'username' | 'email' | 'password'>): Promise<User> {
        // TODO don't allow duplicate email/username
        const userId = uuidv4()

        // Must be done synchronously or CF will think worker never exits
        const crypted = bcrypt.hashSync(props.password, 10)
        const user = {
            id: userId,
            username: props.username,
            email: props.email,
            password: crypted
        }

        await db.putJson(`users:${userId}`, user)
        await db.put(`user_id_by_email:${props.email}`, userId)
        await db.put(`user_id_by_username:${props.username}`, userId)
        return user
    }
}

export interface Session {
    key: string
    userId: string
}

export namespace sessions {
    export async function get(sessionKey: string): Promise<Session | null> {
        const sess = await db.getJson(`sessions:${sessionKey}`)
        if (sess === null) {
            return null
        } else {
            return Object.assign({}, { key: sessionKey }, sess) as Session
        }
    }

    export async function create(userId: string): Promise<string> {
        // TODO session expiry
        const sessionKey = uuidv4()
        await db.putJson(`sessions:${sessionKey}`, { userId: userId })
        return sessionKey
    }

    export async function expire(sessionKey: string) {
        return await db.delete(`sessions:${sessionKey}`)
    }
}
