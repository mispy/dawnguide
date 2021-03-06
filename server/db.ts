import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcryptjs'
import * as time from '../common/time'

import type { UserProgressItem, UserNotificationSettings, UserLesson, UserProgress, UserInfo } from '../common/types'
import _ from 'lodash'
import { ResponseError } from './utils'
import { SRSProgress, SRSProgressStore } from '../common/SRSProgress'
import { LearnyPlan } from '../common/Learny'

declare const global: any
export const cfstore: KVNamespace = global.STORE

export async function get(key: string): Promise<string | null> {
    return await cfstore.get(key, "text")
}

export async function getJson<T>(key: string): Promise<T | null> {
    return await cfstore.get(key, "json")
}

export async function put(key: string, value: string, options?: { expirationTtl?: number }) {
    if (options?.expirationTtl) {
        options = { expirationTtl: Math.floor(options.expirationTtl / 1000) }
    }
    return await cfstore.put(key, value, options)
}

export async function putJson(key: string, value: Record<string, any>, options?: { expirationTtl?: number }) {
    if (options?.expirationTtl) {
        options = { expirationTtl: Math.floor(options.expirationTtl / 1000) }
    }
    await cfstore.put(key, JSON.stringify(value), options)
}

export async function findKeys(prefix: string) {
    const result = await cfstore.list({ prefix: prefix })
    return result.keys.map(k => k.name)
}

async function deleteKey(key: string) {
    try {
        await cfstore.delete(key)
    } catch (err) {
        // We don't really care that much about errors in deletion
        console.error(err)
    }
}

export { deleteKey as delete }

const db = { get, getJson, put, putJson, findKeys, delete: deleteKey }

export type User = UserInfo

export namespace users {
    export async function get(userId: string): Promise<User | null> {
        return await db.getJson(`users:${userId}`)
    }

    export async function expect(userId: string): Promise<User> {
        const user = await users.get(userId)
        if (!user) {
            throw new Error(`Expected to find user with id ${userId}`)
        }
        return user
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

    export async function allIds(): Promise<string[]> {
        const keys = await db.findKeys(`users:`)
        return keys.map(k => k.split('users:')[1]!)
    }

    export async function all(): Promise<User[]> {
        const keys = await db.findKeys(`users:`)
        const userReqs = keys.map(key => db.getJson(key))

        return Promise.all(userReqs) as Promise<User[]>
    }

    export function hashPassword(plaintext: string) {
        // Password hash be done synchronously or CF will think worker never exits
        return bcrypt.hashSync(plaintext, 10)
    }

    export async function create(props: Pick<User, 'username' | 'email'> & { 'password': string }): Promise<User> {
        const userId = uuidv4()

        // Double check this email isn't already taken
        const existingUserId = await db.get(`user_id_by_email:${props.email}`)
        if (existingUserId) {
            throw new Error(`Email ${props.email} is already associated with user id ${existingUserId}`)
        }

        const hashed = users.hashPassword(props.password)
        const now = Date.now()
        const user = {
            id: userId,
            email: props.email,
            username: props.username,
            createdAt: now,
            updatedAt: now,
            lastSeenAt: now
        }

        await users.save(user)
        await userSecrets.set(userId, { hashedPassword: hashed })
        await db.put(`user_id_by_email:${props.email}`, userId)
        return user
    }

    export async function update(userId: string, changes: Partial<User>): Promise<User> {
        const user = await users.expect(userId)
        Object.assign(user, { updatedAt: Date.now() }, changes)
        await db.putJson(`users:${userId}`, user)
        return user
    }

    export async function save(user: User) {
        await db.putJson(`users:${user.id}`, user)
    }

    export async function del(userId: string) {
        const user = await users.expect(userId)

        await Promise.all([
            db.delete(`users:${userId}`),
            db.delete(`user_id_by_email:${user.email}`),
            db.delete(`user_progress:${userId}`),
            db.delete(`user_notification_settings:${userId}`)
        ])
    }

    /** Change and confirm email */
    export async function changeEmail(userId: string, newEmail: string) {
        const existingUser = await users.getByEmail(newEmail)
        if (existingUser && existingUser.id !== userId) {
            throw new ResponseError(`Email address ${newEmail} is already associated with a user`, 409)
        }

        const user = await users.expect(userId)
        const oldEmail = user.email

        if (oldEmail === newEmail) {
            // Just confirming the address
            await users.update(user.id, { email: newEmail, emailConfirmed: true })
        } else {
            await Promise.all([
                users.update(user.id, { email: newEmail, emailConfirmed: true }),
                db.delete(`user_id_by_email:${oldEmail}`),
                db.put(`user_id_by_email:${newEmail}`, user.id)
            ])
        }
    }

    export async function changeUsername(userId: string, newUsername: string) {
        if (newUsername.length < 1 || newUsername.length > 50) {
            throw new ResponseError(`'${newUsername}' is not a valid display name. Your name must be between 1 and 50 characters.`, 422)
        }

        const user = await users.expect(userId)
        await Promise.all([
            users.update(user.id, { username: newUsername }),
        ])
    }
}

export namespace notificationSettings {
    export async function get(userId: string): Promise<UserNotificationSettings> {
        const json = await db.getJson(`user_notification_settings:${userId}`)
        const settings: UserNotificationSettings = _.defaults({}, json, {
            disableNotificationEmails: false,
            emailAboutNewDrafts: false,
            emailAboutNewConcepts: true,
            emailAboutWeeklyReviews: true,
            lastWeeklyReviewEmail: Date.now()
        })

        if (!_.isEqual(json, settings)) {
            await notificationSettings.set(userId, settings)
        }
        return settings
    }

