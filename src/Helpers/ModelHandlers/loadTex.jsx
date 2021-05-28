import {TextureLoader} from 'three'
import * as three from 'three'

export const loadTex = async (src) => {
    if (src === undefined)
        return undefined
    console.log(src)
    return await Promise.all(src.map((v) => new TextureLoader().loadAsync(v)))
}