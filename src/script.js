import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'
import { house, door, walls, roof } from "./house";
import floor from './floor'
import { createBushes } from "./bushes.js";
import graves from './graves.js'
import { ghost1, ghost2, ghost3 } from "./ghosts.js";


/**
 * Base
 */


// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


scene.add(floor)
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

scene.add(house)


// Create bushes and add them to the house
createBushes(house);

scene.add(graves)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, door.geometry.parameters.height, walls.geometry.parameters.height)
house.add(doorLight)

// Ghosts
scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Shadows
 */

// directionalLight.castShadow = true

// walls.castShadow = true
walls.receiveShadow = true
// roof.castShadow = true
floor.receiveShadow = true


const shadowsFolder = gui.addFolder("Shadows");

shadowsFolder.add(directionalLight, "castShadow").name("Directional Light Shadow");
shadowsFolder.add(ghost1, "castShadow").name("Ghost 1 Shadow");
shadowsFolder.add(ghost2, "castShadow").name("Ghost 2 Shadow");
shadowsFolder.add(ghost3, "castShadow").name("Ghost 3 Shadow");
shadowsFolder.add(walls, "castShadow").name("Walls Shadow");
shadowsFolder.add(roof, "castShadow").name("Roof Shadow");


for(const grave of graves.children){
    grave.castShadow = true
    grave.receiveShadow = true
}


// Mappings change the shadow settings of those which cast shadows in order to improve performance
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20



/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms.turbidity.value = 10
sky.material.uniforms.rayleigh.value = 3
sky.material.uniforms.mieCoefficient.value = 0.1
sky.material.uniforms.mieDirectionalG.value = 0.95
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95)


/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1)







/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()


    
    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)


    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    
    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()