/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
// import { GridHelper } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import createTween from '@app/tween';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import { createWheel } from './physics';

async function createBridgeDeck(
  projectSettings: ProjectSettings,
  gltf: GLTF,
) {
  const { scene3d } = projectSettings;

  const texture = new THREE.TextureLoader().load('../assets/projects/kikkerbilsluis/kikkerbilsluis-brugdek.jpg');
  texture.flipY = false;

  const brugdek = gltf.scene.getObjectByName('brugdek3') as THREE.Mesh;
  brugdek.material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 1,
  });
  brugdek.position.set(0, -3, 0);
  brugdek.castShadow = true;
  brugdek.receiveShadow = true;
  scene3d.add.existing(brugdek);
  return brugdek;
}

async function createBridgeRailing(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.video1, {
    imageRect: { w: 1920, h: 225 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/brugleuning.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -8, y: -0.95 + 3, z: -4.4, sx: 1.02, sy: 1.02 }));
  actor.addTween({
    delay: 0,
    duration: 6.5,
    videoStart: 45,
    fromImagePosition: new THREE.Vector2(0, 664),
  });
  return actor.getMesh();
}

// async function createPilon(
//   projectSettings: ProjectSettings,
//   gltf: GLTF,
// ) {
//   const { scene3d } = projectSettings;

//   const texture = new THREE.TextureLoader().load('../assets/projects/test/testimage3d.jpg');
//   texture.flipY = false;

//   const pijler = gltf.scene.getObjectByName('pijler') as THREE.Mesh;
//   pijler.material = new THREE.MeshPhongMaterial({
//     // map: texture,
//     color: 0x999999,
//     shininess: 1,
//   });
//   pijler.material.needsUpdate = true;
//   pijler.position.set(1.4, -8, -5);
//   pijler.castShadow = true;
//   pijler.receiveShadow = true;
//   scene3d.add.existing(pijler);
//   return pijler;
// }

async function createStreetLight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame1, {
    imageRect: { w: 78, h: 880 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lantarenpaal.svg' },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: -6.5, y: 4.6, z: -4.2, rz: 0.05 }));
  actor.setStaticImage(1732, 16);
  return actor;
}

async function createPole(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame3, {
    imageRect: { w: 20, h: 754 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/paal.svg' },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: -7.7, y: 6.5, z: -3.7, rz: 0.05, sx: 1.5, sy: 1.5 }));
  actor.setStaticImage(578, 0);
  return actor;
}

export async function createBridge(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  gltf: GLTF,
) {
  const { patternDuration, scene3d, timeline } = projectSettings;

  const brugdek = await createBridgeDeck(projectSettings, gltf);
  const brugrailing = await createBridgeRailing(projectSettings, media);
  brugdek.add(brugrailing);
  const brug = new ExtendedObject3D();
  brug.add(brugdek);
  scene3d.add.existing(brug);
  scene3d.physics.add.existing(brug, {
    collisionFlags: 2,
    shape: 'concaveMesh',
  });

  // const pilon = await createPilon(projectSettings, gltf);

  const light = await createStreetLight(projectSettings, media);
  brug.add(light.getMesh());

  const pole = await createPole(projectSettings, media);
  brug.add(pole.getMesh());

  const wheel = createWheel(6, 5, 4, 12, 0x000000, 0.9);
  wheel.position.x = -4;
  wheel.rotation.y = Math.PI * 0.5;
  brug.add(wheel);

  const tween = createTween({
    delay: 1,
    duration: patternDuration,
    onStart: () => {},
    onUpdate: (progress) => {
      brug.rotation.x = -0.07 + Math.sin(progress * Math.PI * 2) * 0.02;
      brug.body.needUpdate = true;
    },
    onComplete: () => {},
  });
  timeline.add(tween);
}
