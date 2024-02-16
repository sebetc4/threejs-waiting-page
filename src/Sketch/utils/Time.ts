import { EventEmitter } from './EventEmitter'

export class Time extends EventEmitter {
    stopLoop: boolean = false
    start: number
    current: number
    elapsed: number
    delta: number

    constructor() {
        super()
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() => this.frameLoop())
    }

    frameLoop() {
        if (this.stopLoop) return
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.trigger('frame')
        window.requestAnimationFrame(() => this.frameLoop())
    }

    public destroy() {
        this.stopLoop = true
    }
}
