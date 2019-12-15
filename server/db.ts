import uuidv4 = require('uuid/v4')
import bcrypt = require('bcryptjs')
import moment = require('moment')
import { KVNamespace } from '@cloudflare/workers-types'
import { getTimeFromLevel } from './time'

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
        const now = Date.now()
        const user = {
            id: userId,
            username: props.username,
            email: props.email,
            password: crypted,
            createdAt: now,
            updatedAt: now
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

export interface LessonProgressItem {
    /** Unique id of the lesson, which refers to a hardcoded string */
    lessonId: string
    /** SRS stage from 1 to 10 */
    level: number

    /** When this lesson was initially learned */
    learnedAt: number
    /** When last reviewed or learned */
    reviewedAt: number
}

export interface UserLessonProgress {
    lessons: { [lessonId: string]: LessonProgressItem | undefined }
}

export namespace lessonProgress {
    function isReadyForReview(lesson: LessonProgressItem) {
        return Date.now() > lesson.reviewedAt + getTimeFromLevel(lesson.level)
    }

    export async function get(userId: string): Promise<UserLessonProgress> {
        return await db.getJson<UserLessonProgress>(`user_progress:${userId}`) || { lessons: {} }
    }

    /** Get previously learned lessons that are ready for a user to review */
    export async function getReviewsFor(userId: string): Promise<LessonProgressItem[]> {
        const progress = await lessonProgress.get(userId)
        return (Object.values(progress.lessons) as LessonProgressItem[]).filter(isReadyForReview)
    }

    export async function set(userId: string, progress: UserLessonProgress) {
        return await db.putJson(`user_progress:${userId}`, progress)
    }
}