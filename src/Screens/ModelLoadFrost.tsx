import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ImageLoader, MeshPhongMaterial, Scene, TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import useWindowSize from "../Hooks/useWindowSize";
import { SAMPLES } from "./SAMPLES";

export const TestComponent = () => {
	const divToMount = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const cubeRef = useRef<THREE.Mesh<any, any> | null>(null);
	const [renderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
	const [width, height] = useWindowSize(140);
	const [color, setColor] = useState("");

	const [currentFace, setCurrentFace] = useState<keyof typeof SAMPLES>(
		"lego"
	);
	
	var currentMesh: MeshPhongMaterial;
	const changingColor: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setColor(e.target.value);
	};

	const commitColor: React.MouseEventHandler<HTMLButtonElement> = () => {
		if (cubeRef.current!.material.length) {
			cubeRef.current!.material.forEach((mat: any, idx: number) => {
				if (idx === 4) {
					return;
				}

				mat.color.set(color);
			});
		} else {
			cubeRef.current!.material.color.set(color);
		}
	};

	const changeFace: React.MouseEventHandler<HTMLButtonElement> = () => {
		if (cubeRef.current!.material.length) {
			cubeRef.current!.material[4].map = new THREE.TextureLoader().load(
				SAMPLES[currentFace]
			);
		} else {
			
			var material =new THREE.TextureLoader().load(SAMPLES[currentFace]);

			
			cubeRef.current!.material.map = material;
			
		}
	};
	
	useEffect(() => {
		if (divToMount.current === null) {
			return;
		}
		// === THREE.JS CODE START ===
		const scene = new THREE.Scene();
		const loader = new THREE.CubeTextureLoader();
		const texturess = loader.load([
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
			'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
		  ]);
		scene.background = texturess;
		  console.log(scene.background);
		//esto lo acababa de ponder so, me di cuenta
		
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.set(0, 0, 5);
		cameraRef.current = camera;

		{
			const skyColor = 0xb1e1ff;
			const ground = 0xFF5733;
			const intensity = 1.3;

			const light = new THREE.HemisphereLight(
				skyColor,
				ground,
				intensity
			);

			scene.add(light);
		}

		{
			const COLOR = 0xb1e1ff;
			const intsnity = 20;
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
		const geometry = new THREE.BoxGeometry(1, 1, 1);

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
		const sgeometry = new THREE.SphereGeometry(1,60,60);
		currentMesh = new THREE.MeshPhongMaterial();
		var envgen =new THREE.PMREMGenerator(renderer);
		
		currentMesh.envMap = texturess;
		currentMesh.combine = THREE.MixOperation;
		currentMesh.reflectivity = 0.1;
		currentMesh.shininess = 0;
	
		currentMesh.map = new TextureLoader().load(SAMPLES['lego'])
		

		const cube = new THREE.Mesh(sgeometry, currentMesh);
		cube.rotation.set(0.5, 0.4, 0);
		cubeRef.current = cube;
		
		renderer.setClearColor(0xFFFFFF,0);
		console.log(cube)
		scene.add(cube);
	//	scene.background = new THREE.Color("white");
		camera.position.z = 5;
		const animate = () => {
			requestAnimationFrame(animate);
			// cube.rotation.x += 0.01;
			// cube.rotation.y += 0.01;
			renderer.render(scene, camera);
			
		};
		animate();
		
		const loadModel = async () => {
			var oloader = new OBJLoader();
			const mtlLoad = new MTLLoader();

			const materials = await mtlLoad.loadAsync(
				`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/kurikiribocho.mtl`
			);


			materials.preload();

			//oloader.setMaterials(materials);
			var  texture = await new TextureLoader().loadAsync("https://d500.epimg.net/cincodias/imagenes/2018/11/13/lifestyle/1542113135_776401_1542116070_noticia_normal.jpg")
			const FROSTMODEL = (await oloader.loadAsync(
				`https://raw.githubusercontent.com/ManmadeArc/GraficasYVisualizacion/main/kurikiribocho.obj`))
			
				FROSTMODEL.traverse(function ( child ) {

					if ( child instanceof THREE.Mesh ) {
				
						child.material.map = texture;
						child.material.envMap = texturess;
				
					}
				
				} );
			 
			FROSTMODEL.scale.set(0.2,0.2,0.2);
			
			scene.add(FROSTMODEL );

			return [FROSTMODEL, materials];
		};

		loadModel();

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
			<button onClick={commitColor}> Commit color</button>
			<div ref={divToMount} />
			<select
				onChange={(e) => {
					setCurrentFace(e.target.value as keyof typeof SAMPLES);
				}}>
				{Object.keys(SAMPLES).map((key) => (
					<option key={key}>{key}</option>
				))}
			</select>
			<button onClick={changeFace}>Commit model change</button>
		</>
	);
};
