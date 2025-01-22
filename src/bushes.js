import * as THREE from "three";

export function createBushes(house) {
    const textureLoader = new THREE.TextureLoader()

  // Bushes - Textures
  const bushColorTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
  );
  const bushARMTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
  );
  const bushNormalTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
  );

  bushColorTexture.colorSpace = THREE.SRGBColorSpace;
  bushColorTexture.repeat.set(2, 1);
  bushARMTexture.repeat.set(2, 1);
  bushNormalTexture.repeat.set(2, 1);

  bushColorTexture.wrapS = THREE.RepeatWrapping;
  bushARMTexture.wrapS = THREE.RepeatWrapping;
  bushNormalTexture.wrapS = THREE.RepeatWrapping;

  // Bushes
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({
    color: "#ccffcc",
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  });

  const bushes = [];

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);
  bush1.rotation.x = -0.75;
  bushes.push(bush1);

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);
  bush2.rotation.x = -0.75;
  bushes.push(bush2);

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);
  bush3.rotation.x = -0.75;
  bushes.push(bush3);

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);
  bush4.rotation.x = -0.75;
  bushes.push(bush4);

  house.add(...bushes);
}
