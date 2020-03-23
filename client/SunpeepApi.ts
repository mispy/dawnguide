import _ = require('lodash')
import axios, { AxiosInstance } from 'axios'

import { API_BASE_URL } from './settings'
import { expectStrings } from './utils'
import { User, ExerciseWithProgress } from '../shared/logic'
import { UserProgressItem } from '../shared/types'
import { Sunpedia } from '../shared/sunpedia'

export class SunpeepApi {
  http: AxiosInstance
  admin: AdminApi

  constructor(readonly sunpedia: Sunpedia) {
    this.http = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000
    })

    this.admin = new AdminApi(this.http)
  }

  async getProgressItems(): Promise<UserProgressItem[]> {
    const { data } = await this.http.get('/api/progress')
    return data.items
  }

  async getExercisesWithProgress(): Promise<ExerciseWithProgress[]> {
    const progressItems = await this.getProgressItems()
    const progressByExerciseId = _.keyBy(progressItems, item => item.exerciseId) as _.Dictionary<UserProgressItem | undefined>

    const exercisesWithProgress: ExerciseWithProgress[] = []
    for (const exercise of this.sunpedia.exercises) {
      const item = progressByExerciseId[exercise.id]

      exercisesWithProgress.push({
        exercise: exercise,
        progress: item
      })
    }

    return exercisesWithProgress
  }

  async submitProgress(exerciseId: string, remembered: boolean): Promise<void> {
    await this.http.put('/api/progress', { exerciseId: exerciseId, remembered: remembered })
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