import * as THREE from 'three'
import { Camera } from './Camera'
import { Renderer } from './Renderer'
import { Particules } from './Particules/Particules'
import { Debug, Sizes, Time, Resources, Pointer } from './utils'
import { GPGPU } from './GPGPU'

export class Sketch {
    readonly PARTICULES_RESOLUTION = 252
    readonly PARTICULES_COUNT = this.PARTICULES_RESOLUTION ** 2
    // Modes
    readonly debugIsActive = window.location.hash === '#debug'
    // Scene
    scene: THREE.Scene
    // Utils
    debug?: Debug
    sizes: Sizes
    time: Time
    resources: Resources
    pointer: Pointer
    // Renderer
    renderer: Renderer
    gpgpu: GPGPU
    camera: Camera
    // Particules
    particules: Particules

    constructor(public container: HTMLDivElement) {
        // Scene
        this.scene = new THREE.Scene()
        // Utils
        if (this.debugIsActive) {
            this.debug = new Debug()
        }
        this.sizes = new Sizes(this.container)
        this.time = new Time()
        this.resources = new Resources()
        this.pointer = new Pointer(this)
        // Renderer
        this.renderer = new Renderer(this)
        this.gpgpu = new GPGPU(this.renderer.instance)
        this.camera = new Camera(this)
        // World
        this.particules = new Particules(this)

        this.initEvenetListeners()
    }

    initEvenetListeners() {
        this.sizes.on('resize', () => this.handleResize())
        this.time.on('frame', () => this.handleFrame())
        this.pointer.on('move', () => this.handlePointerMove())
    }

    handleResize() {
        this.camera.handleResize()
        this.renderer.setSize()
    }

    handleFrame() {
        this.debug?.stats.begin()
        this.particules.update()
        this.renderer.update()
        this.debug?.stats.end()
    }

    handlePointerMove() {
        this.particules.handlePointerMove()
    }

    destroy() {
        this.sizes.off('resize')
        this.sizes.destroy()
        this.time.off('frame')
        this.time.destroy()
    }
}
