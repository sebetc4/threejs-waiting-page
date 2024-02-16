import { sourceNames, sourceTypes } from "../Sketch/sources";

export type SourceType = typeof sourceTypes[number];

export type SourceName = typeof sourceNames[number];

export type Sources = Source[]

export type Source = {
    name: SourceName
    type: SourceType
    path: string | string[]
}

export type SourceItems = Map<SourceName, any>

export type PixelDataImage = {
    data: Uint8ClampedArray
    width: number
    height: number
}