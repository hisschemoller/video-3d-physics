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
  const scale = 0.45;
  const actor = await createActor(projectSettings, media.rechtsAchter1024, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/rechts-achter.svg' },
    imageRect: { w: 1024, h: 970 },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({
    x: 14.3, y: -5.7, z: -20.5, ry: Math.PI * 0, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
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

export default async function createDrawings(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  createBehindChurch(projectSettings, media, group, svgScale);
  createBehindRight(projectSettings, media, group, svgScale);
  createChurch(projectSettings, media, group, svgScale);
  createChurchSide(projectSettings, media, group, svgScale);
}
