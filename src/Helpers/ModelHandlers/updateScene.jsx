import * as three from 'three'
import { loadModel } from './loadModel'
import { MODELS } from '../../DataSources/models'
import { TEXTURES } from '../../DataSources/textures'
import { MATERIALS } from '../../DataSources/materials'

export const updateScene = async (scene, prevModel, modelId, materialId, texturesrc, bg, color, secondaryColor) => {
    scene.remove(await prevModel)
    const model = await loadModel(bg, MODELS[modelId], texturesrc, MATERIALS[materialId], color, secondaryColor)
    scene.add(model)

    return model
}