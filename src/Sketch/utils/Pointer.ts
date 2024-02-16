import * as THREE from 'three'
import { Sketch } from '../Sketch'
import { EventEmitter } from './EventEmitter'

export class Pointer extends EventEmitter {
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    planeMesh!: THREE.Mesh
    position: THREE.Vector3

    constructor(private sketch: Sketch) {
        super()
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.position = new THREE.Vector3()
        this.setPlaneMesh()
        this.initEventListener()
    }

    setPlaneMesh() {
        this.planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial())
    }

    initEventListener() {
        window.addEventListener('mousemove', (event) => this.onMouseMove(event), false)
    }

    onMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        this.raycaster.setFromCamera(this.mouse, this.sketch.camera.instance)
        const intersects = this.raycaster.intersectObjects([this.planeMesh], true)
        if (intersects.length > 0) {
            this.position = intersects[0].point
        }
        this.trigger('move')
    }

    destroy() {
        window.removeEventListener('mousemove', (event) => this.onMouseMove(event), false)
    }
}
