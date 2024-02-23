import * as THREE from 'three'
import { Sketch } from '../Sketch'
import { EventEmitter } from './EventEmitter'
import { Sizes } from '.'

export class Pointer extends EventEmitter {
    sizes: Sizes
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    planeMesh!: THREE.Mesh
    position: THREE.Vector2

    constructor(private sketch: Sketch) {
        super()
        this.sizes = this.sketch.sizes
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.position = new THREE.Vector2(-10, -10)
        this.setPlaneMesh()
        this.initEventListener()
    }

    setPlaneMesh() {
        this.planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial())
    }

    initEventListener() {
        window.addEventListener('mousemove', (event) => this.onMouseMove(event), false)
    }

    onMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX - this.sizes.offsetLeft) / this.sizes.width * 2 - 1
        this.mouse.y = -(event.clientY - this.sizes.offsetTop) / this.sizes.height * 2 + 1
        this.raycaster.setFromCamera(this.mouse, this.sketch.camera.instance)
        const intersects = this.raycaster.intersectObjects([this.planeMesh], true)
        if (intersects.length > 0) {
            this.position.x = intersects[0].point.x
            this.position.y = intersects[0].point.y
        }
        this.trigger('move')
    }

    destroy() {
        window.removeEventListener('mousemove', (event) => this.onMouseMove(event), false)
    }
}
