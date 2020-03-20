import uuidv4 = require('uuid/v4')
import bcrypt = require('bcryptjs')
import moment = require('moment')
import { KVNamespace } from '@cloudflare/workers-types'
import { getTimeFromLevel } from './time'

import { UserProgressItem } from '../shared/types'
import { isReadyForReview } from '../shared/logic'
import _ = require('lodash')

declare const global: any
const CloudflareStore: KVNamespace = global.STORE

export async function get(key: string): Promise<string | null> {
    return await CloudflareStore.get(key, "text")
}

export async function getJson<T>(key: string): Promise<T | null> {
    return await CloudflareStore.get(key, "json")
}

export async function put(key: string, value: string) {
    return await CloudflareStore.put(key, value)
}

export async function putJson(key: string, value: Object) {
    await CloudflareStore.put(key, JSON.stringify(value))
}

export async function list(prefix: string) {
    return await CloudflareStore.list({ prefix: prefix })
}

async function deleteKey(key: string) {
    await CloudflareStore.delete(key)
}

export { deleteKey as delete }

const db = { get, getJson, put, putJson, list, delete: deleteKey }

export interface User {
    id: string
    username: string
    email: string
    cryptedPassword: string
    createdAt: number
    updatedAt: number
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

    export async function expectByEmail(email: string): Promise<User> {
        const user = await users.getByEmail(email)
        if (!user) {
            throw new Error(`Expected to find user with email ${email}`)
        }
        return user
    }

    export async function getByUsername(username: string): Promise<User | null> {
        const userId = await db.get(`user_id_by_username:${username}`)
        if (!userId)
            return null
        return users.get(userId)
    }

    export async function list(): Promise<User[]> {
        const { keys } = await db.list(`users:`)

        const userReqs = keys.map(key => db.getJson(key.name))

        return Promise.all(userReqs) as Promise<User[]>
    }

    export function encryptPassword(plaintext: string) {
        return bcrypt.hashSync(plaintext, 10)
    }

    export async function create(props: Pick<User, 'username' | 'email'> & { 'password': string }): Promise<User> {
        // TODO don't allow duplicate email/username
        const userId = uuidv4()

        // Must be done synchronously or CF will think worker never exits
        const crypted = users.encryptPassword(props.password)
        const now = Date.now()
        const user = {
            id: userId,
            username: props.username,
            email: props.email,
            cryptedPassword: crypted,
            createdAt: now,
            updatedAt: now
        }

        await db.putJson(`users:${userId}`, user)
        await db.put(`user_id_by_email:${props.email}`, userId)
        await db.put(`user_id_by_username:${props.username}`, userId)
        return user
    }

    export async function save(user: User) {
        await db.putJson(`users:${user.id}`, user)
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

export namespace progressItems {
    export async function allFor(userId: string): Promise<UserProgressItem[]> {
        const progress = await db.getJson<any>(`user_progress:${userId}`)
        return progress && progress.items ? _.values(progress.items) : []
    }

    export async function allByConceptId(userId: string): Promise<_.Dictionary<UserProgressItem>> {
        const progress = await db.getJson<any>(`user_progress:${userId}`)
        return progress && progress.items ? progress.items : {}
    }

    export async function get(userId: string, conceptId: string): Promise<UserProgressItem|undefined> {
        const items = await progressItems.allFor(userId)
        return items.find(i => i.conceptId === conceptId)
    }

    /** Get previously learned lessons that are ready for a user to review */
    export async function getActiveReviews(userId: string): Promise<UserProgressItem[]> {
        return (await progressItems.allFor(userId)).filter(isReadyForReview)
    }

    export async function save(progressItem: UserProgressItem) {
        const items = await progressItems.allByConceptId(progressItem.userId)
        items[progressItem.conceptId] = progressItem
        return await db.putJson(`user_progress:${progressItem.userId}`, { items: items })
    }

    export async function setAll(userId: string, progressItems: UserProgressItem[]) {
        return await db.putJson(`user_progress:${userId}`, { items: _.keyBy(progressItems, item => item.conceptId) })
    }
}

export namespace passwordResets {
    export async function create(email: string): Promise<string> {
        const token = uuidv4()
        await CloudflareStore.put(`password_resets:${token}`, email, { expirationTtl: 60*60*24 }) // Expires after a day
        return token
    }

    export async function get(token: string): Promise<string|undefined> {
        const email = await CloudflareStore.get(`password_resets:${token}`)
        return email||undefined
    }
}