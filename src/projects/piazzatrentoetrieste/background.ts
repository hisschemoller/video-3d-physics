/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export default async function createBackground(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const {
    height, height3d, width, width3d,
  } = projectSettings;
  const scale = 1.8;

  const actor = await createActor(projectSettings, media.frame500, {
    box: { w: width3d, h: height3d, d: 0.02 },
    imageRect: { w: width, h: height },
    depth: 0,
  });
  actor.setStaticPosition(getMatrix4({ x: -6.35, y: 3.6, z: -10, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  group.add(actor.getMesh());

  if (Array.isArray(actor.getMesh().material)) {
    (actor.getMesh().material as Array<THREE.Material>)[1].opacity = 0.5;
  }
}

export async function createGround(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene } = projectSettings;

  const group = new THREE.Group();
  group.position.set(0, -4, 0);
  group.rotation.x = 0.02 + 0.14;
  scene.add(group);

  // const gridHelper = new THREE.GridHelper(22, 10, 0x00ff00, 0x000000);
  // gridHelper.position.set(-11, 0, -12.5);
  // group.add(gridHelper);

  // const gridHelper2 = new THREE.GridHelper(22, 10, 0x00ff00, 0x000000);
  // gridHelper2.position.set(11, 0, -12.5);
  // group.add(gridHelper2);

  const actor = await createActor(projectSettings, media.straatTile2048, {
    box: { w: 22, h: 22, d: 0.01 },
    imageRect: { w: 2048, h: 2048 },
    depth: 0.01,
  });
  actor.setStaticImage(0, 0);
  actor.setStaticPosition(getMatrix4({ z: -23, rx: Math.PI * -0.5 }));
  group.add(actor.getMesh());

  const groundLeft = actor.getMesh().clone();
  groundLeft.position.x = -22;
  group.add(groundLeft);
}

export async function createSky(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene } = projectSettings;

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(100, 25, 25),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load((media.test as ImageData).imgSrc),
    }),
  );
  sky.material.side = THREE.BackSide;
  scene.add(sky);
}
