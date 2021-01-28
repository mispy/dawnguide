import { faUndo, faPause, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import _ from "lodash"
import { observable, action, computed, makeObservable } from "mobx"
import { Observer, useLocalStore, useObserver } from "mobx-react-lite"
import React from "react"
import styled from 'styled-components'

class MeditationTimerState {
    lastTime?: number
    duration: number
    @observable timePassed: number = 0
    @observable frameHandle: number | null = null
    bell: HTMLAudioElement
    wakeLock?: any

    constructor(readonly seconds: number) {
        makeObservable(this)
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
            this.bell.play()
            this.pause()
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
        return this.frameHandle !== null
    }

    @action.bound play() {
        if (this.timePassed === 0) {
            this.bell.play()
        }
        this.lastTime = undefined
        this.frameHandle = requestAnimationFrame(this.frame)
        try {
            const nav = navigator as any
            nav.wakeLock.request('screen').then((lock: any) => this.wakeLock = lock)
        } catch (err) {
            console.error(err)
        }
    }

    @action.bound pause() {
        if (this.frameHandle !== null) {
            cancelAnimationFrame(this.frameHandle)
            this.frameHandle = null
        }

        if (this.wakeLock !== undefined) {
            this.wakeLock.release()
            this.wakeLock = undefined
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

const MeditationTimerDiv = styled.div`
.controls {
    display: flex;
    align-items: center;
}

p {
    margin-bottom: 0;
}
`

export function MeditationTimer(props: { seconds: number }) {
    const state = useLocalStore(() => new MeditationTimerState(props.seconds))

    return <Observer>
        {() => <MeditationTimerDiv className="card">
            <div className="card-body">
                <h6>Meditation Timer</h6>
                <div className="controls">
                    <button className="btn" onClick={state.reset}>
                        <FontAwesomeIcon icon={faUndo} />
                    </button>
                    <button className="btn" onClick={state.toggle}>
                        {state.playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    </button>
                    <div>
                        {state.durationStr}
                    </div>
                </div>
                <p className="text-secondary mt-2">There is a little chime sound at the start and end.</p>
            </div>
        </MeditationTimerDiv>}
    </Observer>
}