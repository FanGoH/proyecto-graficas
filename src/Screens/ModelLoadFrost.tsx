import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
	ClampToEdgeWrapping,
	ImageLoader,
	MeshPhongMaterial,
	TextureLoader,
	Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { SAMPLES } from "./SAMPLES";
import { MODELS } from "./MODELS";
import {
	useThreeJSRefs,
	startCamera,
	hemisphereLight,
	directionalLight,
	useResizableRenderer,
} from "../ThreeFuncs/modelLoadInits";

export const TestComponent = ({
	modelName,
}: {
	modelName: keyof typeof MODELS;
}) => {
	const divToMount = useRef<HTMLDivElement>(null);
	const cubeRef = useRef<THREE.Mesh<any, any> | null>(null);

	const threeRefs = useThreeJSRefs(140);
	const { cameraRef, renderer, scene } = threeRefs;

	//	const [color, setColor] = useState("");
	const oloader = new OBJLoader();
	const mtlLoad = new MTLLoader();
	let Model: THREE.Group;
	var texture: THREE.Texture;
	var texturess: THREE.Texture;
	// const [currentFace, setCurrentFace] =
	// 	useState<keyof typeof SAMPLES>("lego");

	const [currentMod] = useState<keyof typeof MODELS>(modelName);

	// const changingColor: React.ChangeEventHandler<HTMLInputElement> = (e) => {
	// 	setColor(e.target.value);
	// };

	// const commitColor: React.MouseEventHandler<HTMLButtonElement> = () => {
	// 	if (cubeRef.current!.material.length) {
	// 		cubeRef.current!.material.forEach((mat: any, idx: number) => {
	// 			if (idx === 4) {
	// 				return;
	// 			}

	// 			mat.color.set(color);
	// 		});
	// 	} else {
	// 		cubeRef.current!.material.color.set(color);
	// 	}
	// };

	// const changeFace: React.MouseEventHandler<HTMLButtonElement> = () => {
	// 	//console.log(Model);
	// };
	const loadModel = async () => {
		const materials = await mtlLoad.loadAsync(
			`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/kurikiribocho.mtl`
		);

		materials.preload();

		//oloader.setMaterials(materials);
		var img = new THREE.ImageLoader().loadAsync(
			"https://i.imgur.com/uyrLZpB.jpg"
		);
		texture = await new TextureLoader().loadAsync(
			"https://i.imgur.com/uyrLZpB.jpg"
		);
		Model = await oloader.loadAsync(MODELS[modelName]);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		Model.traverse(function (child) {
			//console.log(child.name);
			if (
				child.name === "Image_Circle.002" &&
				child instanceof THREE.Mesh
			) {
				var size = new Vector3();
				var boundingBox = new THREE.Box3().setFromObject(child);
				boundingBox.getSize(size);
				//console.log(size);
				// var dimx = Math.abs(boundingBox.min.x - boundingBox.max.x);
				// var dimy = Math.abs(boundingBox.min.y - boundingBox.max.y);
				// var dimz = Math.abs(boundingBox.min.z - boundingBox.max.z);
				// console.log(dimx, dimy, dimz);
				// console.log(texture.image.height / dimx / 1000);
				// console.log(texture.image.height, dimz);
				// console.log(dimz / texture.image.height);
				texture.repeat.set(2.1, 3.6);

				child.material = new THREE.MeshPhongMaterial({ map: texture });
				//	const { width, height } = child.material.map.image;

				// var repeatX, repeatY;
				// texture.wrapS = THREE.ClampToEdgeWrapping;
				// texture.wrapT = THREE.RepeatWrapping;
				// repeatX =
				// 	((boundingBox.max.x - boundingBox.min.x) * height) /
				// 	((boundingBox.max.y - boundingBox.min.y) * width);
				// repeatY = 1;
				// texture.repeat.set(repeatX, repeatY);
				// texture.offset.x = ((repeatX - 1) / 2) * -1;

				child.material.envMap = texturess;
				child.material.combine = THREE.MixOperation;
				child.material.reflectivity = 0.0;
				child.material.shininess = 0.3;
				//console.log(child.geometry);
			} else if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial({
					color: new THREE.Color(0xff0000),
				});
				child.material.envMap = texturess;
				child.material.combine = THREE.MixOperation;
				child.material.reflectivity = 0.01;
				child.material.shininess = 60;
			}
		});

		scene.add(Model);

		return [Model, materials];
	};

	const changeModel: React.MouseEventHandler<HTMLButtonElement> =
		async () => {
			//console.log(MODELS[currentMod]);
			console.log(currentMod);
			//	scene.remove(Model);
			//loadModel();
		};

	useEffect(() => {
		if (divToMount.current === null) {
			return;
		}
		// === THREE.JS CODE START ===

		threeRefs.scene = new THREE.Scene();

		const loader = new THREE.CubeTextureLoader();
		const texturess = loader.load([
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg",
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg",
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg",
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg",
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg",
			"https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg",
		]);
		scene.background = texturess;

		cameraRef.current = startCamera();
		const camera = cameraRef.current;

		hemisphereLight(scene);

		directionalLight(scene);

		renderer.setSize(window.innerWidth, window.innerHeight);

		divToMount.current.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, divToMount.current);
		controls.target.set(0, 0, 0);

		controls.update();
		//const geometry = new THREE.BoxGeometry(1, 1, 1);

		//const sphereGeometry = new THREE.SphereGeometry(1);

		// const texture = new THREE.TextureLoader().load(
		// 	`${process.env.PUBLIC_URL}/image/lego.jpg`
		// );

		// const image = new THREE.MeshBasicMaterial({
		// 	map: texture,
		// });
		// const color = new THREE.MeshBasicMaterial({
		// 	color: 0x00ff00,
		// });

		// const firstCube = new THREE.Mesh(geometry, image);
		var tex;
		const materials = [];
		for (let i = 0; i < 6; i++) {
			const img = new Image();
			img.src = `${process.env.PUBLIC_URL}/image/lego.jpg`;
			tex = new THREE.TextureLoader().load(img.src);

			const mat = new THREE.MeshBasicMaterial({
				...(i !== 4 && { color: 0xffffff }),
				...(i === 4 && { map: tex }),
			});
			materials.push(mat);
		}
		renderer.physicallyCorrectLights = true;
		const sgeometry = new THREE.SphereGeometry(1, 60, 60);
		const currentMesh = new THREE.MeshPhongMaterial();

		currentMesh.envMap = texturess;
		currentMesh.combine = THREE.MixOperation;
		currentMesh.reflectivity = 0.1;
		currentMesh.shininess = 0;

		currentMesh.map = new TextureLoader().load(SAMPLES["lego"]);

		const cube = new THREE.Mesh(sgeometry, currentMesh);
		cube.rotation.set(0.5, 0.4, 0);
		cubeRef.current = cube;

		renderer.setClearColor(0xffffff, 0);
		//	scene.background = new THREE.Color("white");
		camera.position.z = 5;
		const animate = () => {
			requestAnimationFrame(animate);
			// cube.rotation.x += 0.01;
			// cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		};
		animate();

		loadModel();

		controls.update();

		// === THREE.JS EXAMPLE CODE END ===
	}, [renderer]);

	useResizableRenderer(threeRefs);

	return (
		<>
			{/* <input type='color' onInput={changingColor} /> {color}
			<button onClick={commitColor}> Commit color</button> */}
			{/* <select
				onChange={(e) => {
					setCurrentFace(e.target.value as keyof typeof SAMPLES);
				}}>
				{Object.keys(SAMPLES).map((key) => (
					<option key={key}>{key}</option>
				))}
			</select>
			<button onClick={changeFace}>Commit model change</button> */}
			<div ref={divToMount} />
		</>
	);
};
