import * as THREE from "three";




/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);



/**
 * Shadows
 */

// ghost1.castShadow = true
// ghost2.castShadow = true
// ghost3.castShadow = true


ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

export { ghost1, ghost2, ghost3 }