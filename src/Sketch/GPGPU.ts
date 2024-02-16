import { FloatType, Mesh, NearestFilter, OrthographicCamera, PlaneGeometry, RGBAFormat, Scene, ShaderMaterial, WebGLRenderTarget, WebGLRenderer } from 'three'
import { GPGPURenderer } from '../types'

export class GPGPU {
    gpuRenderers: GPGPURenderer[] = []
    camera!: THREE.OrthographicCamera
    constructor(private renderer: WebGLRenderer) {
        this.setCamera()
    }

    setCamera() {
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
        this.camera.position.z = 1
        this.camera.lookAt(0, 0, 0)
    }

    getSimUniforms(resolution: number, material: ShaderMaterial, variable: string) {
        const scene = new Scene()
        const plane = new PlaneGeometry(2, 2, 2, 2)
        const renderTarget = new WebGLRenderTarget(resolution, resolution, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: FloatType,
        })
        const renderTarget2 = renderTarget.clone()
        const mesh = new Mesh(plane, material)
        scene.add(mesh)
        this.gpuRenderers.push({
            variable,
            material,
            scene,
            renderTarget,
            renderTarget2
        })
        return this.gpuRenderers[this.gpuRenderers.length - 1].material.uniforms
    }

    update() {
        for (const gpuRenderer of this.gpuRenderers) {
            this.renderer.setRenderTarget(gpuRenderer.renderTarget)
            this.renderer.render(gpuRenderer.scene, this.camera)
            this.renderer.setRenderTarget(null)
            gpuRenderer.material.uniforms[gpuRenderer.variable].value = gpuRenderer.renderTarget.texture
            this.swapRenderTargets(gpuRenderer)
        }
    }

    swapRenderTargets(gpuRenbderer: GPGPURenderer) {
        const tmp = gpuRenbderer.renderTarget
        gpuRenbderer.renderTarget = gpuRenbderer.renderTarget2
        gpuRenbderer.renderTarget2 = tmp
    }
}