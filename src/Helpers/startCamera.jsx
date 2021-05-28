import * as three from 'three'

export const startCamera = () => {
    const camera = new three.PerspectiveCamera(
        75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)
    camera.position.set(0, 3, 0)
    camera.zoom = 3
    return camera
}