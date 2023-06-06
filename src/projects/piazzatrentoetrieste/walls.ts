/* eslint-disable object-curly-newline */
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

async function createChurchRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const scale = 2.4; // 1;
  const actor = await createActor(projectSettings, media.frame500, {
    svg: { scale: svgScale, url: '../assets/projects/piazzatrentoetrieste/kerk-rechts.svg' },
    imageRect: { w: 312, h: 384 },
    depth: 0.01,
  });
  // actor.setStaticPosition(getMatrix4({ x: 12, y: -3.4, z: 0, sx: scale, sy: scale }));
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
  const scale = 2.7;
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

export default async function createWalls(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  createBuildingRight(projectSettings, media, group, svgScale);
  createChurchRight(projectSettings, media, group, svgScale);
  createHouseRightBack(projectSettings, media, group, svgScale);
}
