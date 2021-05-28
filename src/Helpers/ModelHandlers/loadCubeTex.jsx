import * as three from 'three'

export const loadCubeTex = async (src) => {
    if (src === undefined)
        return undefined
    console.log(src)
    return new three.CubeTextureLoader().loadAsync(src)
}