import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor, createTweenGroup } from './actor';

async function createSvgActor(
  p: ProjectSettings,
  to3d: (size: number, isWidth: boolean) => number,
  svgName: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { width, width3d } = p;
  const svgScale = width3d / width;

  const actor = await createActor(p, {
    height: 1920,
    imgSrc: '../assets/projects/rembrandtplein/rembrandtplein-sequence.png',
    width: 1440,
  }, {
    imageRect: { w, h },
    svg: { scale: svgScale, url: `../assets/projects/rembrandtplein/${svgName}.svg` },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: to3d(w, true) * -0.5, y: to3d(h, false) * -0.5, z: 0 }));
  actor.setStaticImage(x, y);
  return actor;
}

function createHeldNotesFromArray(
  p: ProjectSettings,
  actor: Actor,
  xAt0: number,
  yAt0: number,
  delayArray: number[],
  duration: number,
) {
  const x = 8 + ((xAt0 - 8) * 0.7);
  const y = 6 + ((yAt0 - 6) * 0.7);
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration,
      fromMatrix4: getMatrix4({ x, y, z: 6 }),
      toMatrix4: getMatrix4({ x, y, z: 6 }),
    });
  });
  return tweenGroup;
}

function createPulsesFromArray(
  p: ProjectSettings,
  actor: Actor,
  xAt0: number,
  yAt0: number,
  delayArray: number[],
) {
  const x = 8 + ((xAt0 - 8) * 0.6);
  const y = -6 + ((6 + yAt0) * 0.6);
  const { stepDuration } = p;
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration: stepDuration * 3,
      ease: 'sineIn',
      fromMatrix4: getMatrix4({ x, y, z: 6, sx: 1.5, sy: 1.5 }),
      toMatrix4: getMatrix4({
        x, y, z: 6, sx: 0.01, sy: 0.01,
      }),
    });
  });
  return tweenGroup;
}

async function createTrack1(p: ProjectSettings, group: THREE.Group) { // KICK
  const { stepDuration: s } = p;
  const actor = await createYellowCircleSvgActor(p);
  const tweenGroup = createPulsesFromArray(p, actor, 10, -8,
    [0.001, 16, 32, 48].map((t) => t * s));
  group.add(tweenGroup.getMesh());
}

async function createTrack2(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) { // TIK 1
  const { stepDuration: s } = p;
  {
    const actor = await createSvgActor(p, to3d, 'track2-1', 807, 389, 110, 108);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(807, true), to3d(389, false),
      [2.4, 16 + 2.4, 32 + 2.4, 48 + 2.4].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  {
    const actor = await createSvgActor(p, to3d, 'track2-2', 795, 550, 130, 131);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(795, true), to3d(550, false),
      [4.8, 16 + 4.8, 32 + 4.8, 48 + 4.8].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

/**
 * Elke maat verschuift de tik iets.
 */
async function createTrack3(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) { // TIK 2
  const { stepDuration: s } = p;

  { // 2.4 tot 4.1
    const offsetPerMeasure = (4.1 - 2.4) / 8;
    const actor = await createSvgActor(p, to3d, 'track3-1', 998, 390, 119, 120);
    const staticTimes = [];
    const measures = 16;
    for (let i = 0; i < measures; i += 1) {
      staticTimes.push((i * 16) + 2.4);
    }
    const delays = staticTimes.map((t, i) => {
      const offsetMeasureIndex = 8 - Math.abs(8 - i);
      const offset = offsetMeasureIndex * offsetPerMeasure;
      return (t + offset) * s;
    });
    const tweenGroup = createPulsesFromArray(p, actor, to3d(998, true), to3d(390, false), delays);
    group.add(tweenGroup.getMesh());
  }

  { // 4.8 tot 6.7
    const offsetPerMeasure = (6.7 - 4.8) / 8;
    const actor = await createSvgActor(p, to3d, 'track3-2', 1001, 565, 114, 116);
    const staticTimes = [];
    const measures = 16;
    for (let i = 0; i < measures; i += 1) {
      staticTimes.push((i * 16) + 4.8);
    }
    const delays = staticTimes.map((t, i) => {
      const offsetMeasureIndex = 8 - Math.abs(8 - i);
      const offset = offsetMeasureIndex * offsetPerMeasure;
      return (t + offset) * s;
    });
    const tweenGroup = createPulsesFromArray(p, actor, to3d(1001, true), to3d(565, false), delays);
    group.add(tweenGroup.getMesh());
  }
}

async function createTrack4(p: ProjectSettings, group: THREE.Group) { // AKKOORD
  const { stepDuration: s } = p;
  {
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createHeldNotesFromArray(p, actor, 8, -4,
      [16 + 6, 48 + 6].map((t) => t * s), 6 * s);
    group.add(tweenGroup.getMesh());
  }
  {
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createPulsesFromArray(p, actor, 8, -5,
      [48 + 4].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

async function createTrack5(p: ProjectSettings, group: THREE.Group) { // 5. BAS EN EEN TIK
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

async function createTrack6(p: ProjectSettings, group: THREE.Group) { // 6. ZACHT AKKOORD
  const { stepDuration: s } = p;
  {
    const actor = await createYellowCircleSvgActor(p);
    const tweenGroup = createHeldNotesFromArray(p, actor, 8, -7,
      [48 + 2].map((t) => t * s), 4 * s);
    group.add(tweenGroup.getMesh());
  }
  // {
  //   const actor = await createYellowCircleSvgActor(p);
  //   const tweenGroup = createPulsesFromArray(p, actor, 8, -5,
  //     [48 + 4].map((t) => t * s));
  //   group.add(tweenGroup.getMesh());
  // }
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
  to3d: (size: number, isWidth: boolean) => number,
) {
  // createTrack1(p, group);
  createTrack2(p, group, to3d);
  // createTrack4(p, group);
  // createTrack5(p, group);
  // createTrack6(p, group);
  // createTrack7(p, group);
  // createTrack8(p, group);
}

export async function createSequence2(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  createTrack3(p, group, to3d);
}
