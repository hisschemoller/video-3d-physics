import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

async function createTrack1(
  projectSettings: ProjectSettings,
  group: THREE.Group,
  svgScale: number,
) {
  const {
    measures, patternDuration, stepDuration, width, width3d,
  } = projectSettings;
  const circleSize = (194 / width) * width3d;
  const actor = await createActor(projectSettings, {
    height: 128,
    imgSrc: '../assets/projects/rembrandtplein/yellow.jpg',
    width: 128,
  }, {
    imageRect: { w: 128, h: 128 },
    svg: { scale: svgScale, url: '../assets/projects/rembrandtplein/circle.svg' },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: circleSize * -0.5, y: circleSize * 0.5, z: 0 }));
  actor.setStaticImage(0, 0);

  const tweenGroup = createTweenGroup(projectSettings);
  tweenGroup.getMesh().add(actor.getMesh());
  for (let i = 0; i < measures; i += 1) {
    tweenGroup.addTween({
      delay: 0.001 + (i * (patternDuration / measures)),
      duration: stepDuration * 4,
      ease: 'sineIn',
      fromMatrix4: getMatrix4({ x: 10, y: -8, z: 6 }),
      toMatrix4: getMatrix4({
        x: 10, y: -8, z: 6, sx: 0.01, sy: 0.01,
      }),
    });
  }
  group.add(tweenGroup.getMesh());
}

async function createTrack2(
  projectSettings: ProjectSettings,
  group: THREE.Group,
  svgScale: number,
) {
  
}

export default async function createSequence(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const SVG_SCALE = width3d / width;

  createTrack1(projectSettings, group, SVG_SCALE);
  createTrack2(projectSettings, group, SVG_SCALE);
}
