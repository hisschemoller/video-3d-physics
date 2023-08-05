/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createTool2a(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.0;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2a.svg' },
    imageRect: { w: 76, h: 952 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    x: 2, y: 1, z: -19, ry: Math.PI * 0.5, sx: scale, sy: scale }));
  actor.setStaticImage(34, 39);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2aAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.5;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2a.svg' },
    imageRect: { w: 76, h: 952 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    x: 17, y: 4.5, z: -5, ry: Math.PI * 0.5, sx: scale, sy: scale }));
  actor.setStaticImage(34, 39);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2b(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.5;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2b.svg' },
    imageRect: { w: 410, h: 690 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    x: 25, y: 1, z: 0, ry: Math.PI * -0.5, sx: scale, sy: scale }));
  actor.setStaticImage(161, 39);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2bAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2b.svg' },
    imageRect: { w: 410, h: 690 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    x: 10, y: 3, z: -30, rx: Math.PI * -0.0, rz: Math.PI * 0.0, sx: scale, sy: scale }));
  actor.setStaticImage(161, 39);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

async function createTool2bAgainAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2b.svg' },
    imageRect: { w: 410, h: 690 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({ sx: scale, sy: scale }));
  actor.setStaticImage(161, 39);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  const g1 = new THREE.Group();
  g1.rotation.z = Math.PI * 0.5;
  g1.add(actor.getMesh());

  const g2 = new THREE.Group();
  g2.position.set(-8.8, -9, -8);
  g2.rotation.y = Math.PI * 1;
  g2.add(g1);

  group.add(g2);
  return actor.getMesh();
}

async function createTool2c(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.8;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2c.svg' },
    imageRect: { w: 427, h: 735 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(158, 122);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  const g = new THREE.Group();
  g.position.set(14, -3.8, -31.5);
  g.rotation.x = Math.PI * -0.5;
  g.add(actor.getMesh());

  group.add(g);

  return actor.getMesh();
}

async function createTool2cAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.5;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2c.svg' },
    imageRect: { w: 427, h: 735 },
    depth: 0.1,
    color: 0xc4976b,
  });
  actor.setStaticPosition(getMatrix4({
    ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(158, 122);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  const g = new THREE.Group();
  g.position.set(14, -7.6, 10);
  g.rotation.x = Math.PI * 0.5;
  g.add(actor.getMesh());

  group.add(g);

  return actor.getMesh();
}

async function createTool2d(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2d.svg' },
    imageRect: { w: 110, h: 787 },
    depth: 0.1,
    color: 0x686a6a,
  });
  actor.setStaticPosition(getMatrix4({
    x: 18, y: 4, z: 4, ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(622, 49);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2dAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2d.svg' },
    imageRect: { w: 110, h: 787 },
    depth: 0.1,
    color: 0x686a6a,
  });
  actor.setStaticPosition(getMatrix4({
    x: 1, y: 0, z: -16, ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(622, 49);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2e(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2e.svg' },
    imageRect: { w: 149, h: 798 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    x: 20, y: 4, z: -24, ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(716, 37);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2eAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2e.svg' },
    imageRect: { w: 149, h: 798 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    x: -11, y: 4, z: 1, ry: Math.PI * 0.4, sx: scale, sy: scale }));
  actor.setStaticImage(716, 37);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2f(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2f.svg' },
    imageRect: { w: 85, h: 298 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    x: 5, y: -8, z: -1, rz: Math.PI * 1.0, sx: scale, sy: scale }));
  actor.setStaticImage(920, 78);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2fAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2f.svg' },
    imageRect: { w: 85, h: 298 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    rz: Math.PI * 1.0, sx: scale, sy: scale }));
  actor.setStaticImage(920, 78);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  const g = new THREE.Group();
  g.position.set(24, -9, -20);
  g.rotation.y = Math.PI * 0.5;
  g.add(actor.getMesh());

  group.add(g);

  return actor.getMesh();
}

async function createTool2fAgainAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 3;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2f.svg' },
    imageRect: { w: 85, h: 298 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({ sx: scale, sy: scale }));
  actor.setStaticImage(920, 78);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  const g1 = new THREE.Group();
  g1.rotation.z = Math.PI * 0.5;
  g1.add(actor.getMesh());

  const g2 = new THREE.Group();
  g2.position.set(-6, -9, -18.8);
  g2.rotation.y = Math.PI * -0.5;
  g2.add(g1);

  group.add(g2);

  return actor.getMesh();
}

async function createTool2g(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2.0;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2g.svg' },
    imageRect: { w: 826, h: 588 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    x: -3, y: 0, z: 6, rz: Math.PI * 0.0, sx: scale, sy: scale }));
  actor.setStaticImage(164, 400);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

async function createTool2gAgain(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 1.5;
  const actor = await createActor(projectSettings, media.tools21024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/tekenhulp2g.svg' },
    imageRect: { w: 826, h: 588 },
    depth: 0.1,
    color: 0xd4cfb2,
  });
  actor.setStaticPosition(getMatrix4({
    x: 23, y: -1.5, z: -25.5, ry: Math.PI * -0.4, sx: scale, sy: scale }));
  actor.setStaticImage(164, 400);
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;

  group.add(actor.getMesh());

  return actor.getMesh();
}

export default async function createTools2(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  await createTool2a(projectSettings, media, group, svgScale);
  await createTool2aAgain(projectSettings, media, group, svgScale);
  await createTool2b(projectSettings, media, group, svgScale);
  await createTool2bAgain(projectSettings, media, group, svgScale);
  await createTool2bAgainAgain(projectSettings, media, group, svgScale);
  await createTool2c(projectSettings, media, group, svgScale);
  await createTool2cAgain(projectSettings, media, group, svgScale);
  await createTool2d(projectSettings, media, group, svgScale);
  await createTool2dAgain(projectSettings, media, group, svgScale);
  await createTool2e(projectSettings, media, group, svgScale);
  await createTool2eAgain(projectSettings, media, group, svgScale);
  await createTool2f(projectSettings, media, group, svgScale);
  await createTool2fAgain(projectSettings, media, group, svgScale);
  await createTool2fAgainAgain(projectSettings, media, group, svgScale);
  await createTool2g(projectSettings, media, group, svgScale);
  await createTool2gAgain(projectSettings, media, group, svgScale);
}
