import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export default async function createBackground(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
  group: THREE.Group,
) {
  const {
    height, height3d, width, width3d,
  } = projectSettings;

  const actor = await createActor(projectSettings, {
    imgSrc: '../assets/projects/piazzatrentoetrieste/piazzatrentoetrieste-perspective_frame_500.png',
    height: 1080,
    width: 1920,
  }, {
    box: { w: width3d, h: height3d, d: 0.02 },
    imageRect: { w: width, h: height },
    depth: 0,
  });
  actor.setStaticPosition(getMatrix4({
    x: 0, y: 0, z: 0,
  }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  group.add(actor.getMesh());
}
