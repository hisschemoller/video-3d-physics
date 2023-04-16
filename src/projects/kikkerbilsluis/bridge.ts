/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
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
  pxTo3d: number,
) {
  const actor = await createActor(projectSettings, media.video1, {
    imageRect: { w: 1920, h: 225 },
    svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/brugleuning.svg' },
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
  pxTo3d: number,
) {
  const actor = await createActor(projectSettings, media.frame1, {
    imageRect: { w: 78, h: 880 },
    svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/lantarenpaal.svg' },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: -6.5, y: 4.6, z: -3.7, rz: 0.05 }));
  actor.setStaticImage(1732, 16);
  return actor;
}

async function createPole(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  pxTo3d: number,
) {
  const actor = await createActor(projectSettings, media.frame3, {
    imageRect: { w: 20, h: 754 },
    svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/paal.svg' },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: -7.7, y: 6.5, z: -3.7, rz: 0.05, sx: 1.5, sy: 1.5 }));
  actor.setStaticImage(578, 0);
  return actor;
}

async function createGreenscreen2(
  projectSettings: ProjectSettings,
  videos: { [key: string]: ImageData | VideoData | undefined },
  pxTo3d: number,
) {
  const { width: videoWidth, height: videoHeight } = videos.video2_greenscreen as VideoData;
  const actor = await createActor(projectSettings, videos.video2_greenscreen, {
    box: {
      w: videoWidth * pxTo3d * 1.6,
      h: videoHeight * pxTo3d * 1.6,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -8, y: 3.3, z: -3.9, sx: 1.0, sy: 1.0 }));
  actor.addTween({
    delay: projectSettings.stepDuration * 64,
    duration: projectSettings.patternDuration * 0.99,
    videoStart: 0.7,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 2;
  return actor;
}

async function createGreenscreen2a(
  projectSettings: ProjectSettings,
  videos: { [key: string]: ImageData | VideoData | undefined },
  pxTo3d: number,
) {
  const { width: videoWidth, height: videoHeight } = videos.video2a_greenscreen as VideoData;
  const actor = await createActor(projectSettings, videos.video2a_greenscreen, {
    box: {
      w: videoWidth * pxTo3d * 1.6,
      h: videoHeight * pxTo3d * 1.6,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -8, y: 3.3, z: -3.4, sx: 1.0, sy: 1.0 }));
  actor.addTween({
    delay: projectSettings.stepDuration * 64,
    duration: 13,
    videoStart: 0.7,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 2;
  return actor;
}

async function createGreenscreen3a(
  projectSettings: ProjectSettings,
  videos: { [key: string]: ImageData | VideoData | undefined },
  pxTo3d: number,
) {
  const { width: videoWidth, height: videoHeight } = videos.video3a_greenscreen as VideoData;
  const actor = await createActor(projectSettings, videos.video3a_greenscreen, {
    box: {
      w: videoWidth * pxTo3d * 1.6,
      h: videoHeight * pxTo3d * 1.6,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -8, y: 4, z: -3.8, rz: -0.012, sx: 1.0, sy: 1.0 }));
  actor.addTween({
    delay: projectSettings.stepDuration * 64,
    duration: projectSettings.patternDuration * 0.99,
    videoStart: 0,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 2;
  return actor;
}

async function createWhiteCar(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  pxTo3d: number,
) {
  const { patternDuration } = projectSettings;

  const actor = await createActor(projectSettings, media.frame3witteauto, {
    imageRect: { w: 843, h: 177 },
    svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/witte-auto.svg' },
    depth: 0.02,
  });
  // actor.setStaticPosition(getMatrix4({ x: 0, y: 0.8, z: 0, sx: 0.6, sy: 0.6 }));
  actor.setStaticImage(553, 664);
  actor.addTween({
    delay: 2,
    duration: patternDuration,
    fromMatrix4: getMatrix4({ x: -5, y: -1.4, z: 4, sx: 0.5, sy: 0.5 }),
    toMatrix4: getMatrix4({ x: 2, y: -1.4, z: 4, sx: 0.5, sy: 0.5 }),
  });
  return actor;
}

async function createBlackCar(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  pxTo3d: number,
) {
  const { patternDuration } = projectSettings;

  const actor = await createActor(projectSettings, media.frame3zwarteauto, {
    imageRect: { w: 564, h: 127 },
    svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/zwarte-auto.svg' },
    depth: 0.02,
  });
  actor.setStaticImage(710, 643);
  actor.addTween({
    delay: 16,
    duration: patternDuration,
    fromMatrix4: getMatrix4({ x: 5, y: -1.4, z: -2.0, sx: 1.2, sy: 1.2 }),
    toMatrix4: getMatrix4({ x: -8, y: -1.4, z: -2.0, sx: 1.2, sy: 1.2 }),
  });
  return actor;
}

export async function createBridge(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  gltf: GLTF,
) {
  const { patternDuration, scene3d, timeline, width, width3d } = projectSettings;
  const pxTo3d = width3d / width;

  const brugdek = await createBridgeDeck(projectSettings, gltf);
  const brugrailing = await createBridgeRailing(projectSettings, media, pxTo3d);
  brugdek.add(brugrailing);
  const brug = new ExtendedObject3D();
  brug.add(brugdek);
  scene3d.add.existing(brug);
  scene3d.physics.add.existing(brug, {
    collisionFlags: 2,
    shape: 'concaveMesh',
  });

  // const pilon = await createPilon(projectSettings, gltf);

  const light = await createStreetLight(projectSettings, media, pxTo3d);
  brug.add(light.getMesh());

  const pole = await createPole(projectSettings, media, pxTo3d);
  brug.add(pole.getMesh());

  const wheel = createWheel(6, 5, 4, 12, 0x000000, 0.5);
  wheel.position.x = -4;
  wheel.rotation.y = Math.PI * 0.5;
  brug.add(wheel);

  const greenscreen2 = await createGreenscreen2(projectSettings, media, pxTo3d);
  brug.add(greenscreen2.getMesh());

  const greenscreen2a = await createGreenscreen2a(projectSettings, media, pxTo3d);
  brug.add(greenscreen2a.getMesh());

  const greenscreen3a = await createGreenscreen3a(projectSettings, media, pxTo3d);
  brug.add(greenscreen3a.getMesh());

  const whiteCar = await createWhiteCar(projectSettings, media, pxTo3d);
  brug.add(whiteCar.getMesh());

  const blackCar = await createBlackCar(projectSettings, media, pxTo3d);
  brug.add(blackCar.getMesh());

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
