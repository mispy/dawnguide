import axios, { AxiosInstance } from 'axios'
import { API_BASE_URL } from './settings'
import { expectStrings } from './utils'
import { UserConceptProgress } from '../shared/types'

export class SunpeepApi {
    http: AxiosInstance

    constructor() {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
        })
    }

    async getProgress(): Promise<UserConceptProgress> {
        const { data } = await this.http.get('/api/progress')
        return data
    }

    async submitProgress(conceptId: string, remembered: boolean): Promise<void> {
        await this.http.put('/api/progress', { conceptId: conceptId, remembered: remembered })
    }

    async startCheckout(planId: string): Promise<{ checkoutSessionId: string }> {
        const { data } = await this.http.post(`/api/checkout?planId=${planId}`)
        return expectStrings(data, 'checkoutSessionId')
    }
}