import * as three from 'three'

export const hemisphereLight = (scene) => {
    const skyColor = 0xb1e1ff;
	const ground = 0xf5fffe;
	const intensity = 1;

	const light = new three.HemisphereLight(skyColor, ground, intensity);

	scene.add(light);
}

