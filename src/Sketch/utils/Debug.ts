import GUI from 'lil-gui'
import Stats from 'stats.js'

export class Debug {
    gui: GUI
    stats: Stats
    constructor() {
        this.gui = new GUI()
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)
    }
}
