import { EventEmitter } from './EventEmitter'

export class Sizes extends EventEmitter {
    width: number
    height: number
    offsetLeft: number
    offsetTop: number
    pixelRatio: number
    
    constructor(private container: HTMLDivElement) {
        super()
        console.log(this.container)
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.offsetLeft = this.container.offsetLeft
        this.offsetTop = this.container.offsetTop
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        window.addEventListener('resize', () => this.handleResize())
    }

    private handleResize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.offsetLeft = this.container.offsetLeft
        this.offsetTop = this.container.offsetTop
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.trigger('resize')
    }

    public destroy() {
        window.removeEventListener('resize', () => this.handleResize())
    }
}
