import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import createTween from '@app/tween';

const BOX_COLOR = 0x333333;
const BOX_SIZE = 0.5;

function createBox() {
  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE),
    new THREE.MeshPhongMaterial({
      side: THREE.FrontSide, color: BOX_COLOR, transparent: true, opacity: 1,
    }),
  );
  return box;
}

function createStepAnimation(
  p: ProjectSettings,
  parentObject3d: THREE.Mesh | THREE.Group,
) {
  const { stepDuration, timeline } = p;

  const box = createBox();
  box.position.set(6, -4, 1);

  let currentStep = -1;
  const numSteps = 16;
  const duration = stepDuration * numSteps;
  const fadeInTween = createTween({
    delay: 0.01,
    duration,
    onStart: () => {
      parentObject3d.add(box);
    },
    onUpdate: (progress: number) => {
      const progressStep = Math.floor(progress * numSteps);
      if (progressStep !== currentStep) {
        currentStep = progressStep;
        console.log(currentStep);
        box.position.x = currentStep % 2 === 0 ? 6 : 6 + BOX_SIZE;
      }
    },
    onComplete: () => {
      parentObject3d.remove(box);
    },
  });
  timeline.add(fadeInTween);
}

export default function createStepAnimation1(
  p: ProjectSettings,
  parentObject3d: THREE.Mesh | THREE.Group,
) {
  createStepAnimation(p, parentObject3d);
}
