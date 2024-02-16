import * as THREE from 'three'
import { Sizes } from './utils'
import { Sketch } from './Sketch'
import { Renderer } from './Renderer'

export class Camera {
    sizes: Sizes
    scene: THREE.Scene
    renderer: Renderer
    instance: THREE.PerspectiveCamera

    constructor(private sketch: Sketch) {
        this.sizes = this.sketch.sizes
        this.scene = this.sketch.scene
        this.renderer = this.sketch.renderer
        this.instance = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.1, 100)
        this.setInstance()
    }

    setInstance() {
        this.instance.position.set(0, 0, 2.5)
        this.scene.add(this.instance)
    }

    handleResize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}
