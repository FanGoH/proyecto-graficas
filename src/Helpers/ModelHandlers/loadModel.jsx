import * as three from 'three'
import { loadMtl } from './loadMtl'
import { loadObj } from './loadObj'
import { loadTex } from './loadTex'

export const loadModel = async (bg, modeldata, texture, material, color="blue") => {
    const [model, tex, mat] = await Promise.all([loadObj(modeldata.src), loadTex(texture), loadMtl(material)])

    // if (mat !== undefined)
    //     mat.preload()
    console.log(color)
    const [primaryTexture, secondaryTexture] = tex

    primaryTexture.wrapS = primaryTexture.wrapT = three.RepeatWrapping

    model.traverse(async (c) => {
        if (
            (c.name === "ImageHolder" ||
                c.name === "Sticker") &&
            c instanceof three.Mesh
        ) {
            c.material = new three.MeshPhongMaterial({
                map: primaryTexture,    
            });

            c.material.envMap = bg;
            c.material.combine = three.MixOperation;
            c.material.reflectivity = modeldata.props.primaryReflectivity;
            c.material.shininess = modeldata.props.primaryShininess;
        } else if (c instanceof three.Mesh) {
            c.material = new three.MeshPhongMaterial({
                color: new three.Color(color.toLowerCase())
            });
            c.material.envMap = bg;
            c.material.combine = three.MixOperation;
            c.material.reflectivity = modeldata.props.secondaryReflectivity;
            c.material.shininess = modeldata.props.secondaryShininess;
        }
    })


    return model
}