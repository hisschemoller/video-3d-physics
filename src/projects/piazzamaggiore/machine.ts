/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { ExtendedObject3D, THREE } from 'enable3d';
import Scene from './scene';
import addWheel from './wheel';

async function createMachine(
  scene3d: Scene,
  patternDuration: number,
) {
  // WHEEL 5
  const scale = 0.6;
  const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration, 1);
  wheel.position.set(5.0, -1.2, -1.9);
  wheel.scale.set(scale, scale, 4);

  // SPHERE
  const url = '../assets/projects/test/testimage3d.jpg';
  const texture = new THREE.TextureLoader().load(url);
  const geometry = new THREE.SphereBufferGeometry(1);
  console.log('geometry', geometry);
  geometry.computeBoundingBox();
  console.log('boundingBox', geometry.boundingBox);
  const positionAttribute = geometry.getAttribute('position');
  console.log('positionAttribute', positionAttribute);
  const vertex = new THREE.Vector3();
  for (let i = 0; i < positionAttribute.count; i += 1) {
    vertex.fromBufferAttribute(positionAttribute, i);
    const x = vertex.x + (Math.abs(vertex.y) * 0.5);
    positionAttribute.setXYZ(i, x, vertex.y * 2, vertex.z);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshPhongMaterial({
    color: 0xb6a385, shininess: 0.4, map: texture, flatShading: false,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  const obj3d = new ExtendedObject3D();
  obj3d.position.set(1.5, 4.1, -2.1);
  obj3d.add(sphere);
  // scene3d.scene.add(obj3d);
  // scene3d.physics.add.existing(obj3d, {
  //   mass: 1,
  // });
}

export async function createMachines(
  scene3d: Scene,
  patternDuration: number,
  stepDuration: number,
) {
  // { // WHEEL
  //   const scale = 0.34;
  //   const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
  //   wheel.position.set(-8.0, -1., -4.5);
  //   wheel.scale.set(scale, scale, 2);
  // }

  // { // WHEEL 2
  //   const scale = 0.28;
  //   const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
  //   wheel.position.set(-5.3, -1.0, -4.7);
  //   wheel.scale.set(scale, scale, 2);
  // }

  // { // WHEEL 3
  //   const scale = 0.5;
  //   const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
  //   wheel.position.set(-2.2, 0.4, -2.7);
  //   wheel.scale.set(scale, scale, 3);
  // }

  // { // WHEEL 4
  //   const scale = 0.5;
  //   const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration, 1);
  //   wheel.position.set(-0.7, -1.9, -2.1);
  //   wheel.scale.set(scale, scale, 4);
  // }

  createMachine(scene3d, patternDuration);
}
