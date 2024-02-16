import { EventEmitter } from './EventEmitter'

export class Sizes extends EventEmitter {
    width: number
    height: number
    pixelRatio: number
    
    constructor(private container: HTMLDivElement) {
        super()
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        window.addEventListener('resize', () => this.handleResize())
    }

    private handleResize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.trigger('resize')
    }

    public destroy() {
        window.removeEventListener('resize', () => this.handleResize())
    }
}
