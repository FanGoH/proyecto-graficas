import * as three from 'three'

export const setupRenderer = (renderer, scene, camera) => {
    renderer.setSize(window.innerWidth/2, window.innerHeight/2)
    renderer.physicallyCorrectLights = true
    renderer.setClearColor(0xffffff, 0)

    camera.position.z = 5;
    const animate = () => {
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    };
    animate()
}