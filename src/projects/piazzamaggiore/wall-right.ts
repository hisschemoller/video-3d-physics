/* eslint-disable max-len */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween, { Ease } from '@app/tween';
import { createActor } from './actor';
import { createShape } from './shapes';
import { createWheelGroup } from './wheel';

const DOUBLE_PI = Math.PI * 2;
const Z = 1.75;

const getTween = (
  delay: number,
  duration: number,
  update: (p: number) => void,
  ease: Ease = 'linear',
) => (
  createTween({
    delay,
    duration: duration * 0.99,
    ease,
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => update(progress),
  })
);

async function createShape4(projectSettings: ProjectSettings) {
  const {
    scene,
  } = projectSettings;

  const mesh = await createShape(
    projectSettings,
    1.6 / 1024,
    '../assets/projects/piazzamaggiore/shape4.svg',
    '../assets/projects/piazzamaggiore/shape4.jpg',
    0x7d7f00,
  );
  mesh.position.set(-0.7, 0.5, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(5.7, 0, Z);
  scene.add(group);
}

async function createWheel1(projectSettings: ProjectSettings) {
  const {
    stepDuration: s,
    timeline,
  } = projectSettings;
  const scale = 0.12;
  const wheel = await createWheelGroup(projectSettings, 0xaaaaaa);
  wheel.position.set(6.2, -1.0, Z + 0.1);
  wheel.scale.set(scale, scale, 1);

  timeline.add(getTween(s * 1, s * 1, (p) => {
    wheel.position.y = -1.0;
    wheel.rotation.z = Math.PI * p * 0.15;
  }));
  // timeline.add(getTween(s * 32, s * 8, (p) => { wheel.rotation.z = p * DOUBLE_PI; }));
  timeline.add(getTween(s * 16, s * 8, (p) => { wheel.position.x = 6.2 + (p * -0.8); }, 'sineInOut'));
  timeline.add(getTween(s * 32, s * 12, (p) => { wheel.rotation.z = p * DOUBLE_PI; }));
  timeline.add(getTween(s * 64, s * 8, (p) => {
    wheel.position.x = 5.4 + (p * -0.6);
    wheel.position.y = -1.0 + (p * 2.0);
  }, 'sineInOut'));
  timeline.add(getTween(s * 74, s * 12, (p) => { wheel.rotation.z = p * -DOUBLE_PI; }));
  timeline.add(getTween(s * 96, s * 8, (p) => { wheel.position.x = 4.8 + (p * 1.4); }, 'sineInOut'));
}

async function createWheel2(projectSettings: ProjectSettings) {
  const {
    stepDuration: s,
    timeline,
  } = projectSettings;
  const scale = 0.45;
  const wheel = await createWheelGroup(projectSettings, 0xaaaaaa);
  wheel.position.set(7.2, 0.0, Z);
  wheel.scale.set(scale, scale, 1);

  timeline.add(getTween(s * 32, s * 12, (p) => { wheel.position.x = 7.2 + (p * -1.0); }, 'sineInOut'));
  timeline.add(getTween(s * 32, s * 54, (p) => { wheel.rotation.z = p * -DOUBLE_PI * 0.5; }, 'sineInOut'));
  timeline.add(getTween(s * 74, s * 12, (p) => { wheel.position.x = 6.2 + (p * 1.0); }, 'sineInOut'));
}

export default async function createWallRight(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
) {
  // createShape4(projectSettings);
  createWheel1(projectSettings);
  createWheel2(projectSettings);

  const {
    patternDuration,
    width,
    width3d,
  } = projectSettings;
  const SVG_SCALE = width3d / width;

  { // WALL RIGHT  FRONT
    const scale = 0.79;
    const actor = await createActor(projectSettings, videos.main, {
      imageRect: { w: 179, h: 1080 },
      svg: { depth: 0.0003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/muur_rechts.svg' },
    });
    actor.setStaticPosition(getMatrix4({
      x: 5.15, y: 3.53, z: 2, sx: scale, sy: scale,
    }));
    actor.addTween({
      delay: 0,
      duration: patternDuration * 0.999,
      fromImagePosition: new THREE.Vector2(1741, 0),
      videoStart: 84.3,
    });
  }

  { // WALL RIGHT BACK
    const scale = 0.84;
    const actor = await createActor(projectSettings, {
      height: 1080,
      imgSrc: '../assets/projects/piazzamaggiore/muur_rechts_gat2.jpg',
      width: 334,
    }, {
      imageRect: { w: 334, h: 1080 },
      svg: { depth: 0.0003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/muur_rechts2.svg' },
    });
    actor.setStaticPosition(getMatrix4({
      x: 4.4, y: 3.78, z: 1.5, sx: scale, sy: scale,
    }));
    actor.setStaticImage(0, 0);
    actor.addTween({
      delay: 0,
      duration: patternDuration * 0.999,
      fromImagePosition: new THREE.Vector2(1920 - 334, 0),
    });
  }
}
