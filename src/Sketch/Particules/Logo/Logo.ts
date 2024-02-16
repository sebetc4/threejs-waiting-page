import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import simVertexShader from './shaders/simVertex.glsl'
import simFragmentShader from './shaders/simFragment.glsl'
import gsap from 'gsap'
import { Sketch } from '../../Sketch'
import { PixelDataImage } from '../../../types'

export class Logo {
    
    readonly PARICULE_RESOLUTION = 258
    readonly PARTICULE_COUNT = this.PARICULE_RESOLUTION ** 2
    readonly SIZE = 4

    parameters = {
        uLogoMix: 0,
        friction: 0.9,
        mouseEffectDistance: 0.2,
        mouseEffectStrength: 0.005,
        attractionStrength: 0.0001,
        alphaParticules: 0.8,
    }

    // Scene
    time: number
    scene: THREE.Scene

    // GPGPU
    simUniforms!: THREE.ShaderMaterial['uniforms']

    // Texture
    logoPixelData: { x: number; y: number }[]
    logoDataTexture: THREE.DataTexture

    textPixelData: { x: number; y: number }[]
    textDataTexture: THREE.DataTexture

    // Mesh
    geometry!: THREE.BufferGeometry
    material!: THREE.ShaderMaterial
    instance!: THREE.Points

    constructor(private sketch: Sketch) {
        this.time = 0
        this.scene = this.sketch.scene

        this.logoPixelData = this.getPixelDataFromImage(this.sketch.resources.items.get('logo'))
        this.logoDataTexture = this.getDataTexture(this.logoPixelData)
        this.textPixelData = this.getPixelDataFromImage(this.sketch.resources.items.get('text'))
        this.textDataTexture = this.getDataTexture(this.textPixelData)

        this.setInstance()
        this.setGPGPU()
        this.initTimeline()
        this.sketch.debugIsActive && this.initDebug()
    }

    initTimeline() {
        const timeline = gsap.timeline()
        timeline.to(this.simUniforms, {
            duration: 1,
            uLogoMix: 1,
            ease: "elastic.out(1,0.3)",
            delay: 8,
        })
        timeline.to(this.simUniforms, {
            duration: 1,
            uLogoMix: 0,
            ease: "elastic.out(1,0.3)",
            delay: 8,
        })
        timeline.repeat(-1)
    }

    setGPGPU() {
        const material = new THREE.ShaderMaterial({
            vertexShader: simVertexShader,
            fragmentShader: simFragmentShader,
            uniforms: {
                uPositions: { value: this.logoDataTexture },
                uTime: { value: this.parameters.uLogoMix },
                uLogoMix: { value: 0 },
                uPointer: { value: this.sketch.pointer.position },
                uLogoPositions: { value: this.logoDataTexture },
                uTextPositions: { value: this.textDataTexture },
                uFriction: { value: this.parameters.friction },
                uMouseEffectDistance: { value: this.parameters.mouseEffectDistance },
                uMouseEffectStrength: { value: this.parameters.mouseEffectStrength },
                uAttractionStrength: { value: this.parameters.attractionStrength },
            },
        })

        this.simUniforms = this.sketch.gpgpu.getSimUniforms(this.PARICULE_RESOLUTION, material, 'uPositions')
    }

    setInstance() {
        const { positions, uvs } = this.getPositionsAndUvs()

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uPositions: { value: this.logoDataTexture },
                uAlpha: { value: this.parameters.alphaParticules },
            },
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })

        this.instance = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.instance)
    }

    getDataTexture(pixelData: { x: number; y: number }[]) {
        const data = new Float32Array(this.PARTICULE_COUNT * 4)

        for (let y = 0; y < this.PARICULE_RESOLUTION; y++) {
            for (let x = 0; x < this.PARICULE_RESOLUTION; x++) {

                const i4 = (y * this.PARICULE_RESOLUTION + x) * 4

                const randomPixel = pixelData[Math.floor(Math.random() * pixelData.length)]

                data[i4] = (randomPixel.x + (Math.random() - 0.5) * 0.006) * this.SIZE
                data[i4 + 1] = (randomPixel.y + (Math.random() - 0.5) * 0.006) * this.SIZE
                data[i4 + 2] = (Math.random() - 0.5) * 0.01
                data[i4 + 3] = (Math.random() - 0.5) * 0.01
            }
        }

        const positions = new THREE.DataTexture(
            data,
            this.PARICULE_RESOLUTION,
            this.PARICULE_RESOLUTION,
            THREE.RGBAFormat,
            THREE.FloatType
        )
        positions.needsUpdate = true

        return positions
    }

    private getPositionsAndUvs() {
        const positions = new Float32Array(this.PARTICULE_COUNT * 3)
        const uvs = new Float32Array(this.PARTICULE_COUNT * 2)

        for (let y = 0; y < this.PARICULE_RESOLUTION; y++) {
            for (let x = 0; x < this.PARICULE_RESOLUTION; x++) {
                const index = y * this.PARICULE_RESOLUTION + x
                const i3 = index * 3
                const i2 = index * 2
                positions[i3] = x / this.PARICULE_RESOLUTION - 0.5
                positions[i3 + 1] = y / this.PARICULE_RESOLUTION - 0.5
                positions[i3 + 2] = 0
                uvs[i2] = x / (this.PARICULE_RESOLUTION - 1)
                uvs[i2 + 1] = y / (this.PARICULE_RESOLUTION - 1)
            }
        }

        return { positions, uvs }
    }

    getPixelDataFromImage(img: PixelDataImage) {
        const pixels = []
        for (let i = 0; i < img.data.length; i += 4) {
            const x = (i / 4) % img.width
            const y = Math.floor(i / (4 * img.height))
            if (img.data[i] < 100) {
                pixels.push({
                    x: x / img.width - 0.5,
                    y: 0.5 - y / img.height,
                })
            }
        }
        return pixels
    }

    handlePointerMove() {
        this.simUniforms.uPointer.value = this.sketch.pointer.position
    }

    update() {
        this.simUniforms.uTime.value = this.sketch.time.elapsed
        this.material.uniforms.uPositions.value = this.simUniforms.uPositions.value
    }

    initDebug() {
        const debugFolder = this.sketch.debug!.gui.addFolder('Particules')
        debugFolder.add(this.parameters, 'friction').min(0.9).max(0.99).step(0.001).onChange(() => {
            this.simUniforms.uFriction.value = this.parameters.friction
        })
        debugFolder.add(this.parameters, 'mouseEffectDistance').min(0.01).max(0.1).step(0.001).onChange(() => {
            this.simUniforms.uMouseEffectDistance.value = this.parameters.mouseEffectDistance
        })
        debugFolder.add(this.parameters, 'mouseEffectStrength').min(0.0001).max(0.01).step(0.001).onChange(() => {
            this.simUniforms.uMouseEffectStrength.value = this.parameters.mouseEffectStrength
        })
        debugFolder.add(this.parameters, 'attractionStrength').min(0.00001).max(0.01).step(0.00001).onChange(() => {
            this.simUniforms.uAttractionStrength.value = this.parameters.attractionStrength
        })
        debugFolder.add(this.parameters, 'alphaParticules').min(0.05).max(1).step(0.01).onChange(() => {
            this.material.uniforms.uAlpha.value = this.parameters.alphaParticules
        })
    }
}
