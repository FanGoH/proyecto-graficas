import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

export const loadObj = async (src) => {
    if (src === undefined)
        return undefined
    console.log(src)
    let objLoader = new OBJLoader()
    const model = await objLoader.loadAsync(src)
    return model;
}