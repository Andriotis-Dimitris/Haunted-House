import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";
import { house, door, walls, roof } from "./house";
import floor from "./floor";
import { createBushes } from "./bushes.js";
import graves from "./graves.js";
import { ghosts } from "./ghosts.js";

/**
 * Base
 */

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

scene.add(floor);
gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

scene.add(house);

// Create bushes and add them to the house
createBushes(house);

scene.add(graves);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(
  0,
  door.geometry.parameters.height,
  walls.geometry.parameters.height
);
house.add(doorLight);

// Ghosts
scene.add(ghosts);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Shadows
 */
directionalLight.castShadow = true;

// walls.castShadow = true
walls.receiveShadow = true;
// roof.castShadow = true
floor.receiveShadow = true;

const shadowsFolder = gui.addFolder("Shadows");

const ghostsFolder = shadowsFolder.addFolder("Ghosts");

ghosts.children.forEach((ghost, index) => {
  const ghostFolder = ghostsFolder.addFolder(`Ghost ${index + 1}`);

  ghostFolder.add(ghost, "castShadow").name("Cast Shadow");

  ghostFolder
    .add(ghost.shadow.mapSize, "width")
    .min(128)
    .max(1024)
    .step(128) // Ensures it steps in reasonable intervals
    .name("Shadow Width")
    .onChange((value) => {
      ghost.shadow.mapSize.width = value;
    })
    .setValue(128); // Set default value

  ghostFolder
    .add(ghost.shadow.mapSize, "height")
    .min(128)
    .max(1024)
    .step(128) // Ensures it steps in reasonable intervals
    .name("Shadow Height")
    .onChange((value) => {
      ghost.shadow.mapSize.height = value;
    })
    .setValue(128); // Set default value
});


for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Directional Light Shadow settings
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms.turbidity.value = 10;
sky.material.uniforms.rayleigh.value = 3;
sky.material.uniforms.mieCoefficient.value = 0.1;
sky.material.uniforms.mieDirectionalG.value = 0.95;
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2("#04343f", 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghosts
  ghosts.children.forEach((ghost, index) => {
    const angle = elapsedTime * (0.5 - index * 0.12);
    ghost.position.x = Math.cos(angle) * (4 + index);
    ghost.position.z = Math.sin(angle) * (4 + index);
    ghost.position.y =
      Math.sin(angle) * Math.sin(angle * 2.34) * Math.sin(angle * 3.45);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
