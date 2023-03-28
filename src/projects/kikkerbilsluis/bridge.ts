/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
// import { GridHelper } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import createTween from '@app/tween';

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
  scene3d.add.existing(brugdek);
  return brugdek;
}

async function createBridgeRailing(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  // const { width: videoWidth, height: videoHeight } = media.video1 as VideoData;
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
  // actor.getMesh().castShadow = false;
  // actor.getMesh().receiveShadow = false;
  // actor.getMesh().renderOrder = 1;
  return actor.getMesh();
}

export async function createBridge(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  gltf: GLTF,
) {
  const { patternDuration, timeline } = projectSettings;

  const brugdek = await createBridgeDeck(projectSettings, gltf);
  const brugrailing = await createBridgeRailing(projectSettings, media);
  brugdek.add(brugrailing);

  const tween = createTween({
    delay: 0.1,
    duration: patternDuration,
    onStart: () => {},
    onUpdate: (progress) => {
      brugdek.rotation.x = -0.07 + Math.sin(progress * Math.PI * 2) * 0.05;
    },
    onComplete: () => {},
  });
  timeline.add(tween);
}
