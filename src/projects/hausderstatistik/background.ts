/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor, createTweenGroup } from './actor';

let svgScale: number;

function setOpacity(
  material: THREE.MeshPhongMaterial | THREE.MeshPhongMaterial[],
  opacity: number,
) {
  if (Array.isArray(material)) {
    material.forEach((mat) => { mat.opacity = opacity; });
  } else {
    material.opacity = opacity;
  }
}

async function createBackground1(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration, timeline } = p;
  const axisX = to3d(577, true);
  const zoomDelay = stepDuration * 4;
  const zoomDuration = stepDuration * 16;
  const fadeOutDelay = stepDuration * 20;
  const fadeOutDuration = stepDuration * 16;
  const fadeInDelay = stepDuration * 60;
  const fadeInDuration = stepDuration * 1;

  const actor = await createActor(p, videos.frame1267, {
    imageRect: { w: videos.frame1266.width, h: videos.frame1266.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
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
    delay: zoomDelay,
    duration: zoomDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ sx: 1.0 }),
    toMatrix4: getMatrix4({ sx: 1.44 }),
  });

  const tweenGroupRotation = createTweenGroup(p);
  tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, y: 0, z: 0, ry: 0.0 }));
  tweenGroupRotation.getMesh().add(tweenGroupScale.getMesh());
  tweenGroupRotation.addTween({
    delay: zoomDelay,
    duration: zoomDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ x: axisX, y: 0, z: 0, ry: 0.0 }),
    toMatrix4: getMatrix4({ x: axisX + 4.3, y: -0.2, z: 7.5, ry: Math.PI * 0.06 }),
  });

  const fadeOutTween = createTween({
    delay: fadeOutDelay,
    duration: fadeOutDuration,
    onStart: () => {},
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeOutTween);

  const fadeInTween = createTween({
    delay: fadeInDelay,
    duration: fadeInDuration,
    onStart: () => {
      // reset to start position, rotation, scale
      tweenGroupScale.setStaticPosition(getMatrix4({ sx: 1.0 }));
      tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, y: 0, z: 0, ry: 0.0 }));
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeInTween);

  return tweenGroupRotation;
}

async function createBackground2(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  to3d: (size: number, isWidth: boolean) => number,
) {
  const actor = await createActor(p, videos.frame1271, {
    imageRect: { w: videos.frame1271.width, h: videos.frame1271.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 0 }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);

  return actor;
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
  const { width, width3d } = projectSettings;
  svgScale = width3d / width;

  const tweenGroup1 = await createBackground1(projectSettings, videos, to3d);
  group.add(tweenGroup1.getMesh());

  const tweenGroup2 = await createBackground2(projectSettings, videos, to3d);
  group.add(tweenGroup2.getMesh());
}
