import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor, createTweenGroup } from './actor';

/**
 * createSvgActor
 */
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

/**
 * createHeldNotesFromArray
 */
function createHeldNotesFromArray(
  p: ProjectSettings,
  actor: Actor,
  xAt0: number,
  yAt0: number,
  delayArray: number[],
  z = 6,
  duration = 4,
  startScale = 1,
) {
  const x = 8 + ((xAt0 - 8) * 0.6);
  const y = -6 + ((6 + yAt0) * 0.6);
  const { stepDuration } = p;
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration: stepDuration * duration,
      fromMatrix4: getMatrix4({
        x, y, z, sx: startScale, sy: startScale,
      }),
      toMatrix4: getMatrix4({
        x, y, z, sx: startScale, sy: startScale,
      }),
    });
  });
  return tweenGroup;
}

/**
 * createPulsesFromArray
 */
function createPulsesFromArray(
  p: ProjectSettings,
  actor: Actor,
  xAt0: number,
  yAt0: number,
  delayArray: number[],
  z = 6,
  duration = 4,
  startScale = 1,
) {
  const x = 8 + ((xAt0 - 8) * 0.6);
  const y = -6 + ((6 + yAt0) * 0.6);
  const { stepDuration } = p;
  const tweenGroup = createTweenGroup(p);
  tweenGroup.getMesh().add(actor.getMesh());
  delayArray.forEach((delay) => {
    tweenGroup.addTween({
      delay,
      duration: stepDuration * duration,
      ease: 'sineIn',
      fromMatrix4: getMatrix4({
        x, y, z, sx: startScale, sy: startScale,
      }),
      toMatrix4: getMatrix4({
        x, y, z, sx: 0.01, sy: 0.01,
      }),
    });
  });
  return tweenGroup;
}

/**
 * createTrack1 - KICK
 */
async function createTrack1(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  const actor = await createSvgActor(p, to3d, 'track1', 1458, 985, 313, 307);
  const tweenGroup = createPulsesFromArray(p, actor, to3d(1458, true), to3d(1050, false),
    [0.001, 16, 32, 48].map((t) => t * s), 6, 4, 0.7);
  group.add(tweenGroup.getMesh());
}

/**
 * createTrack2 - TIK 1
 */
async function createTrack2(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  {
    const actor = await createSvgActor(p, to3d, 'track2-1', 807, 389, 110, 108);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(800, true), to3d(390, false),
      [2.4, 16 + 2.4, 32 + 2.4, 48 + 2.4].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
  {
    const actor = await createSvgActor(p, to3d, 'track2-2', 795, 550, 130, 131);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(800, true), to3d(550, false),
      [4.8, 16 + 4.8, 32 + 4.8, 48 + 4.8].map((t) => t * s));
    group.add(tweenGroup.getMesh());
  }
}

/**
 * Elke maat verschuift de tik iets.
 */
async function createTrack3( // TIK 2
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
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
    const tweenGroup = createPulsesFromArray(
      p, actor, to3d(1000, true), to3d(390, false), delays, 6.1,
    );
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
    const tweenGroup = createPulsesFromArray(
      p, actor, to3d(1000, true), to3d(550, false), delays, 6.1,
    );
    group.add(tweenGroup.getMesh());
  }
}

/**
 * createTrack4 - AKKOORD
 */
async function createTrack4(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  {
    const actor = await createSvgActor(p, to3d, 'track4-1', 212, 155, 338, 339);
    const tweenGroup = createHeldNotesFromArray(p, actor, to3d(410, true), to3d(360, false),
      [16 + 6, 48 + 6].map((t) => t * s), 6, 4, 0.55);
    group.add(tweenGroup.getMesh());
  }
  {
    const actor = await createSvgActor(p, to3d, 'track4-2', 234, 482, 228, 250);
    const tweenGroup = createHeldNotesFromArray(p, actor, to3d(380, true), to3d(590, false),
      [48 + 4].map((t) => t * s), 5.98, 4, 0.55);
    group.add(tweenGroup.getMesh());
  }
}

/**
 * createTrack5 - BAS EN EEN TIK
 */
async function createTrack5(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  { // BAS
    const actor = await createSvgActor(p, to3d, 'track5-1', 496, 985, 417, 349);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(700, true), to3d(1100, false),
      [4, 16 + 3, 16 + 11, 16 + 12, 32 + 4, 48 + 12].map((t) => t * s), 6, 4, 0.55);
    group.add(tweenGroup.getMesh());
  }
  { // TIK
    const actor = await createSvgActor(p, to3d, 'track5-2', 105, 1004, 331, 329);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(1650, true), to3d(400, false),
      [48 + 3].map((t) => t * s), 6, 6, 0.5);
    group.add(tweenGroup.getMesh());
  }
}

/**
 * createTrack6 - ZACHT AKKOORD
 */
async function createTrack6(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  {
    const actor = await createSvgActor(p, to3d, 'track6', 1478, 376, 338, 339);
    const tweenGroup = createHeldNotesFromArray(p, actor, to3d(1550, true), to3d(650, false),
      [48 + 2].map((t) => t * s), 5.98, 4, 0.58);
    group.add(tweenGroup.getMesh());
  }
  // {
  //   const actor = await createYellowCircleSvgActor(p);
  //   const tweenGroup = createPulsesFromArray(p, actor, 8, -5,
  //     [48 + 4].map((t) => t * s));
  //   group.add(tweenGroup.getMesh());
  // }
}

/**
 * createTrack7 - SYNTH & SNARE
 */
async function createTrack7(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { stepDuration: s } = p;
  { // SYNTH
    const actor = await createSvgActor(p, to3d, 'track7-1', 14, 685, 307, 293);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(50, true), to3d(1050, false),
      [10, 32 + 10].map((t) => t * s), 4, 4, 0.6);
    group.add(tweenGroup.getMesh());
  }
  { // SNARE
    const actor = await createSvgActor(p, to3d, 'track7-2', 1650, 30, 246, 219);
    const tweenGroup = createPulsesFromArray(p, actor, to3d(1750, true), to3d(100, false),
      [12, 32 + 12].map((t) => t * s), 5, 3, 0.5);
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
  createTrack1(p, group, to3d);
  createTrack2(p, group, to3d);
  createTrack4(p, group, to3d);
  createTrack5(p, group, to3d);
  createTrack6(p, group, to3d);
  createTrack7(p, group, to3d);
  // createTrack8(p, group, to3d);
}

export async function createSequence2(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  createTrack3(p, group, to3d);
}
