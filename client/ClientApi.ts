import * as _ from 'lodash'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { API_BASE_URL, IS_PRODUCTION } from './settings'
import { delay } from './utils'
import type { UserInfo, UserProgressItem, UserNotificationSettings, UserAdminReport, UserLesson, UserProgress } from '../common/types'
import type { SRSProgressStore, SRSProgressStoreItem } from '../common/SRSProgress'
// @ts-ignore
const NProgress = require('accessible-nprogress')

NProgress.configure({
    showSpinner: false
})

export type HttpProviderOptions = {
    /** If true, show global nprogress loading for each request. */
    nprogress?: boolean
}

/** Wraps axios http methods so we can do stuff on each call */
class HttpProvider {
    http: AxiosInstance
    pendingRequests: { promise: Promise<AxiosResponse<any>>, config: AxiosRequestConfig }[] = []

    constructor(readonly opts: HttpProviderOptions = {}) {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
        })

        if (!IS_PRODUCTION) {
            // In development, delay all requests by a small random amount to simulate live user experience.
            // This helps with dev-prod parity so that we remember to do good loading behavior.
            this.http.interceptors.response.use(async response => {
                // Numbers are based on how long API requests take for me on GitHub, which uses
                // a similar kind of loading indicator to us
                await delay(_.random(200, 700))
                return response
            })
        }
    }

    async request(config: AxiosRequestConfig) {
        const promise = this.http.request(config)
        if (this.opts.nprogress) {
            NProgress.promise(promise)
        }

        const req = { promise: promise, config: config }
        this.pendingRequests.push(req)
        promise.finally(() => {
            const index = this.pendingRequests.indexOf(req)
            if (index !== -1)
                this.pendingRequests.splice(index, 1)
        })

        // let complete = false
        // req.then(() => complete = true)
        // delay(500).then(() => {
        //     if (!complete) {
        //         NProgress.promise(req)
        //     }
        // })

        return promise
    }

    async get(url: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse> {
        return this.request(_.extend({ method: 'get', url: url }, config))
    }

    async post(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse> {
        return this.request(_.extend({ method: 'post', url: url, data: data }, config))
    }

    async patch(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse> {
        return this.request(_.extend({ method: 'patch', url: url, data: data }, config))
    }

    async put(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse> {
        return this.request(_.extend({ method: 'put', url: url, data: data }, config))
    }

    async delete(url: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse> {
        return this.request(_.extend({ method: 'delete', url: url }, config))
    }
}

export class ClientApi {
    http: HttpProvider
    admin: AdminApi
    debug: DebugApi

    constructor(opts: HttpProviderOptions = {}) {
        this.http = new HttpProvider(opts)
        this.admin = new AdminApi(this.http)
        this.debug = new DebugApi(this.http)
    }

    /** Get a new api wrapper with some changed options */
    with(opts: HttpProviderOptions) {
        const newOpts = Object.assign({}, this.http.opts, opts)
        return new ClientApi(newOpts)
    }

    async getProgress(): Promise<UserProgress> {
        const { data } = await this.http.get('/api/progress')
        return data
    }

    async srsUpdate(exerciseId: string, remembered: boolean): Promise<void> {
        await this.http.put('/api/srs', { exerciseId: exerciseId, remembered: remembered })
    }

    async reconcileProgress(changedItems: SRSProgressStoreItem[]): Promise<SRSProgressStore> {
        const { data } = await this.http.patch('/api/progress', { changes: changedItems })
        return data
    }

    async completeLesson(exerciseIds: string[]): Promise<void> {
        await this.http.post('/api/lesson', { exerciseIds: exerciseIds })
    }

    async updateUserLesson(lessonId: string, userLesson: Partial<UserLesson>): Promise<void> {
        await this.http.patch(`/api/userLessons/${lessonId}`, userLesson)
    }

    async getCurrentUser(): Promise<UserInfo> {
        const { data } = await this.http.get('/api/users/me')
        return data
    }

    async subscribe(planId: string): Promise<{ checkoutSessionId: string } | { user: UserInfo }> {
        const { data } = await this.http.post(`/api/subscribe`, { planId: planId })
        return data
    }

    async cancelSubscription(): Promise<{ user: UserInfo }> {
        const { data } = await this.http.post(`/api/cancelSubscription`)
        return data
    }

    async startChangeEmail(params: { newEmail: string, password: string }) {
        await this.http.post('/api/changeEmail', params)
    }

    async changeUsername(params: { newUsername: string }) {
        await this.http.post('/api/changeUsername', params)
    }

    async changePassword(params: { newPassword: string, currentPassword: string }) {
        await this.http.post('/api/changePassword', params)
    }

    async getNotificationSettings(): Promise<UserNotificationSettings> {
        const { data } = await this.http.get('/api/notificationSettings')
        return data
    }

    async updateNotificationSettings(params: Partial<UserNotificationSettings>) {
        await this.http.patch('/api/notificationSettings', params)
    }

    async contact(params: { subject: string, body: string }) {
        await this.http.post('/api/contact', params)
    }
}

export class AdminApi {
    constructor(readonly http: HttpProvider) { }

    async getUsers(): Promise<UserAdminReport[]> {
        const { data } = await this.http.get('/api/admin/users')
        return data
    }

    async deleteUser(userId: string) {
        await this.http.delete(`/api/admin/users/${userId}`)
    }

    async testLessonEmail(lessonId: string) {
        await this.http.post('/api/admin/testLessonEmail', { lessonId: lessonId })
    }

    async testReviewsEmail() {
        await this.http.post('/api/admin/testReviewsEmail')
    }

    async emailEveryone(lessonId: string) {
        await this.http.post('/api/admin/emailEveryone', { lessonId: lessonId })
    }
}

export class DebugApi {
    constructor(readonly http: HttpProvider) { }

    async resetProgress() {
        await this.http.post('/api/debug', { action: 'resetProgress' })
    }

    async moveReviewsForward() {
        await this.http.post('/api/debug', { action: 'moveReviewsForward' })
    }
}