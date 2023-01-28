import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import createTween from '@app/tween';
import BoxCache from './BoxCache';

function createStepAnimation(
  p: ProjectSettings,
  sequence: THREE.Vector3[][],
  boxSize: number,
) {
  const { stepDuration, timeline } = p;
  const cache = new BoxCache(boxSize);
  const group = new THREE.Group();
  const duration = stepDuration * sequence.length;
  let currentStep = -1;

  const fadeInTween = createTween({
    delay: 0.01,
    duration,
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

export default function createStepAnimation1(
  projectSettings: ProjectSettings,
  parentObject3d: THREE.Mesh | THREE.Group,
) {
  const p = { ...projectSettings, stepDuration: projectSettings.stepDuration * 2 };
  const boxSize = 0.5;
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

  const group = createStepAnimation(p, sequence, boxSize);
  group.position.set(6, -4, 1);
  parentObject3d.add(group);
}
