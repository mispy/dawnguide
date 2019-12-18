import axios, { AxiosInstance } from 'axios'
import { API_BASE_URL } from './settings'
import { expectStrings } from './utils'

export class SunpeepApi {
    http: AxiosInstance

    constructor() {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
        })
    }

    async startCheckout(): Promise<{ checkoutSessionId: string }> {
        const { data } = await this.http.post('/api/checkout')
        return expectStrings(data, 'checkoutSessionId')
    }
}