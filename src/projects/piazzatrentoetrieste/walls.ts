/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import createAntenna from './roofs';

async function createBuildingRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 2.2; // 0.77;

  const actor = await createActor(projectSettings, media.video, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/gebouw-poort-rechts.svg' },
    imageRect: { w: 170, h: 684 },
    depth: 0.1,
  });
  // actor.setStaticPosition(getMatrix4({ x: 13.1, y: -1.85, z: 3, sx: scale, sy: scale }));
  actor.setStaticPosition(getMatrix4({ x: 22.3, y: 3, z: -11.5 - 3, sx: scale, sy: scale }));
  // actor.setStaticImage(1750, 128);
  actor.addTween({
    delay: stepDuration * 1,
    duration: patternDuration * 0.99,
    videoStart: 20,
    fromImagePosition: new THREE.Vector2(1750, 128),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createChurch(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 1.85;
  const actor = await createActor(projectSettings, media.video, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk.svg' },
    imageRect: { w: 963, h: 897 },
    depth: 0.1,
  });
  actor.setStaticPosition(getMatrix4({ x: -7.35 - 2, y: 4.15, z: -11.5, sx: scale, sy: scale }));
  // actor.setStaticImage(0, 0);
  actor.addTween({
    delay: stepDuration * 1,
    duration: patternDuration * 0.99,
    videoStart: 17,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createChurchRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 2.3;

  const actor = await createActor(projectSettings, media.video, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk-rechts.svg' },
    imageRect: { w: 312, h: 384 },
    depth: 0.1,
  });
  actor.setStaticPosition(getMatrix4({ x: 17.3, y: -1.9, z: -11.5 - 5, sx: scale, sy: scale }));
  // actor.setStaticImage(1438, 408);
  actor.addTween({
    delay: stepDuration * 1,
    duration: patternDuration * 0.99,
    videoStart: 18,
    fromImagePosition: new THREE.Vector2(1438, 408),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createHouseRightBack(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 2.4;

  const actor = await createActor(projectSettings, media.video, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/huis-rechts-achter.svg' },
    imageRect: { w: 147, h: 238 },
    depth: 0.1,
  });
  actor.setStaticPosition(getMatrix4({ x: 16.2, y: -4.4, z: -11.5 - 7, sx: scale, sy: scale }));
  // actor.setStaticImage(1348, 541);
  actor.addTween({
    delay: stepDuration * 1,
    duration: patternDuration * 0.99,
    videoStart: 22,
    fromImagePosition: new THREE.Vector2(1348, 541),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createBuildingBack(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 3;

  const actor = await createActor(projectSettings, media.video, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/gebouw-achter.svg' },
    imageRect: { w: 307, h: 189 },
    depth: 0.1,
  });
  actor.setStaticPosition(getMatrix4({ x: 7, y: -4.5, z: -11.5 - 9, sx: scale, sy: scale }));
  // actor.setStaticImage(960, 575);
  actor.addTween({
    delay: stepDuration * 2,
    duration: patternDuration * 0.99,
    videoStart: 20,
    fromImagePosition: new THREE.Vector2(960, 575),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
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
    depth: 0.1,
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
    depth: 0.1,
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

  const buildingRight = await createBuildingRight(projectSettings, media, group, svgScale);
  const church = await createChurch(projectSettings, media, group, svgScale);
  const churchRight = await createChurchRight(projectSettings, media, group, svgScale);
  const houseRightBack = await createHouseRightBack(projectSettings, media, group, svgScale);
  const buildingBack = await createBuildingBack(projectSettings, media, group, svgScale);
  createSchuttingLinks(projectSettings, media, group, svgScale);
  createSchuttingRechts(projectSettings, media, group, svgScale);

  createAntenna(churchRight, 'antenne1', 0.6, -0.2, -0.1);
  createAntenna(churchRight, 'antenne6', 1.7, 0.1, -0.1, 0x6B757D, 0.002);
  createAntenna(houseRightBack, 'antenne2', 0.6, 1, -0.1);
  createAntenna(houseRightBack, 'antenne7', 0.8, 0.6, -0.1, 0x868E95, 0.002);
  createAntenna(buildingBack, 'antenne3', 1.2, 0.2, -0.1, 0x93A6B6, 0.0015);
  createAntenna(buildingBack, 'antenne4', 0.6, 0.5, -0.5, 0x9CA6B2, 0.0015);
  createAntenna(buildingBack, 'antenne8', 0.9, 0.3, -0.5, 0x9CA7B4, 0.001);
  createAntenna(buildingBack, 'antenne10', 1.5, 0.3, -0.5, 0x8b96a2, 0.001);
  createAntenna(buildingBack, 'antenne7', 2.3, 0.1, -0.5, 0x8b96a2, 0.001);
  createAntenna(buildingRight, 'antenne5', 1.0, 0.5, 0.0, 0x76848E, 0.004);
  createAntenna(buildingRight, 'antenne9', 0.0, 0.5, 0.0, 0x6B757D, 0.004);

  createAntenna(church, 'spits2', 0.2, 0.6, 0.0, 0x6B757D, 0.0014);
  createAntenna(church, 'spits2', 2.2, 0.6, 0.0, 0x6B757D, 0.0014);
  createAntenna(church, 'spits2', 4.2, 0.6, 0.0, 0x6B757D, 0.0014);
}
