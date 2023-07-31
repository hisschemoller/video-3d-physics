/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

// eslint-disable-next-line import/prefer-default-export
export async function createGreenscreen(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width: videoWidth, height: videoHeight } = media.video_greenscreen as VideoData;
  const { patternDuration, stepDuration, width, width3d } = projectSettings;
  const pxTo3d = width3d / width;
  const scale = 1.5;

  const actor = await createActor(projectSettings, media.video_greenscreen, {
    box: {
      w: videoWidth * pxTo3d * scale,
      h: videoHeight * pxTo3d * scale,
      d: 0.02,
    },
    imageRect: { w: videoWidth, h: videoHeight },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 0, y: -6.5, z: -6, sx: 1.0, sy: 1.0 }));
  actor.addTween({
    delay: stepDuration * 36,
    duration: patternDuration * 0.99,
    videoStart: 0,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  actor.getMesh().renderOrder = 2;
  group.add(actor.getMesh());
}
