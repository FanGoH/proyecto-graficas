import * as three from 'three'
import { loadMtl } from './loadMtl'
import { loadObj } from './loadObj'
import { loadTex } from './loadTex'

export const loadModel = async (bg, modeldata, texture, material, color="blue", secondaryColor="yellow") => {
    const [model, tex, mat] = await Promise.all([loadObj(modeldata.src), loadTex(texture), loadMtl(material)])

    // if (mat !== undefined)
    //     mat.preload()
   
    const [primaryTexture, secondaryTexture, ternaryTexture] = tex
    const primarySections = ["Hat","sleeve_cuffs","bottom_cuff","Bag","FrontViewPad","ImageSr","rope1","rope2","BottleCap"]
    primaryTexture.wrapS = primaryTexture.wrapT = three.RepeatWrapping

    model.traverse(async (c) => {
        console.log(c.name)
        if (  c instanceof three.Mesh){
            
            if(c.name ==="ImageHolder" || c.name==="Sticker") {
                c.material = new three.MeshPhongMaterial({
                    map: primaryTexture,    
                });
                c.material.envMap=bg;
                c.material.combine = three.MixOperation;
                c.material.reflectivity = modeldata.props.primaryReflectivity;
                c.material.shininess = modeldata.props.primaryShininess;
    
            }else if (primarySections.includes(c.name)) {
                c.material = new three.MeshPhongMaterial({
                    color: new three.Color(color),
                    map: secondaryTexture,
                   
                });
                c.material.envMap =bg;
                c.material.combine = three.MixOperation;
                c.material.reflectivity =modeldata.props.primaryReflectivity;
                c.material.shininess = modeldata.props.primaryShininess;
            } else   {
                c.material = new three.MeshPhongMaterial({
                    color: new three.Color(secondaryColor),
                    map: ternaryTexture,
                });
                c.material.envMap =bg;
                c.material.combine = three.MixOperation;
                c.material.reflectivity = modeldata.props.secondaryReflectivity;
                c.material.shininess = modeldata.props.secondaryShininess;
            }
        }
        
    })


    return model
}