import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { createActor } from './actor';
import { createSVG } from './actor-mesh';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';

export interface ShapeArgs {
  gltf: GLTF;
  patternDuration: number;
  projectSettings: ProjectSettings;
  scene: THREE.Scene;
  stepDuration: number;
  timeline: Timeline;
}

const TEST_IMAGE = '../assets/projects/test/testimage3d.jpg';

async function createTwoBlackCircles({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const svgScale = 0.5 / 1024;
  const svgUrl = '../assets/projects/piazzamaggiore/circle2.svg';

  const circleLeft = await createSVG(svgUrl, svgScale, undefined, 0.003, 0xaa0000);
  circleLeft.position.x = 0;
  circleLeft.castShadow = true;
  circleLeft.receiveShadow = true;

  const circleRight = circleLeft.clone();
  circleRight.position.x = 0.4;
  circleRight.castShadow = true;
  circleRight.receiveShadow = true;

  const group = new THREE.Group();
  group.position.set(-1.1, 4.0, -2.1);
  group.add(circleLeft);
  group.add(circleRight);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * -4;
    },
  }));
}

export default function createShapes(shapeArgs: ShapeArgs) {
  createTwoBlackCircles(shapeArgs);
}
