import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'

export const loadMtl = async (src) => {
    if (src === undefined)
        return undefined
    console.log(src)
    let mtlLoader = new MTLLoader()
    const material = await mtlLoader.loadAsync(src)
    return material;
}