import _ = require('lodash')
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { API_BASE_URL, IS_PRODUCTION } from './settings'
import { expectStrings, delay } from './utils'
import { User, UserProgressItem, UserNotificationSettings } from '../shared/types'
import { Sunpedia } from '../shared/sunpedia'
// @ts-ignore
const NProgress = require('accessible-nprogress')

/** Wraps axios http methods so we can do stuff on each call */
class HTTPProvider {
    http: AxiosInstance
    constructor() {
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
                await delay(_.random(100, 300))
                return response
            })
        }
    }

    async request(config: AxiosRequestConfig) {
        const req = this.http.request(config)

        let complete = false
        req.then(() => complete = true)
        delay(500).then(() => {
            if (!complete) {
                NProgress.promise(req)
            }
        })

        return req
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
    http: HTTPProvider
    admin: AdminApi
    debug: DebugApi

    constructor(readonly sunpedia: Sunpedia) {
        this.http = new HTTPProvider()
        this.admin = new AdminApi(this.http)
        this.debug = new DebugApi(this.http)
    }

    async getProgressItems(): Promise<UserProgressItem[]> {
        const { data } = await this.http.get('/api/progress')
        return data.items
    }

    async submitProgress(exerciseId: string, remembered: boolean): Promise<void> {
        await this.http.put('/api/progress', { exerciseId: exerciseId, remembered: remembered })
    }

    async completeLesson(exerciseIds: string[]): Promise<void> {
        await this.http.post('/api/lesson', { exerciseIds: exerciseIds })
    }

    async subscribe(planId: string): Promise<{ checkoutSessionId: string } | { user: User }> {
        const { data } = await this.http.post(`/api/subscribe?planId=${planId}`)
        return data
    }

    async cancelSubscription(): Promise<{ user: User }> {
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
    constructor(readonly http: HTTPProvider) { }

    async getUsers(): Promise<User[]> {
        const { data } = await this.http.get('/api/admin/users')
        return data
    }

    async deleteUser(userId: string) {
        await this.http.delete(`/api/admin/users/${userId}`)
    }

    async testConceptEmail(conceptId: string) {
        await this.http.post('/api/admin/testConceptEmail', { conceptId: conceptId })
    }
}

export class DebugApi {
    constructor(readonly http: HTTPProvider) { }

    async resetProgress() {
        await this.http.post('/api/debug', { action: 'resetProgress' })
    }

    async moveReviewsForward() {
        await this.http.post('/api/debug', { action: 'moveReviewsForward' })
    }
}