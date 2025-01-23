import * as THREE from "three";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const ghosts = new THREE.Group();
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
ghosts.add(ghost1, ghost2, ghost3);

/**
 * Shadows
 */
const shadowAttributes = {
  mapSize: { width: 256, height: 256 },
  camera: { far: 10 },
};

ghosts.children.forEach((ghost) => {
//   ghost.castShadow = true;
  ghost.shadow.mapSize.width = shadowAttributes.mapSize.width;
  ghost.shadow.mapSize.height = shadowAttributes.mapSize.height;
  ghost.shadow.camera.far = shadowAttributes.camera.far;
});

export { ghosts };
