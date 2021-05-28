import { directionalLight } from "../directionalLight"
import { hemisphereLight } from "../hemisphereLight"


export const setupScene = (scene) => {
    return [hemisphereLight(scene),
    directionalLight(scene)]
}