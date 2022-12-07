import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor, createTweenGroup } from './actor';

async function createYellowCircleSvgActor(
  p: ProjectSettings,
) {
  const { width, width3d } = p;
  const circleSize = (194 / width) * width3d;
  const svgScale = width3d / width;
  const imageWidth = 128;
  const imageHeight = 128;

  const actor = await createActor(p, {
    height: imageHeight,
    imgSrc: '../assets/projects/rembrandtplein/yellow.jpg',
    width: imageWidth,
  }, {
    imageRect: { w: imageWidth, h: imageHeight },
    svg: { scale: svgScale, url: '../assets/projects/rembrandtplein/circle.svg' },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: circleSize * -0.5, y: circleSize * 0.5, z: 0 }));
  actor.setStaticImage(0, 0);
  return actor;
}

function createHeldNotesFromArray(
  p: ProjectSettings,
  actor: Actor,
  x: number,
  y: number,
  delayArray: number[],
  duration: number,
) {
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration,
      ease: 'sineInOut',
      fromMatrix4: getMatrix4({ x, y, z: 6 }),
      toMatrix4: getMatrix4({ x, y, z: 6 }),
    });
  });
  return tweenGroup;
}

function createPulsesFromArray(
  p: ProjectSettings,
  actor: Actor,
  x: number,
  y: number,
  delayArray: number[],
) {
  const { stepDuration } = p;
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration: stepDuration * 4,
      ease: 'sineIn',
      fromMatrix4: getMatrix4({ x, y, z: 6 }),
      toMatrix4: getMatrix4({
        x, y, z: 6, sx: 0.01, sy: 0.01,
      }),
    });
  });
  return tweenGroup;
}

async function createTrack1(
  p: ProjectSettings,
  group: THREE.Group,
) {
  const { stepDuration: s } = p;
  const actor = await createYellowCircleSvgActor(p);
  const tweenGroup = createPulsesFromArray(p, actor, 10, -8,
    [0.001, 16, 32, 48].map((t) => t * s));
  group.add(tweenGroup.getMesh());
}

async function createTrack2(
  p: ProjectSettings,
  group: THREE.Group,
) {
  const { stepDuration: s } = p;
  {
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 6, -6,
      [2, 16 + 2, 32 + 2, 48 + 2].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  {
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 6, -5,
      [4, 16 + 4, 32 + 4, 48 + 4].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

async function createTrack5(p: ProjectSettings, group: THREE.Group) { // BAS EN EEN TIK
  const { stepDuration: s } = p;
  { // BAS
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 10, -4,
      [4, 16 + 3, 16 + 11, 16 + 12, 32 + 4, 48 + 12].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  { // TIK
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 10, -5,
      [48 + 3].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

async function createTrack7(p: ProjectSettings, group: THREE.Group) { // SYNTH & SNARE
  const { stepDuration: s } = p;
  { // SYNTH
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 7, -4,
      [10, 32 + 10].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  { // SNARE
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 7, -5,
      [12, 32 + 12].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

async function createTrack8(p: ProjectSettings, group: THREE.Group) { // RATEL, TIK 12, 13 & WHOOSH
  const { stepDuration: s } = p;
  { // RATEL
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 9, -4,
      [4].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  { // TIK 12
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 9, -5,
      [11, 32 + 11].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  { // TIK 13
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 9, -6,
      [16 + 12, 48 + 12].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  { // WHOOSH
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 9, -7,
      [48].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

export default async function createSequence(
  p: ProjectSettings,
  group: THREE.Group,
) {
  createTrack1(p, group);
  createTrack2(p, group);
  createTrack5(p, group);
  createTrack7(p, group);
  createTrack8(p, group);
}
