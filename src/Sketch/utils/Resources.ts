import * as THREE from 'three'
import { EventEmitter } from './EventEmitter'
import { SourceItems, SourceName, Source } from '../../types'
import { sources } from '../sources'

export class Resources extends EventEmitter {
    items: SourceItems
    toLoad: number
    loaded: number
    loaders!: {
        textureLoader: THREE.TextureLoader
    }

    constructor() {
        super()

        this.items = new Map<SourceName, any>()
        this.toLoad = sources.length || 0
        this.loaded = 0

        this.initLoaders()
        this.startLoading()
    }

    private initLoaders() {
        this.loaders = {
            textureLoader: new THREE.TextureLoader(),
        }
    }

    private startLoading() {
        for (const source of sources) {
            switch (source.type) {
                case 'pixelData':
                    this.loadPixelData(source)
                    break
            }
        }
    }

    private imageLoader(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = src
            img.onload = () => resolve(img)
            img.onerror = (e) => reject(e)
        })
    }

    private async loadPixelData(source: Source) {
        try {
            const { name, path } = source
            if (typeof path !== 'string') throw new Error('Pixel Data required a string path')
            const img = await this.imageLoader(path)
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('Canvas 2D not supported')
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const data = ctx.getImageData(0, 0, img.width, img.height).data
            this.items.set(name, {data, width: img.width, height: img.height})
            this.onLoaded()
        } catch (e) {
            console.error(e)
        }
    }

    private onLoaded() {
        this.loaded++
        if (this.loaded >= this.toLoad) {
            this.trigger('loaded')
        }
    }
}
