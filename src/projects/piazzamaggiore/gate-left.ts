import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor } from './actor';
import { createShape } from './shapes';
import addWheel from './wheel';

const Z = -4.5;

async function createShape5(projectSettings: ProjectSettings) {
  const {
    patternDuration,
    scene,
    stepDuration,
    timeline,
  } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.4 / 1024,
    '../assets/projects/piazzamaggiore/shape5.svg',
    '../assets/projects/piazzamaggiore/shape5.jpg',
  );
  mesh.position.set(-0.75, 0.75, 0);
  // mesh.add(new THREE.AxesHelper(1));

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-8.8, -1.5, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 1 ? progress : 1 - progress;
        group.position.x = -8.8 + (prog * 1.0);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * Math.PI * -4;
    },
  }));
}

async function createWheels(projectSettings: ProjectSettings) {
  const {
    patternDuration,
    stepDuration,
    timeline,
  } = projectSettings;

  { // WHEEL 1
    const scale = 0.34;
    const wheel = await addWheel(projectSettings);
    wheel.position.set(-8.9, -1.5, Z + 0.1);
    wheel.scale.set(scale, scale, 2);

    for (let i = 0; i < 2; i += 1) {
      timeline.add(createTween({
        delay: stepDuration + (patternDuration * i * 0.5),
        duration: patternDuration * 0.4999,
        ease: 'sineInOut',
        onComplete: () => {},
        onStart: () => {},
        onUpdate: (progress: number) => {
          const prog = i % 2 === 0 ? progress : 1 - progress;
          wheel.position.x = -8.9 + (prog * 1.0);
        },
      }));
    }
  }

  { // WHEEL 2
    const scale = 0.20;
    const wheel = await addWheel(projectSettings, -1, 8);
    wheel.position.set(-8.0, -1.7, Z + 0.2);
    wheel.scale.set(scale, scale, 2);
  }
}

export default async function createGateLeft(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
) {
  createShape5(projectSettings);
  createWheels(projectSettings);

  const {
    patternDuration,
    width,
    width3d,
  } = projectSettings;
  const SVG_SCALE = width3d / width;

  { // GEVEL RECHTS
    const scale = 1.415;
    const actor = await createActor(projectSettings, videos.main, {
      imageRect: { w: 325, h: 869 },
      svg: {
        depth: 0.0003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/gevel_links.svg',
      },
    });
    actor.setStaticPosition(getMatrix4({
      x: -11.3, y: 6.4, z: -4, sx: scale, sy: scale,
    }));
    actor.addTween({
      delay: 0,
      duration: patternDuration * 0.999,
      videoStart: 84.3,
      fromImagePosition: new THREE.Vector2(0, 0),
    });
    actor.getMesh().castShadow = false;
    actor.getMesh().receiveShadow = false;
  }
}
