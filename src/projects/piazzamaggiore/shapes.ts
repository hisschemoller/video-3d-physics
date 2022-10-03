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

async function createTwoBlackCircles({
  gltf, patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const scale = 0.5 / 1024;

  const circleLeft = await createActor(projectSettings, {
    height: 949,
    imgSrc: '../assets/projects/piazzamaggiore/muur_rechts_gat2.jpg',
    width: 1004,
  }, {
    imageRect: { w: 949, h: 1004 },
    svg: { depth: 0.003, scale, url: '../assets/projects/piazzamaggiore/circle2.svg' },
  });
  circleLeft.setStaticPosition(getMatrix4({ x: -0.4 }));
  circleLeft.setStaticImage(0, 0);

  const circleRight = circleLeft.getMesh().clone();
  circleRight.position.x = 0.4;

  const group = new THREE.Group();
  group.position.set(-1.1, 4.0, -2.1);
  group.add(circleLeft.getMesh());
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
