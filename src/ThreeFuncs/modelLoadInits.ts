import { useState, useRef, RefObject, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import * as THREE from "three";
import useWindowSize from "../Hooks/useWindowSize";

export const useThreeJSRefs = (offset: number) => {
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const [renderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
	const [scene] = useState<THREE.Scene>(new THREE.Scene());

	const [width, height] = useWindowSize(offset);

	return { cameraRef, renderer, width, height, scene };
};

export type ThreeRefs = ReturnType<typeof useThreeJSRefs>;

export const hemisphereLight = (scene: THREE.Scene) => {
	const skyColor = 0xb1e1ff;
	const ground = 0xf5fffe;
	const intensity = 5;

	const light = new THREE.HemisphereLight(skyColor, ground, intensity);

	scene.add(light);
};

export const directionalLight = (scene: THREE.Scene) => {
	const COLOR = 0x888888;
	const intsnity = 0.2;
	const light = new THREE.DirectionalLight(COLOR, intsnity);
	light.position.set(0, 10, 0);
	light.target.position.set(-5, 0, 0);

	scene.add(light);
	scene.add(light.target);
};

export const startCamera = () => {
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	camera.position.set(0, 3, 0);
	camera.zoom = 3;

	return camera;
};

const loadModel = async (scene: THREE.Scene) => {
	var oloader = new OBJLoader();
	const mtlLoad = new MTLLoader();

	const materials = await mtlLoad.loadAsync(
		`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/rtx%203080.mtl`
	);
	materials.preload();

	oloader.setMaterials(materials);

	const modelToLoad = await oloader.loadAsync(
		`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/rtx%203080.obj`
	);

	scene.add(modelToLoad);

	return [modelToLoad, materials];
};

export const useThreeInit = (
	threeRefs: ThreeRefs,
	divToMount: RefObject<HTMLDivElement>
) => {
	const { scene, cameraRef, renderer } = threeRefs;

	useEffect(() => {
		if (divToMount.current === null) {
			return;
		}

		cameraRef.current = startCamera();
		const camera = cameraRef.current;

		hemisphereLight(scene);

		directionalLight(scene);

		renderer.setSize(window.innerWidth, window.innerHeight);

		divToMount.current.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, divToMount.current);
		controls.target.set(0, 0, 0);

		controls.update();
		//scene.background = new THREE.Color("white");

		const geometry = new THREE.BoxGeometry(1, 1, 1);

		const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		camera.position.z = 5;
		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		loadModel(scene);

		///		=== THREE.JS EXAMPLE CODE END ===
	}, [scene, cameraRef, divToMount, renderer]);
};

export const useResizableRenderer = ({
	cameraRef,
	renderer,
	height,
	width,
}: ThreeRefs) => {
	useEffect(() => {
		renderer.setSize(width, height);
		if (cameraRef.current !== null) {
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
		}
	}, [width, height, renderer, cameraRef]);
};
