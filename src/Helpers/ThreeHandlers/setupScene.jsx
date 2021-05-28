import { directionalLight } from "../directionalLight"
import { hemisphereLight } from "../hemisphereLight"


export const setupScene = (scene) => {
    hemisphereLight(scene)
    directionalLight(scene)
}