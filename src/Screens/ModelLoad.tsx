import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import useWindowSize from "../Hooks/useWindowSize";
import { SAMPLES } from "./SAMPLES";

export const TestComponent = () => {
	const divToMount = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const [renderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
	const [width, height] = useWindowSize(140);

	useEffect(() => {
		if (divToMount.current === null) {
			return;
		}
		// === THREE.JS CODE START ===
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		camera.position.set(0, 3, 0);

		cameraRef.current = camera;

		{
			const skyColor = 0xb1e1ff;
			const ground = 0xf5fffe;
			const intensity = 5;

			const light = new THREE.HemisphereLight(
				skyColor,
				ground,
				intensity
			);

			scene.add(light);
		}

		{
			const COLOR = 0x888888;
			const intsnity = 0.2;
			const light = new THREE.DirectionalLight(COLOR, intsnity);
			light.position.set(0, 10, 0);
			light.target.position.set(-5, 0, 0);

			scene.add(light);
			scene.add(light.target);
		}

		renderer.setSize(window.innerWidth, window.innerHeight);

		divToMount.current.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, divToMount.current);
		controls.target.set(0, 0, 0);

		controls.update();
		scene.background = new THREE.Color("white");

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube	);
		camera.position.z = 5;
		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		const loadModel = async () => {
			var oloader = new OBJLoader();
			const mtlLoad = new MTLLoader();

			const materials = await mtlLoad.loadAsync(
				`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/rtx%203080.mtl`
			);
			materials.preload();

			oloader.setMaterials(materials);

			const FROSTMODEL = await oloader.loadAsync(
				`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/rtx%203080.obj`
			);

			scene.add(FROSTMODEL);

			return [FROSTMODEL, materials];
		};

		loadModel();
		camera.zoom = 20;
		controls.update();

		///		=== THREE.JS EXAMPLE CODE END ===
	}, [renderer]);

	useEffect(() => {
		renderer.setSize(width, height);
		if (cameraRef.current !== null) {
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
		}
	}, [width, height, renderer, cameraRef]);

	return (
		<>
			<div ref={divToMount} />
		</>
	);
};
