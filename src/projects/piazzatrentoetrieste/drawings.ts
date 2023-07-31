/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import createAntenna, { createFlagPole } from './roofs';

async function createBehindChurch(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 0.6;
  const actor = await createActor(projectSettings, media.achterKathedraal1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/achter-kathedraal.svg' },
    imageRect: { w: 1024, h: 669 },
    depth: 0.1,
    color: 0xead1c2,
  });
  actor.setStaticPosition(getMatrix4({
    x: 4.3, y: -5.8, z: -18, ry: Math.PI * 0.35, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createBehindRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 0.43;
  const actor = await createActor(projectSettings, media.rechtsAchter1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/rechts-achter.svg' },
    imageRect: { w: 1024, h: 970 },
    depth: 0.1,
    color: 0xb9b0a5,
  });
  actor.setStaticPosition(getMatrix4({
    x: 14.3, y: -5.7, z: -20.7, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createChurchSide(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 0.73;
  const actor = await createActor(projectSettings, media.kathedraalZijkant1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/katedraal-zijkant.svg' },
    imageRect: { w: 1024, h: 1024 },
    depth: 0.1,
    color: 0xd9d3cd,
  });
  actor.setStaticPosition(getMatrix4({
    x: 5.2, y: -2.8, z: -11.5, ry: Math.PI * 0.5, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createLeft(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 0.9; // 1.1;
  const actor = await createActor(projectSettings, media.links1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/links2.svg' },
    imageRect: { w: 1024, h: 1024 },
    depth: 0.1,
    color: 0xbe916d,
  });
  actor.setStaticPosition(getMatrix4({
    x: -8.8, y: -1.4, z: -2, ry: Math.PI * 0.49, sx: scale, sy: scale, sz: scale * 1.2 }));
  actor.setStaticImage(0, 0);
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.3;
  const actor = await createActor(projectSettings, media.rechts1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/rechts2.svg' },
    imageRect: { w: 1024, h: 1024 },
    depth: 0.1,
    color: 0xbd8865,
  });
  actor.setStaticPosition(getMatrix4({
    x: 25.4, y: 1.8, z: -14.5, ry: Math.PI * -0.4, sx: scale, sy: scale, sz: scale }));
  actor.setStaticImage(0, 0);
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
  const scale = 0.84;
  const actor = await createActor(projectSettings, media.kerkRechts1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk-rechts-tekening.svg' },
    imageRect: { w: 189, h: 994 },
    depth: 0.1,
    color: 0xa98971,
  });
  actor.setStaticPosition(getMatrix4({
    x: 23.3, y: -2.2, z: -16.6, sx: scale * 1.1, sy: scale, sz: scale }));
  actor.setStaticImage(0, 30);
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
  const scale = 0.565;
  const actor = await createActor(projectSettings, media.huisRechtsAchter1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/huis-rechts-achter-tekening.svg' },
    imageRect: { w: 199, h: 992 },
    depth: 0.1,
    color: 0xa98971,
  });
  actor.setStaticPosition(getMatrix4({
    x: 18.2, y: -4.6, z: -18.6, sx: scale, sy: scale, sz: scale }));
  actor.setStaticImage(0, 32);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

export default async function createDrawings(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  const behindChurch = await createBehindChurch(projectSettings, media, group, svgScale);
  const behindRight = await createBehindRight(projectSettings, media, group, svgScale);
  const churchSide = await createChurchSide(projectSettings, media, group, svgScale);
  const left = await createLeft(projectSettings, media, group, svgScale);
  const right = await createRight(projectSettings, media, group, svgScale);
  const churchRight = await createChurchRight(projectSettings, media, group, svgScale);
  const houseRightBack = await createHouseRightBack(projectSettings, media, group, svgScale);

  createAntenna(churchSide, 'antenne9', 6, 0.0, 0, 0x7E8E99, 0.006, Math.PI / 2);
  createAntenna(left, 'antenne10', 4, 2.5, 0, 0x869CAC, 0.008, Math.PI / 2);
  createAntenna(left, 'antenne2', 7, 3.7, 0, 0x869CAC, 0.008, Math.PI / 2);
  createAntenna(left, 'antenne3', 6.2, 1.5, 0, 0x869CAC, 0.008, Math.PI / 2);
  createAntenna(right, 'antenne12', 3.5, 2.5, -1, 0x647480, 0.006, Math.PI / -2);
  createAntenna(right, 'antenne7', 2, 2.5, -1, 0x647480, 0.006, Math.PI / -2);
  createAntenna(churchRight, 'antenne13', -1.5, 1.2, 0, 0x82878B, 0.006);
  createAntenna(houseRightBack, 'antenne14', 1.5, 3.5, 0, 0x68727A, 0.006);

  createAntenna(behindChurch, 'antenne1', 5, 0.5, 0, 0x4F606C, 0.005, Math.PI / 2);
  createAntenna(behindRight, 'antenne6', 4, 0.5, 0, 0x4F606C, 0.005, Math.PI / 2);
  createAntenna(behindRight, 'antenne4', 5, 0.5, 0, 0x4F606C, 0.005, Math.PI / 2);
  createAntenna(behindRight, 'antenne5', 2, 0.5, 0, 0x4F606C, 0.005, Math.PI / 2);

  createFlagPole(churchSide, 'vlaggestok', 0, 4, 0.0, 0.010);
  createFlagPole(churchSide, 'vlaggestok', 2.5, 3, 0.0, 0.009);
  createFlagPole(churchSide, 'vlaggestok', 5, 2, 0.0, 0.008);
  createFlagPole(churchSide, 'vlaggestok', 7.5, 1, 0.0, 0.007);
}
