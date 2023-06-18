/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

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
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 4.3, y: -5.8, z: -18, ry: Math.PI * 0.35, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
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
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 14.3, y: -5.7, z: -20.7, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
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
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 5.2, y: -2.8, z: -11.5, ry: Math.PI * 0.5, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createLeft(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.1;
  const actor = await createActor(projectSettings, media.links1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/square-1024.svg' },
    imageRect: { w: 1024, h: 1024 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: -9, y: 0.2, z: 0, ry: Math.PI * 0.445, sx: scale, sy: scale, sz: 1.2 }));
  actor.setStaticImage(0, 0);
  // actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

async function createRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.3;
  const actor = await createActor(projectSettings, media.rechts1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/square-1024.svg' },
    imageRect: { w: 1024, h: 1024 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 25.5, y: 1.8, z: -14.5, ry: Math.PI * -0.4, sx: scale, sy: scale, sz: scale }));
  actor.setStaticImage(0, 0);
  // actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
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
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 23.3, y: -2.2, z: -16.6, sx: scale * 1.1, sy: scale, sz: scale }));
  actor.setStaticImage(0, 30);
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
  const scale = 0.565;
  const actor = await createActor(projectSettings, media.huisRechtsAchter1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/huis-rechts-achter-tekening.svg' },
    imageRect: { w: 199, h: 992 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 18.2, y: -4.6, z: -18.6, sx: scale, sy: scale, sz: scale }));
  actor.setStaticImage(0, 32);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
}

export default async function createDrawings(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  createBehindChurch(projectSettings, media, group, svgScale);
  createBehindRight(projectSettings, media, group, svgScale);
  createChurchSide(projectSettings, media, group, svgScale);
  createLeft(projectSettings, media, group, svgScale);
  createRight(projectSettings, media, group, svgScale);
  createChurchRight(projectSettings, media, group, svgScale);
  createHouseRightBack(projectSettings, media, group, svgScale);
}
