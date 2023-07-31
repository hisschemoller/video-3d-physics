/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createTool1(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp1.svg' },
    imageRect: { w: 301, h: 418 },
    depth: 0.2,
    color: 0xc59579,
  });
  actor.setStaticPosition(getMatrix4({
    x: 11, y: 0, z: -11, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(15, 9);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool1Again(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.8;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp1.svg' },
    imageRect: { w: 301, h: 418 },
    depth: 0.2,
    color: 0xc59579,
  });
  actor.setStaticPosition(getMatrix4({
    x: -6, y: -2, z: -17, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(15, 9);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2.svg' },
    imageRect: { w: 863, h: 369 },
    depth: 0.1,
    color: 0xECD39F,
  });
  actor.setStaticPosition(getMatrix4({
    x: 11, y: -1, z: -10, rx: Math.PI * -0.5, ry: Math.PI * 0.5, sx: scale, sy: scale }));
  actor.setStaticImage(145, 33);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2Again(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.0;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2.svg' },
    imageRect: { w: 863, h: 369 },
    depth: 0.1,
    color: 0xECD39F,
  });
  actor.setStaticPosition(getMatrix4({
    x: 14, y: -4, z: -24, rz: Math.PI * -1, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(145, 33);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2AgainAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.0;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2.svg' },
    imageRect: { w: 863, h: 369 },
    depth: 0.1,
    color: 0xECD39F,
  });
  actor.setStaticPosition(getMatrix4({
    x: 32.5, y: -9, z: -10, rz: Math.PI * -1, sx: scale, sy: scale }));
  actor.setStaticImage(145, 33);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool3(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 0.6;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp3.svg' },
    imageRect: { w: 485, h: 270 },
    depth: 0.1,
    color: 0xba926f,
  });
  actor.setStaticPosition(getMatrix4({
    x: -8, y: -6, z: -16, sx: scale, sy: scale }));
  actor.setStaticImage(316, 151);
  actor.getMesh().rotation.y = Math.PI / 2;
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool3Again(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 3;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp3.svg' },
    imageRect: { w: 485, h: 270 },
    depth: 0.1,
    color: 0xba926f,
  });
  actor.setStaticPosition(getMatrix4({
    x: -30, y: 12, z: -6, sx: scale, sy: scale }));
  actor.setStaticImage(316, 151);
  actor.getMesh().rotation.y = Math.PI / 2;
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool4(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp4.svg' },
    imageRect: { w: 988, h: 183 },
    depth: 0.1,
    color: 0xcfb99d,
  });
  actor.setStaticPosition(getMatrix4({
    x: 5, y: -5, z: 10, sx: scale, sy: scale }));
  actor.setStaticImage(11, 463);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool4Again(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 3;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp4.svg' },
    imageRect: { w: 988, h: 183 },
    depth: 0.1,
    color: 0xcfb99d,
  });
  actor.setStaticPosition(getMatrix4({
    x: 40, y: -10, z: 10, sx: scale, sy: scale }));
  actor.setStaticImage(11, 463);
  actor.getMesh().rotation.y = Math.PI / 2;
  actor.getMesh().rotation.z = Math.PI / 2;
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool5(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp5.svg' },
    imageRect: { w: 978, h: 226 },
    depth: 0.1,
    color: 0xcda396,
  });
  actor.setStaticPosition(getMatrix4({
    x: 15, y: -10, z: -30, sx: scale, sy: scale }));
  actor.setStaticImage(12, 577);
  actor.getMesh().rotation.z = Math.PI / 2;
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool5Again(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 3;
  const actor = await createActor(projectSettings, media.tools1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp5.svg' },
    imageRect: { w: 978, h: 226 },
    depth: 0.1,
    color: 0xcda396,
  });
  actor.setStaticPosition(getMatrix4({
    x: -30, y: 8, z: 10, sx: scale, sy: scale }));
  actor.setStaticImage(12, 577);
  actor.getMesh().rotation.x = Math.PI / 2;
  actor.getMesh().rotation.y = Math.PI / -2;
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

export default async function createTools(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  await createTool1(projectSettings, media, group, svgScale);
  await createTool1Again(projectSettings, media, group, svgScale);
  await createTool2(projectSettings, media, group, svgScale);
  await createTool2Again(projectSettings, media, group, svgScale);
  await createTool2AgainAgain(projectSettings, media, group, svgScale);
  await createTool3(projectSettings, media, group, svgScale);
  await createTool3Again(projectSettings, media, group, svgScale);
  await createTool4(projectSettings, media, group, svgScale);
  await createTool4Again(projectSettings, media, group, svgScale);
  await createTool5(projectSettings, media, group, svgScale);
  await createTool5Again(projectSettings, media, group, svgScale);
}
