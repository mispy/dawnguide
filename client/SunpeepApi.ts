import axios, { AxiosInstance } from 'axios'
import { API_BASE_URL } from './settings'
import { expectStrings } from './utils'
import { concepts, Concept } from '../shared/concepts'
import { ConceptWithProgress, UserConceptProgress, User } from '../shared/logic'

export class SunpeepApi {
    http: AxiosInstance
    admin: AdminApi

    constructor() {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
        })

        this.admin = new AdminApi(this.http)
    }

    async getProgress(): Promise<UserConceptProgress> {
        const { data } = await this.http.get('/api/progress')
        return data
    }

    async getConceptsWithProgress(): Promise<ConceptWithProgress[]> {
        const userProgress: UserConceptProgress = await this.getProgress()

        const conceptsWithProgress: ConceptWithProgress[] = []
        for (const concept of concepts) {
            const item = userProgress.concepts[concept.id]

            conceptsWithProgress.push({
                concept: concept,
                progress: item
            })
        }

        return conceptsWithProgress
    }

    async submitProgress(conceptId: string, remembered: boolean): Promise<void> {
        await this.http.put('/api/progress', { conceptId: conceptId, remembered: remembered })
    }

    async startCheckout(planId: string): Promise<{ checkoutSessionId: string }> {
        const { data } = await this.http.post(`/api/checkout?planId=${planId}`)
        return expectStrings(data, 'checkoutSessionId')
    }
}

export class AdminApi {
    http: AxiosInstance
    constructor(http: AxiosInstance) {
        this.http = http
    }

    async getUsers(): Promise<{ users: User[] }> {
        const { data } = await this.http.get('/api/admin/users')
        return data
    }
}