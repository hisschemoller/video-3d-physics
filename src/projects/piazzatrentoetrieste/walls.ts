/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createBuildingRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2.2; // 0.77;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/gebouw-poort-rechts.svg' },
    imageRect: { w: 170, h: 684 },
    depth: 0.01,
  });
  // actor.setStaticPosition(getMatrix4({ x: 13.1, y: -1.85, z: 3, sx: scale, sy: scale }));
  actor.setStaticPosition(getMatrix4({ x: 22.3, y: 3, z: -11.5 - 3, sx: scale, sy: scale }));
  actor.setStaticImage(1750, 128);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createChurch(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.85;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk.svg' },
    imageRect: { w: 963, h: 897 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: -7.35 - 2, y: 4.15, z: -11.5, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());

  // const gridHelper = new THREE.GridHelper(11, 10, 0x00ff00, 0x000000);
  // gridHelper.position.set(5, -5, 0);
  // gridHelper.rotation.x = Math.PI / 2;
  // actor.getMesh().add(gridHelper);
}

async function createChurchRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2.3;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk-rechts.svg' },
    imageRect: { w: 312, h: 384 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: 17.3, y: -1.9, z: -11.5 - 5, sx: scale, sy: scale }));
  actor.setStaticImage(1438, 408);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createHouseRightBack(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2.4;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/huis-rechts-achter.svg' },
    imageRect: { w: 147, h: 238 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: 16.2, y: -4.4, z: -11.5 - 7, sx: scale, sy: scale }));
  actor.setStaticImage(1348, 541);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createBuildingBack(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 3;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/gebouw-achter.svg' },
    imageRect: { w: 307, h: 189 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: 7, y: -4.5, z: -11.5 - 9, sx: scale, sy: scale }));
  actor.setStaticImage(960, 575);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createSchuttingLinks(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.76;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/schutting-links.svg' },
    imageRect: { w: 215, h: 186 },
    depth: 0.03,
    color: 0xab8c68,
  });
  actor.setStaticPosition(getMatrix4({
    x: -7.65, y: -6.4, z: -7, sx: scale, sy: scale }));
  actor.setStaticImage(0, 712);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createSchuttingRechts(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.6;
  const actor = await createActor(projectSettings, media.schuttingRechts, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/schutting-rechts.svg' },
    imageRect: { w: 327, h: 183 },
    depth: 0.03,
    color: 0xab8c68,
  });
  actor.setStaticPosition(getMatrix4({
    x: -4.5, y: -6.4, z: -7, ry: Math.PI * 0.2, sx: scale * 1.3, sy: scale * 1.1 }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

export default async function createWalls(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  createBuildingRight(projectSettings, media, group, svgScale);
  createChurch(projectSettings, media, group, svgScale);
  createChurchRight(projectSettings, media, group, svgScale);
  createHouseRightBack(projectSettings, media, group, svgScale);
  createBuildingBack(projectSettings, media, group, svgScale);
  createSchuttingLinks(projectSettings, media, group, svgScale);
  createSchuttingRechts(projectSettings, media, group, svgScale);
}
