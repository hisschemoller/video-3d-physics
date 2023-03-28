/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createSky2Mid(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 793, h: 513 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht2-mid.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -7, y: 7, z: -10, sx: 2, sy: 2 }));
  actor.setStaticImage(215, 0);
}

async function createSky3Left(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.video3, {
    imageRect: { w: 414, h: 407 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht3-links.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -12, y: 9, z: -10.5, ry: 0.1, sx: 3.5, sy: 3.5 }));
  actor.addTween({
    delay: 0,
    duration: 6.5,
    videoStart: 10,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
}

async function createSky1MidRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame1, {
    imageRect: { w: 485, h: 686 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht1-midrechts.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 2, y: 9, z: -10.5, ry: -0.1, sx: 1.5, sy: 1.5 }));
  actor.setStaticImage(978, 0);
}

export async function createSky(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  await createSky2Mid(projectSettings, media);
  await createSky3Left(projectSettings, media);
  await createSky1MidRight(projectSettings, media);
}
