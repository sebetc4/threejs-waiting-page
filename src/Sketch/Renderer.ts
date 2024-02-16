import * as THREE from 'three'
import { Sketch } from './Sketch'
import { Sizes } from './utils'

export class Renderer {
    sizes: Sizes
    instance: THREE.WebGLRenderer

    constructor(private sketch: Sketch) {
        this.sizes = this.sketch.sizes
        this.instance = new THREE.WebGLRenderer({alpha: true, antialias: true})
        this.sketch.container.appendChild(this.instance.domElement)
        this.setSize()
    }

    public setSize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    public update() {
        this.instance.render(this.sketch.scene, this.sketch.camera.instance)
    }
}
