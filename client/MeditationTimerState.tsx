import _ from "lodash"
import { observable, action, computed } from "mobx"

export class MeditationTimerState {
    lastTime?: number
    duration: number
    @observable timePassed: number = 0
    @observable frameHandle?: number
    bell: HTMLAudioElement

    constructor(readonly seconds: number) {
        this.duration = seconds * 1000
        this.bell = new Audio('/meditation-bell.mp3')
    }

    @action.bound frame(timestamp: number) {
        if (!this.playing) return
        if (this.lastTime)
            this.timePassed += timestamp - this.lastTime
        this.lastTime = timestamp

        // End exactly as the visual timer hits 0
        const isComplete = Math.floor(this.remainingTime / 1000) === 0

        if (isComplete) {
            this.timePassed = this.duration
            this.frameHandle = undefined
            this.bell.play()
            return
        }

        this.frameHandle = requestAnimationFrame(this.frame)
    }

    @computed get remainingTime() {
        return this.duration - this.timePassed
    }

    @computed get durationStr(): string {
        const mins = this.remainingTime / 1000 / 60
        const secs = (this.remainingTime / 1000) % 60

        return `${Math.floor(mins)}:${_.padStart(Math.floor(secs).toString(), 2, '0')}`
    }

    @computed get playing() {
        return this.frameHandle !== undefined
    }

    @action.bound play() {
        this.lastTime = undefined
        this.frameHandle = requestAnimationFrame(this.frame)
    }

    @action.bound pause() {
        if (this.frameHandle !== undefined) {
            cancelAnimationFrame(this.frameHandle)
            this.frameHandle = undefined
        }
    }

    @action.bound reset() {
        this.timePassed = 0
    }

    @action.bound toggle() {
        if (this.playing) {
            this.pause()
        } else {
            this.play()
        }
    }
}