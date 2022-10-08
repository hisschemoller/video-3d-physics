import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { ProjectSettings } from '@app/interfaces';
import { createSVG } from './actor-mesh';

export interface ShapeArgs {
  gltf: GLTF;
  patternDuration: number;
  projectSettings: ProjectSettings;
  scene: THREE.Scene;
  stepDuration: number;
  timeline: Timeline;
}

const TEST_IMAGE = '../assets/projects/test/testimage3d.jpg';
const WIRE_RADIUS = 0.01;
const EXTRUDE_DEPTH = 0.03;

async function createShape(
  projectSettings: ProjectSettings,
  svgScale: number,
  svgUrl: string,
  imgUrl: string,
) {
  const { scene } = projectSettings;
  const texture = new THREE.TextureLoader().load(imgUrl);
  const mesh = await createSVG(svgUrl, svgScale, texture, EXTRUDE_DEPTH, 0x888888);

  // the texture should exactly cover the SVG extrude front
  const sizeVector = new THREE.Vector3();
  mesh.geometry.computeBoundingBox();
  mesh.geometry.boundingBox?.getSize(sizeVector);
  const wRepeat = (1 / sizeVector.x) * svgScale;
  const hRepeat = (1 / sizeVector.y) * svgScale * -1;
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  mesh.position.set(-4, 5, -2.0);
  scene.add(mesh);
}

async function createTwoBlackCircles({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const svgScale = 0.5 / 1024;
  const svgUrl = '../assets/projects/piazzamaggiore/circle2.svg';
  const svgRadius = 0.22;

  const circleLeft = await createSVG(svgUrl, svgScale, undefined, 0.003, 0xaa0000);
  circleLeft.position.set(-0.4 - svgRadius - svgRadius, svgRadius, 0);
  circleLeft.castShadow = true;
  circleLeft.receiveShadow = true;

  const circleRight = circleLeft.clone();
  circleRight.position.set(0.4, svgRadius, 0);
  circleRight.castShadow = true;
  circleRight.receiveShadow = true;

  const connectWire = new THREE.Mesh(
    new THREE.CylinderGeometry(WIRE_RADIUS, WIRE_RADIUS, 0.8),
    new THREE.MeshPhongMaterial({ color: 0x333333 }),
  );
  connectWire.rotation.z = Math.PI * 0.5;
  connectWire.castShadow = true;
  connectWire.receiveShadow = true;

  const group = new THREE.Group();
  group.position.set(1.1, 4.0, -2.1);
  group.add(connectWire);
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
      group.rotation.y = progress * Math.PI * -8;
    },
  }));
}

export default function createShapes(shapeArgs: ShapeArgs) {
  createTwoBlackCircles(shapeArgs);
  // createShape(
  //   shapeArgs.projectSettings,
  //   8 / 1024,
  //   '../assets/projects/piazzamaggiore/shape1.svg',
  //   '../assets/projects/piazzamaggiore/shape1.jpg',
  // );
  createShape(
    shapeArgs.projectSettings,
    8 / 1024,
    '../assets/projects/piazzamaggiore/shape2.svg',
    '../assets/projects/piazzamaggiore/shape2.jpg',
  );
}
