/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createGreenscreen19027(
  projectSettings: ProjectSettings,
  videos: { [key: string]: ImageData | VideoData | undefined },
  pxTo3d: number,
) {
  const { width: videoWidth, height: videoHeight } = videos.video19green027 as VideoData;
  const actor = await createActor(projectSettings, videos.video19green027, {
    box: {
      w: videoWidth * pxTo3d * 1.6,
      h: videoHeight * pxTo3d * 1.6,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -9, y: 4, z: 0 }));
  actor.addTween({
    delay: 0,
    duration: 7,
    videoStart: 0,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 1;
}

async function createGreenscreen19100(
  projectSettings: ProjectSettings,
  videos: { [key: string]: ImageData | VideoData | undefined },
  pxTo3d: number,
) {
  const { width: videoWidth, height: videoHeight } = videos.video19green100 as VideoData;
  const actor = await createActor(projectSettings, videos.video19green100, {
    box: {
      w: videoWidth * pxTo3d * 1.2,
      h: videoHeight * pxTo3d * 1.2,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -6, y: 3.2, z: 2 }));
  actor.addTween({
    delay: 1,
    duration: 17,
    videoStart: 0,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 2;
}

/**
 * Setup
 */
// eslint-disable-next-line import/prefer-default-export
export async function setupGreenscreens(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width3d, width } = projectSettings;
  const pxTo3d = width3d / width;

  await createGreenscreen19027(projectSettings, media, pxTo3d);
  await createGreenscreen19100(projectSettings, media, pxTo3d);
}
