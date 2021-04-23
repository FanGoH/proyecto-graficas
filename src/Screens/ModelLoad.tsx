import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import useWindowSize from "../Hooks/useWindowSize";

// let FROSTMODEL: THREE.Object3D;

// const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
// camera.position.set(0, 0, 5);

// const controls = new OrbitControls(camera);
// controls.target.set(0, 0, 0);
// controls.update();

// const scene = new THREE.Scene();
// scene.background = new THREE.Color("black");

// {
// 	const skyColor = 0xb1e1ff;
// 	const ground = 0xf5fffe;
// 	const intensity = 1.3;

// 	const light = new THREE.HemisphereLight(skyColor, ground, intensity);

// 	scene.add(light);
// }

// {
// 	const COLOR = 0x888888;
// 	const intsnity = 0.2;
// 	const light = new THREE.DirectionalLight(COLOR, intsnity);
// 	light.position.set(0, 10, 0);
// 	light.target.position.set(-5, 0, 0);

// 	scene.add(light);
// 	scene.add(light.target);
// }

// function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
// 	const canvas = renderer.domElement;
// 	const width = canvas.clientWidth;
// 	const height = canvas.clientHeight;
// 	const needResize = canvas.width !== width || canvas.height !== height;
// 	if (needResize) {
// 		renderer.setSize(width, height, false);
// 	}
// 	return needResize;
// }

// function render() {
// 	if (resizeRendererToDisplaySize(renderer)) {
// 		const canvas = renderer.domElement;
// 		camera.aspect = canvas.clientWidth / canvas.clientHeight;
// 		camera.updateProjectionMatrix();
// 	}
// 	renderer.render(scene, camera);
// 	requestAnimationFrame(render);
// }

// requestAnimationFrame(render);

// const loadModel = async () => {
// 	var oloader = new OBJLoader();
// 	const mtlLoad = new MTLLoader();

// 	const materials = await mtlLoad.loadAsync(
// 		`https://raw.githubusercontent.com/FanGoH/practica-2-frost-model/main/frosto/frost.mtl?token=ANJ27HY2LR65RKBZPLAEYWLAPW7OM`
// 	);
// 	materials.preload();

// 	oloader.setMaterials(materials);

// 	FROSTMODEL = await oloader.loadAsync(
// 		`https://raw.githubusercontent.com/FanGoH/practica-2-frost-model/main/frosto/frost.obj?token=ANJ27H6XROLMT7OEEE7JCBLAPW7KM`
// 	);

// 	console.log(FROSTMODEL);

// 	scene.add(FROSTMODEL);
// };

// loadModel();

export const TestComponent = () => {
	const divToMount = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const [renderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
	const [width, height] = useWindowSize(140);
	const [color, setColor] = useState("");

	const changingColor: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setColor(e.target.value);
	};

	useEffect(() => {
		// === THREE.JS CODE START ===
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		cameraRef.current = camera;

		renderer.setSize(window.innerWidth, window.innerHeight);
		if (divToMount.current !== null) {
			divToMount.current.appendChild(renderer.domElement);
		}
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		camera.position.z = 5;
		const animate = () => {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		};
		animate();
		// === THREE.JS EXAMPLE CODE END ===
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
			<input type='color' onInput={changingColor} /> {color}
			<div ref={divToMount} />
		</>
	);
};
