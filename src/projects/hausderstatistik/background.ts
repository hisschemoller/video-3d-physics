import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

async function createBackground1(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
) {
  const { height3d, stepDuration, width3d } = p;

  const actor = await createActor(p, videos.frame1267, {
    box: { w: width3d, h: height3d, d: 0.02 },
    imageRect: { w: videos.frame1266.width, h: videos.frame1266.height },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -4 }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;

  const tweenGroupScale = createTweenGroup(p);
  tweenGroupScale.setStaticPosition(getMatrix4({}));
  tweenGroupScale.getMesh().add(actor.getMesh());
  tweenGroupScale.addTween({
    delay: stepDuration * 4,
    duration: stepDuration * 16,
    ease: 'sineInOut',
    fromMatrix4: getMatrix4({ sx: 1.0 }),
    toMatrix4: getMatrix4({ sx: 2.0 }),
  });

  const tweenGroupRotation = createTweenGroup(p);
  tweenGroupRotation.setStaticPosition(getMatrix4({ x: 4, ry: 0.0 }));
  tweenGroupRotation.getMesh().add(tweenGroupScale.getMesh());
  tweenGroupRotation.addTween({
    delay: stepDuration * 4,
    duration: stepDuration * 16,
    ease: 'sineInOut',
    fromMatrix4: getMatrix4({ x: 4, ry: 0.0 }),
    toMatrix4: getMatrix4({ x: 4, ry: Math.PI * 0.1 }),
  });

  return tweenGroupRotation;
}

/**
 * createBackground
 */
export default async function createBackground(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  group: THREE.Group,
): Promise<void> {
  const tweenGroup1 = await createBackground1(projectSettings, videos);
  group.add(tweenGroup1.getMesh());
}
