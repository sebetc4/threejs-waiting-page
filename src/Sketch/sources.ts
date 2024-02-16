import { Sources } from '../types'

export const sourceNames = ['logo', 'text'] as const

export const sourceTypes = ['pixelData'] as const

export const sources: Sources = [
    {
        name: 'logo',
        type: 'pixelData',
        path: '/textures/logo.jpg',
    },
    {
        name: 'text',
        type: 'pixelData',
        path: '/textures/text.jpg',
    },
]
