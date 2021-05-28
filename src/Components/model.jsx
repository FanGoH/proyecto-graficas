import React, { useEffect, useRef, useState } from 'react';
import * as three from 'three'
import { setupScene } from '../Helpers/ThreeHandlers/setupScene';
import { startCamera } from '../Helpers/startCamera';

import useWindowSize from './../Hooks/useWindowSize'
import { setupControls } from '../Helpers/ThreeHandlers/setupControls';
import { setupRenderer } from '../Helpers/ThreeHandlers/setupRenderer';
import { TEXTURES } from '../DataSources/textures';
import { loadTex } from '../Helpers/ModelHandlers/loadTex';
import { loadCubeTex } from '../Helpers/ModelHandlers/loadCubeTex';
import { updateScene } from '../Helpers/ModelHandlers/updateScene';
import { loadModel } from '../Helpers/ModelHandlers/loadModel';
import { MODELS } from '../DataSources/models';
import { MATERIALS } from '../DataSources/materials';
import { BACKGROUNDS } from '../DataSources/backgrounds';
import { COLORS } from '../DataSources/colors';

export default function Model() {
    const canvasDiv = useRef(null)
    const controls = useRef(null)
    const model = useRef(null)
    const bg = useRef(null)

    const renderer = useRef(new three.WebGLRenderer())
    const scene = useRef(new three.Scene())
    const camera = useRef(startCamera())
    const [w, h] = useWindowSize(140)

    const [background, setBackground] = useState(null)
    const [modelId, setModelId] = useState(Object.keys(MODELS)[0])
    const [colorId, setColorId] = useState(Object.keys(COLORS)[0])
    const [textureId, setTextureId] = useState(TEXTURES[Object.keys(TEXTURES)[0]])
    const [materialId, setMaterialId] = useState(Object.keys(MATERIALS)[0])

    useEffect(async() => {
        setupScene(scene.current)
        canvasDiv.current.appendChild(renderer.current.domElement)
        controls.current = setupControls(camera.current, canvasDiv.current)
        setupRenderer(renderer.current, scene.current, camera.current)
        bg.current = await loadCubeTex(BACKGROUNDS[background])
        setBackground(Object.keys(BACKGROUNDS)[0])
    }, [])

    useEffect(async () => {
        bg.current = await loadCubeTex(BACKGROUNDS[background])
        scene.current.background=bg.current
    }, [background])

    useEffect(async () => {
        if (bg.current === null)
            bg.current = await loadCubeTex(BACKGROUNDS[background])
        model.current = updateScene(scene.current, model.current, modelId, materialId, textureId, bg.current, colorId)
    }, [modelId, colorId, textureId])

    return (
        <>  
            <select onChange={(e) => setBackground(e.target.value)}>
                {Object.keys(BACKGROUNDS).map((key) => (
					<option key={key} value={key}>
						{key}
					</option>
				))}
            </select>
            <select onChange={(e) => setModelId(e.target.value)}>
                {Object.keys(MODELS).map((key) => (
					<option key={key} value={key}>
						{key}
					</option>
				))}
            </select>
            <select onChange={(e) => setColorId(e.target.value)}>
                {COLORS.map((v) => (
					<option key={v} value={v}>
						{v}
					</option>
				))}
            </select>
            <input type="text" name="" id="" onChange={(e) => setTextureId([e.target.value])} placeholder="Ingrese la url de la imagen personalziada"/>
            <div ref={canvasDiv}></div>
        </>
    )
}

// https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/BG/Muelle/negx.png?raw=true