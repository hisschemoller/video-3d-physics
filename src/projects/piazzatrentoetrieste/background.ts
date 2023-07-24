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
  group: THREE.Group,
) {
  const size = 23;

  const groundGroup = new THREE.Group();
  groundGroup.position.set(8.3, -9.0, 2.3);
  // groundGroup.rotation.x = 0.02;
  groundGroup.scale.set(0.75, 1, 1);
  group.add(groundGroup);

  // const gridHelper = new THREE.GridHelper(size, 10, 0x000000, 0xff0000);
  // gridHelper.position.set(size / -2, 0.02, -12.5);
  // groundGroup.add(gridHelper);

  // const gridHelper2 = new THREE.GridHelper(size, 10, 0x000000, 0xff0000);
  // gridHelper2.position.set(size / 2, 0.02, -12.5);
  // groundGroup.add(gridHelper2);

  const groundLeft = await createActor(projectSettings, media.straatLinks2048, {
    box: { w: size, h: size, d: 0.1 },
    imageRect: { w: 2048, h: 2048 },
    depth: 0.1,
    color: 0xc0b7b0,
  });
  groundLeft.setStaticImage(0, 0);
  groundLeft.setStaticPosition(getMatrix4({ x: -size, z: -12.5 - (size / 2), rx: Math.PI * -0.5 }));
  groundGroup.add(groundLeft.getMesh());

  const groundRight = await createActor(projectSettings, media.straatRechts2048, {
    box: { w: size, h: size, d: 0.1 },
    imageRect: { w: 2048, h: 2048 },
    depth: 0.1,
    color: 0xc0b7b0,
  });
  groundRight.setStaticImage(0, 0);
  groundRight.setStaticPosition(getMatrix4({ z: -12.5 - (size / 2), rx: Math.PI * -0.5 }));
  groundGroup.add(groundRight.getMesh());

  // const groundLeft = actor.getMesh().clone();
  // groundLeft.position.x = -size;
  // group.add(groundLeft);
}

export async function createSky(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene } = projectSettings;

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(100, 25, 25),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load((media.sky1024 as ImageData).imgSrc),
    }),
  );
  sky.material.side = THREE.BackSide;
  scene.add(sky);
}

async function createStreetlight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  position: { x: number, y: number, z: number },
  scale: number,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  const actor = await createActor(projectSettings, media.lantarenpaal, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/lantarenpaal.svg' },
    imageRect: { w: 258, h: 999 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    ...position, sx: scale, sy: scale, sz: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 1;
  group.add(actor.getMesh());
}

export async function createStreetlights(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  createStreetlight(projectSettings, media, group, { x: 17, y: 6.6, z: -4 }, 1.9);
  createStreetlight(projectSettings, media, group, { x: 15, y: 1.5, z: -10 }, 1.3);
  createStreetlight(projectSettings, media, group, { x: 15, y: -1, z: -15 }, 1);
  createStreetlight(projectSettings, media, group, { x: 12, y: -2.8, z: -18 }, 0.8);
}
