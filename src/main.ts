import './style.css'
import { Sketch } from './Sketch/Sketch'

const webglContainer = document.getElementById('webgl-container') as HTMLDivElement

new Sketch(webglContainer)