    export async function set(userId: string, settings: UserNotificationSettings) {
        await db.putJson(`user_notification_settings:${userId}`, settings)
    }

    export async function update(userId: string, changes: Partial<UserNotificationSettings>) {
        const settings = await notificationSettings.get(userId)
        Object.assign(settings, changes)
        await notificationSettings.set(userId, settings)
    }
}

export type UserSecretInfo = {
    hashedPassword: string
}

export namespace userSecrets {
    export async function get(userId: string): Promise<UserSecretInfo | null> {
        return await db.getJson(`user_secrets:${userId}`)
    }

    export async function expect(userId: string): Promise<UserSecretInfo> {
        const secrets = await userSecrets.get(userId)
        if (!secrets) {
            throw new Error(`Expected to find secrets for user with id ${userId}`)
        }
        return secrets
    }

    export async function set(userId: string, auth: UserSecretInfo) {
        await db.putJson(`user_secrets:${userId}`, auth)
    }
}

export type Session = {
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
        const sessionKey = uuidv4()
        await db.putJson(`sessions:${sessionKey}`, { userId: userId }, { expirationTtl: time.weeks(4) })
        return sessionKey
    }

    export async function expire(sessionKey: string) {
        return await db.delete(`sessions:${sessionKey}`)
    }
}

/** User-lesson relationships. Stored as one big object per user. */
export namespace userLessons {
    export async function byLessonId(userId: string): Promise<_.Dictionary<UserLesson>> {
        const lessons = await db.getJson<any>(`user_lessons:${userId}`)
        return lessons || {}
    }

    export async function update(userId: string, lessonId: string, changes: Partial<UserLesson>) {
        const lessonItems = await userLessons.byLessonId(userId)
        const userLesson = lessonItems[lessonId] || {}
        Object.assign(userLesson, changes)
        lessonItems[lessonId] = userLesson
        await db.putJson(`user_lessons:${userId}`, lessonItems)
        return userLesson
    }

    export async function resetProgressFor(userId: string) {
        await db.delete(`user_lessons:${userId}`)
    }
}

export namespace progressItems {
    export async function allFor(userId: string): Promise<UserProgressItem[]> {
        const progress = await db.getJson<any>(`user_progress:${userId}`)
        return progress && progress.items ? _.values(progress.items) : []
    }

    export async function allByExerciseId(userId: string): Promise<_.Dictionary<UserProgressItem>> {
        const progress = await db.getJson<any>(`user_progress:${userId}`)
        return progress && progress.items ? progress.items : {}
    }

    export async function get(userId: string, exerciseId: string): Promise<UserProgressItem | undefined> {
        const items = await progressItems.allFor(userId)
        return items.find(i => i.exerciseId === exerciseId)
    }

    export async function save(progressItem: UserProgressItem) {
        const items = await progressItems.allByExerciseId(progressItem.userId)
        items[progressItem.exerciseId] = progressItem
        return await db.putJson(`user_progress:${progressItem.userId}`, { items: items })
    }

    export async function saveAll(userId: string, newItems: UserProgressItem[]) {
        const items = await progressItems.allByExerciseId(userId)
        for (const item of newItems) {
            items[item.exerciseId] = item
        }
        return await db.putJson(`user_progress:${userId}`, { items: items })
    }

    export async function resetAllProgressTo(userId: string, progressItems: UserProgressItem[]) {
        return await db.putJson(`user_progress:${userId}`, { items: _.keyBy(progressItems, item => item.exerciseId) })
    }

    export async function getProgressFor(userId: string): Promise<UserProgress> {
        const progressItemsReq = progressItems.allFor(userId)
        const userLessonsReq = userLessons.byLessonId(userId)

        const dbItems = await progressItemsReq
        const store: SRSProgressStore = { items: [] }
        store.items = dbItems.map(item => ({
            cardId: item.exerciseId,
            level: item.level,
            learnedAt: item.learnedAt,
            reviewedAt: item.reviewedAt
        }))

        const uls = await userLessonsReq
        const disabledLessons: { [lessonId: string]: boolean } = {}
        for (const lessonId in uls) {
            disabledLessons[lessonId] = !!uls[lessonId]?.disabled
        }

        return {
            disabledLessons,
            progressStore: store
        }
    }
}

export namespace passwordResets {
    export async function create(email: string): Promise<string> {
        const token = uuidv4()
        await cfstore.put(`password_resets:${token}`, email, { expirationTtl: time.days(1) }) // Expires after a day
        return token
    }

    export async function get(token: string): Promise<string | undefined> {
        const email = await cfstore.get(`password_resets:${token}`)
        return email || undefined
    }

    export async function destroy(token: string) {
        await cfstore.delete(`password_resets:${token}`)
    }
}

export namespace emailConfirmTokens {
    export async function create(userId: string, email: string): Promise<string> {
        const token = uuidv4()
        await db.putJson(`email_confirm_tokens:${token}`, { userId: userId, email: email }, { expirationTtl: time.weeks(4) })
        return token
    }

    export async function get(token: string): Promise<{ userId: string, email: string } | undefined> {
        const json = await db.getJson<{ userId: string, email: string }>(`email_confirm_tokens:${token}`)
        return json || undefined
    }

    export async function destroy(token: string) {
        await cfstore.delete(`email_confirm_tokens:${token}`)
    }
}

export async function makeLearnyPlanFor(userId: string) {
    const progress = await progressItems.getProgressFor(userId)

    const srs = new SRSProgress()
    srs.overwriteWith(progress.progressStore)
    return new LearnyPlan(srs, progress.disabledLessons)
}