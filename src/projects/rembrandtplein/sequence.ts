import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4, logBoundingBox } from '@app/utils';
import { createActor } from './actor';

async function createCircle(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration } = projectSettings;
  const actor = await createActor(projectSettings, {
    height: 128,
    imgSrc: '../assets/projects/rembrandtplein/yellow.jpg',
    width: 128,
  }, {
    imageRect: { w: 128, h: 128 },
    svg: { scale: svgScale, url: '../assets/projects/rembrandtplein/circle.svg' },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: 10, y: -6, z: 5 }));
  actor.setStaticImage(0, 0);
  actor.addTween({
    delay: 0.01,
    duration: patternDuration,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  group.add(actor.getMesh());
  logBoundingBox(actor.getMesh().geometry);
}

export default async function createSequence(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const SVG_SCALE = width3d / width;

  createCircle(projectSettings, videos, group, SVG_SCALE);
}
