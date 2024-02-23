import { Sketch } from '../Sketch'
import { Circle } from './Circle/Circle'
import { Resources } from '../utils'
import { Logo } from './Logo/Logo'

export class Particules {
    resources: Resources
    circle?: Circle
    logo?: Logo

    constructor(private sketch: Sketch) {
        this.resources = this.sketch.resources
        this.resources.on('loaded', () => {
            this.logo = new Logo(this.sketch)
            this.circle = new Circle(this.sketch)
        }
        )
    }

    handlePointerMove() {
        this.circle?.handlePointerMove()
        this.logo?.handlePointerMove()
    }

    update() {
        this.circle?.update()
        this.logo?.update()
    }
}
