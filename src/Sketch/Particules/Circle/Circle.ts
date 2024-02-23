// Libs
import * as THREE from 'three'

// App
import { Sketch } from '../../Sketch'

// Shaders
import vertexShader from './shaders/circleVertex.glsl'
import fragmentShader from './shaders/circleFragment.glsl'
import simVertexShader from './shaders/circleSimVertex.glsl'
import simFragmentShader from './shaders/circleSimFragment.glsl'
import { Time } from '../../utils'

export class Circle {

    readonly PARTICULE_RESOLUTION = 128
    readonly PARTICULE_COUNT = this.PARTICULE_RESOLUTION ** 2

    // Scene
    time: Time
    scene: THREE.Scene

    // GPGPU
    simUniforms!: THREE.ShaderMaterial['uniforms']

    // Textures
    initialPositions!: THREE.DataTexture
    randoms!: THREE.DataTexture

    // Array
    uvs!: Float32Array
    
    // Mesh
    geometry!: THREE.BufferGeometry
    material!: THREE.ShaderMaterial
    instance!: THREE.Points

    constructor(private sketch: Sketch) {
        this.time = this.sketch.time
        this.scene = this.sketch.scene
        this.setArraysAndTextures()
        this.setGPGPU()
        this.setInstance()
    }

    setGPGPU() {
        const material = new THREE.ShaderMaterial({
            vertexShader: simVertexShader,
            fragmentShader: simFragmentShader,
            uniforms: {
                uPositions: { value: this.initialPositions },
                uTime: { value: 0 },
                uDeltaTime: { value: this.time.delta },
                uPointer: { value: this.sketch.pointer.position },
                uRandoms: { value: this.randoms }
            },
        })
        this.simUniforms = this.sketch.gpgpu.getSimUniforms(this.PARTICULE_RESOLUTION, material, 'uPositions')
    }

    setInstance() {
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.PARTICULE_COUNT * 3), 3))
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2))

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uPositions: { value: this.initialPositions },
                uColor: { value: new THREE.Color('#ECEEEC') },
            },
            transparent: true,
        })

        this.instance = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.instance)
    }

    private setArraysAndTextures() {
        this.uvs = new Float32Array(this.PARTICULE_COUNT * 2)
        const randomArray = new Float32Array(this.PARTICULE_COUNT * 4)
        const positionOnCircleArray = new Float32Array(this.PARTICULE_COUNT * 4)

        for (let y = 0; y < this.PARTICULE_RESOLUTION; y++) {
            for (let x = 0; x < this.PARTICULE_RESOLUTION; x++) {
                const index = y * this.PARTICULE_RESOLUTION + x
                const i4 = index * 4
                const i2 = index * 2
                // UVs
                this.uvs[i2] = x / (this.PARTICULE_RESOLUTION - 1)
                this.uvs[i2 + 1] = y / (this.PARTICULE_RESOLUTION - 1)
                // Randoms
                randomArray[i4] = 0.5 + Math.random()
                randomArray[i4 + 1] = 0.5 + Math.random()
                randomArray[i4 + 2] = 1
                randomArray[i4 + 3] = 1
                // Positions on circle
                const theta = Math.random() * Math.PI * 2
                const r = 0.5 + Math.random() * 0.5
                positionOnCircleArray[i4] = r * Math.cos(theta)
                positionOnCircleArray[i4 + 1] = r * Math.sin(theta)
                positionOnCircleArray[i4 + 2] = 1
                positionOnCircleArray[i4 + 3] = 1
            }
        }

        this.randoms = new THREE.DataTexture(
            randomArray,
            this.PARTICULE_RESOLUTION,
            this.PARTICULE_RESOLUTION,
            THREE.RGBAFormat,
            THREE.FloatType
        )
        this.randoms.minFilter = THREE.NearestFilter
        this.randoms.magFilter = THREE.NearestFilter
        this.randoms.needsUpdate = true

        this.initialPositions = new THREE.DataTexture(
            positionOnCircleArray,
            this.PARTICULE_RESOLUTION,
            this.PARTICULE_RESOLUTION,
            THREE.RGBAFormat,
            THREE.FloatType
        )
        this.initialPositions.minFilter = THREE.NearestFilter
        this.initialPositions.magFilter = THREE.NearestFilter
        this.initialPositions.needsUpdate = true
    }

    handlePointerMove() {
        this.simUniforms.uPointer.value = this.sketch.pointer.position
    }

    update() {
        this.simUniforms.uTime.value = this.time.elapsed
        this.simUniforms.uDeltaTime.value = this.time.delta
        
        this.material.uniforms.uPositions.value = this.simUniforms.uPositions.value
    }
}
