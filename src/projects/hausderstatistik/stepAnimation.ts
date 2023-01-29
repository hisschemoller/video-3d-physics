/* eslint-disable object-property-newline */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import createTween from '@app/tween';
import { getMatrix4 } from '@app/utils';
import BoxCache from './BoxCache';
import addMatrix4Tween from './matrix4Tween';

function createStepAnimation(
  p: ProjectSettings,
  sequence: THREE.Vector3[][],
  boxSize: number,
  delay: number,
) {
  const { stepDuration, timeline } = p;
  const cache = new BoxCache(boxSize);
  const group = new THREE.Group();
  let currentStep = -1;

  const fadeInTween = createTween({
    delay,
    duration: stepDuration * sequence.length,
    onStart: () => {},
    onUpdate: (progress: number) => {
      const progressStep = Math.min(Math.floor(progress * sequence.length), sequence.length - 1);
      if (progressStep !== currentStep) {
        currentStep = progressStep;

        group.remove(...group.children);

        sequence[currentStep].forEach((vector3) => {
          const box = cache.getNext();
          box.position.copy(vector3);
          group.add(box);
        });
      }
    },
    onComplete: () => {
      group.remove(...group.children);
    },
  });
  timeline.add(fadeInTween);

  return group;
}

export function createStepAnimation1(
  projectSettings: ProjectSettings,
  parentObject3d: THREE.Mesh | THREE.Group,
) {
  const p = { ...projectSettings, stepDuration: projectSettings.stepDuration * 2 };
  const boxSize = 0.3;
  const delay = 0.01;
  const sequenceLength = 16;
  const sequence: THREE.Vector3[][] = [];
  for (let i = 0; i < sequenceLength; i += 1) {
    if (i % 2 === 0) {
      sequence.push([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(boxSize, boxSize, 0),
      ]);
    } else {
      sequence.push([
        new THREE.Vector3(boxSize, 0, 0),
        new THREE.Vector3(0, boxSize, 0),
      ]);
    }
  }

  const group = createStepAnimation(p, sequence, boxSize, delay);
  parentObject3d.add(group);
  addMatrix4Tween(p, group, {
    delay,
    duration: p.stepDuration * sequence.length,
    fromMatrix4: getMatrix4({ x: 6, y: -4, z: 1, ry: 0 }),
    toMatrix4: getMatrix4({ x: 8, y: -4, z: 2, ry: 2 }),
  });
}

export function createStepAnimation2(
  projectSettings: ProjectSettings,
  parentObject3d: THREE.Mesh | THREE.Group,
) {
  const p = { ...projectSettings, stepDuration: projectSettings.stepDuration * 0.5 };
  const boxSize = 0.3;
  const delay = p.stepDuration * 16;
  const sequenceLength = 64;
  const sequence: THREE.Vector3[][] = [];
  for (let i = 0; i < sequenceLength; i += 1) {
    const boxes = [];
    for (let j = 0; j < 8; j += 1) {
      boxes.push(new THREE.Vector3(
        (3 - Math.round(Math.random() * 6)) * boxSize,
        (3 - Math.round(Math.random() * 6)) * boxSize,
        (3 - Math.round(Math.random() * 6)) * boxSize,
      ));
    }
    sequence.push(boxes);
  }

  const group = createStepAnimation(p, sequence, boxSize, delay);
  parentObject3d.add(group);
  addMatrix4Tween(p, group, {
    delay,
    duration: p.stepDuration * sequence.length,
    fromMatrix4: getMatrix4({ x: 12, y: -4, z: 1, ry: 0 }),
    toMatrix4: getMatrix4({ x: 2, y: -4, z: 2, ry: -4 }),
  });
}
