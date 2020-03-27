import _ = require('lodash')
import axios, { AxiosInstance } from 'axios'

import { API_BASE_URL } from './settings'
import { expectStrings } from './utils'
import { ExerciseWithProgress } from '../shared/logic'
import { User, UserProgressItem } from '../shared/types'
import { Sunpedia } from '../shared/sunpedia'

export class SunpeepApi {
    http: AxiosInstance
    admin: AdminApi
    debug: DebugApi

    constructor(readonly sunpedia: Sunpedia) {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
        })

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

    async startCheckout(planId: string): Promise<{ checkoutSessionId: string }> {
        const { data } = await this.http.post(`/api/checkout?planId=${planId}`)
        return expectStrings(data, 'checkoutSessionId')
    }

    async startChangeEmail(params: { newEmail: string, password: string }) {
        await this.http.post('/api/changeEmail', params)
    }

    async changePassword(params: { newPassword: string, currentPassword: string }) {
        await this.http.post('/api/changePassword', params)
    }
}

export class AdminApi {
    constructor(readonly http: AxiosInstance) { }

    async getUsers(): Promise<User[]> {
        const { data } = await this.http.get('/api/admin/users')
        return data
    }

    async deleteUser(userId: string) {
        await this.http.delete(`/api/admin/users/${userId}`)
    }
}

export class DebugApi {
    constructor(readonly http: AxiosInstance) { }

    async resetProgress() {
        await this.http.post('/api/debug', { action: 'resetProgress' })
    }

    async moveReviewsForward() {
        await this.http.post('/api/debug', { action: 'moveReviewsForward' })
    }
}