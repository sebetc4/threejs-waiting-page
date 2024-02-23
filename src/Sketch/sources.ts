import { Sources } from '../types'

export const sourceNames = ['logo', 'text-fr', 'text-en'] as const

export const sourceTypes = ['pixelData'] as const

export const sources: Sources = [
    {
        name: 'logo',
        type: 'pixelData',
        path: '/textures/logo.jpg',
    },
    {
        name: 'text-fr',
        type: 'pixelData',
        path: '/textures/text-fr.jpg',
    },
    {
        name: 'text-en',
        type: 'pixelData',
        path: '/textures/text-en.jpg',
    },
]
