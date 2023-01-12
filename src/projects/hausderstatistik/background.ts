import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

async function createBackground1(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration, width, width3d } = p;
  const SVG_SCALE = width3d / width;
  const axisX = to3d(577, true);

  const actor = await createActor(p, videos.frame1267, {
    imageRect: { w: videos.frame1266.width, h: videos.frame1266.height },
    svg: { scale: SVG_SCALE, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -axisX }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;

  const tweenGroupScale = createTweenGroup(p);
  tweenGroupScale.setStaticPosition(getMatrix4({}));
  tweenGroupScale.getMesh().add(actor.getMesh());
  tweenGroupScale.addTween({
    delay: stepDuration * 4,
    duration: stepDuration * 16,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ sx: 1.0 }),
    toMatrix4: getMatrix4({ sx: 1.44 }),
  });

  const tweenGroupRotation = createTweenGroup(p);
  tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, ry: 0.0 }));
  tweenGroupRotation.getMesh().add(tweenGroupScale.getMesh());
  tweenGroupRotation.addTween({
    delay: stepDuration * 4,
    duration: stepDuration * 16,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({
      x: axisX, y: 0, z: 0, ry: 0.0,
    }),
    toMatrix4: getMatrix4({
      x: axisX + 4.3, y: -0.2, z: 7.5, ry: Math.PI * 0.06,
    }),
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
  to3d: (size: number, isWidth: boolean) => number,
): Promise<void> {
  const tweenGroup1 = await createBackground1(projectSettings, videos, to3d);
  group.add(tweenGroup1.getMesh());
}
