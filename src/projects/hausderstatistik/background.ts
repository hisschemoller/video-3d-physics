/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor, createTweenGroup } from './actor';

let svgScale: number;
let to3d: (size: number, isWidth: boolean) => number;

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

/**
 * createBackground 1
 */
async function createBackground1(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
) {
  const { stepDuration, timeline } = p;
  const axisX = to3d(577, true);
  const zoomDelay = stepDuration * 4;
  const zoomDuration = stepDuration * 16;
  const fadeOutDelay = stepDuration * (20 - 2);
  const fadeOutDuration = stepDuration * 12;
  const fadeInDelay = stepDuration * 108;
  const fadeInDuration = stepDuration * 10;

  const actor = await createActor(p, videos.frame1267, {
    imageRect: { w: videos.frame1267.width, h: videos.frame1267.height },
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

/**
 * createBackground 2
 */
async function createBackground2(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
) {
  const { stepDuration, timeline } = p;
  const axisX = to3d(1283, true);
  const fadeInDelay = stepDuration * 16;
  const fadeInDuration = stepDuration * 1;
  const moveDelay = stepDuration * 36;
  const moveDuration = stepDuration * 16;
  const fadeOutDelay = stepDuration * (52 - 6);
  const fadeOutDuration = stepDuration * 16;
  let isFadeOutStarted = false;

  const actor = await createActor(p, videos.frame1271, {
    imageRect: { w: videos.frame1271.width, h: videos.frame1271.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -axisX }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);

  const tweenGroupRotation = createTweenGroup(p);
  tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, y: 0, z: 0, ry: 0 }));
  tweenGroupRotation.getMesh().add(actor.getMesh());

  const fadeInTween = createTween({
    delay: fadeInDelay,
    duration: fadeInDuration,
    onStart: () => {
      tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX }));
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1);
    },
  });
  timeline.add(fadeInTween);

  tweenGroupRotation.addTween({
    delay: moveDelay,
    duration: moveDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ x: axisX, y: 0, z: 0, ry: 0.0 }),
    toMatrix4: getMatrix4({ x: axisX - 7.1, y: 0.9, z: -3.8, ry: Math.PI * -0.17 }),
  });

  const fadeOutTween = createTween({
    delay: fadeOutDelay,
    duration: fadeOutDuration,
    onStart: () => {
      isFadeOutStarted = true;
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {
      // reset and move out of the way temporarily
      if (isFadeOutStarted) {
        isFadeOutStarted = false;
        setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);
        tweenGroupRotation.setStaticPosition(getMatrix4({ x: 25, y: 0, z: 0, ry: 0 }));
      }
    },
  });
  timeline.add(fadeOutTween);

  return tweenGroupRotation;
}

/**
 * createBackground 3
 */
async function createBackground3(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
) {
  const { stepDuration, timeline } = p;
  const actorScale = 1.78;
  const axisX = to3d(35, true);
  const fadeInDelay = stepDuration * 31;
  const fadeInDuration = stepDuration * 1;
  const moveDelay = stepDuration * 68;
  const moveDuration = stepDuration * 16;
  const fadeOutDelay = stepDuration * (84 - 8);
  const fadeOutDuration = stepDuration * 16;
  let isFadeOutStarted = false;

  const actor = await createActor(p, videos.frame1268, {
    imageRect: { w: videos.frame1268.width, h: videos.frame1268.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -axisX - 6.25, y: 4.7, sx: actorScale, sy: actorScale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);

  const tweenGroupScale = createTweenGroup(p);
  tweenGroupScale.setStaticPosition(getMatrix4({}));
  tweenGroupScale.getMesh().add(actor.getMesh());

  const tweenGroupRotation = createTweenGroup(p);
  tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, z: -10 }));
  tweenGroupRotation.getMesh().add(tweenGroupScale.getMesh());

  const fadeInTween = createTween({
    delay: fadeInDelay,
    duration: fadeInDuration,
    onStart: () => {
      tweenGroupScale.setStaticPosition(getMatrix4({ sx: 1.0 }));
      tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX, z: -10 }));
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeInTween);

  tweenGroupScale.addTween({
    delay: moveDelay,
    duration: moveDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ sx: 1.0 }),
    toMatrix4: getMatrix4({ sx: 1.3 }),
  });

  tweenGroupRotation.addTween({
    delay: moveDelay,
    duration: moveDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ x: axisX, y: 0, z: -10 }),
    toMatrix4: getMatrix4({ x: axisX + 5.5, y: -0.9, z: -7.9, ry: Math.PI * 0.36 }),
  });

  const fadeOutTween = createTween({
    delay: fadeOutDelay,
    duration: fadeOutDuration,
    onStart: () => {
      isFadeOutStarted = true;
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {
      // reset and move out of the way temporarily
      if (isFadeOutStarted) {
        isFadeOutStarted = false;
        setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);
        tweenGroupRotation.setStaticPosition(getMatrix4({ x: 25, y: 0, z: 0, ry: 0 }));
      }
    },
  });
  timeline.add(fadeOutTween);

  return tweenGroupRotation;
}

