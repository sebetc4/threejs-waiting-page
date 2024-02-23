import { Scene, ShaderMaterial, WebGLRenderTarget } from "three"

export type GPGPURenderer = {
    variable: string
    material: ShaderMaterial
    scene: Scene
    renderTarget: WebGLRenderTarget
    renderTarget2: WebGLRenderTarget
}

export type PixelData = {
    x: number
    y: number
}