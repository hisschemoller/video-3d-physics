import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

async function createBackground1(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
) {
  const { height3d, width3d } = p;

  const actor = await createActor(p, videos.frame1267, {
    box: { w: width3d, h: height3d, d: 0.02 },
    imageRect: { w: videos.frame1266.width, h: videos.frame1266.height },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({}));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;

  const tweenGroup = createTweenGroup(p);
  tweenGroup.setStaticPosition(getMatrix4({}));
  tweenGroup.getMesh().add(actor.getMesh());
  return tweenGroup;
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