/**
 * createBackground 4
 */
async function createBackground4(
  p: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  group: THREE.Group,
) {
  const { stepDuration, timeline } = p;
  const actorSc = 4.13;
  const bg1Sc = 4.9;
  const axisX = to3d(996, true);
  const fadeInDelay = stepDuration * 60;
  const fadeInDuration = stepDuration * 1;
  const moveDelay = stepDuration * 100;
  const moveDuration = stepDuration * 16;
  const fadeOutDelay = stepDuration * (116 - 4);
  const fadeOutDuration = stepDuration * 12;
  let isFadeOutStarted = false;

  // background1 copy further back
  const bg1 = await createActor(p, videos.frame1267, {
    imageRect: { w: videos.frame1267.width, h: videos.frame1267.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  bg1.setStaticPosition(getMatrix4({ x: -axisX - 23, y: 23.5, z: -50, sx: bg1Sc, sy: bg1Sc }));
  bg1.setStaticImage(0, 0);
  bg1.getMesh().castShadow = false;
  bg1.getMesh().receiveShadow = false;
  group.add(bg1.getMesh());

  const actor = await createActor(p, videos.frame1273, {
    imageRect: { w: videos.frame1273.width, h: videos.frame1273.height },
    svg: { scale: svgScale, url: '../assets/projects/hausderstatistik/background.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -axisX }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;

  const tweenGroupScale = createTweenGroup(p);

  const tweenGroupRotation = createTweenGroup(p);

  const fadeInTween = createTween({
    delay: fadeInDelay,
    duration: fadeInDuration,
    onStart: () => {
      setOpacity(bg1.getMesh().material as THREE.MeshPhongMaterial, 1);
      tweenGroupScale.setStaticPosition(getMatrix4({ sx: actorSc, sy: actorSc, sz: 1.0 }));
      tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX + 1, y: 18.9, z: -40 }));
    },
    onUpdate: (progress: number) => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1);
    },
  });
  timeline.add(fadeInTween);

  tweenGroupScale.setStaticPosition(getMatrix4({ sx: actorSc, sy: actorSc, sz: 1.0 }));
  // tweenGroupScale.setStaticPosition(getMatrix4({ sx: 1.2, sy: 0.3, sz: 0.3 }));
  tweenGroupScale.getMesh().add(actor.getMesh());
  tweenGroupScale.addTween({
    delay: moveDelay,
    duration: moveDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ sx: actorSc, sy: actorSc, sz: 1.0 }),
    toMatrix4: getMatrix4({ sx: 1.2, sy: 0.3, sz: 0.3 }),
  });

  tweenGroupRotation.setStaticPosition(getMatrix4({ x: axisX + 1, y: 18.9, z: -40 }));
  tweenGroupRotation.getMesh().add(tweenGroupScale.getMesh());
  tweenGroupRotation.addTween({
    delay: moveDelay,
    duration: moveDuration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4({ x: axisX + 1, y: 18.9, z: -40 }),
    toMatrix4: getMatrix4({ x: 6.9, y: -4.2, z: 8.5, ry: Math.PI * -0.32 }),
  });

  const fadeOutTween = createTween({
    delay: fadeOutDelay,
    duration: fadeOutDuration,
    onStart: () => {
      isFadeOutStarted = true;
    },
    onUpdate: (progress: number) => {
      setOpacity(bg1.getMesh().material as THREE.MeshPhongMaterial, 1 - progress);
      setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {
      // reset and move out of the way temporarily
      if (isFadeOutStarted) {
        isFadeOutStarted = false;
        setOpacity(bg1.getMesh().material as THREE.MeshPhongMaterial, 0);
        setOpacity(actor.getMesh().material as THREE.MeshPhongMaterial, 0);
        tweenGroupRotation.setStaticPosition(getMatrix4({ x: 25 }));
      }
    },
  });
  timeline.add(fadeOutTween);

  return tweenGroupRotation;
}

/**
 * createBackground
 */
export default async function createBackground(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData | ImageData },
  group: THREE.Group,
  to3dFunction: (size: number, isWidth: boolean) => number,
): Promise<void> {
  const { width, width3d } = projectSettings;
  svgScale = width3d / width;
  to3d = to3dFunction;

  const tweenGroup1 = await createBackground1(projectSettings, videos);
  group.add(tweenGroup1.getMesh());

  const tweenGroup2 = await createBackground2(projectSettings, videos);
  group.add(tweenGroup2.getMesh());

  const tweenGroup3 = await createBackground3(projectSettings, videos);
  group.add(tweenGroup3.getMesh());

  const tweenGroup4 = await createBackground4(projectSettings, videos, group);
  group.add(tweenGroup4.getMesh());
}
