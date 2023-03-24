/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
// import { GridHelper } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export async function createBridge(
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
}

export async function createBridgeRailing(
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
  actor.setStaticPosition(getMatrix4({ x: -8, y: -0.95, z: -4.4, sx: 1.02, sy: 1.02 }));
  actor.addTween({
    delay: 0,
    duration: 6.5,
    videoStart: 45,
    fromImagePosition: new THREE.Vector2(0, 664),
  });
  // actor.getMesh().castShadow = false;
  // actor.getMesh().receiveShadow = false;
  // actor.getMesh().renderOrder = 1;
}
