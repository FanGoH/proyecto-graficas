import * as three from 'three'

export const directionalLight = (scene) => {
	const color = 0x888888
	const intensity = 1
    
	const light = new three.DirectionalLight(color, intensity)
	light.position.set(10, 10, 0)
	light.target.position.set(-10, -10, 0)
	light.name="Directional"
	scene.add(light)
	scene.add(light.target)

	return light
};