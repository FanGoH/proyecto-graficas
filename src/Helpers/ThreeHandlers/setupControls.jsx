import * as three from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const setupControls = (camera, canvasDiv) => {
    const controls = new OrbitControls(camera, canvasDiv)
    controls.target.set(0, 0, 0)
    controls.update()
    return controls
}