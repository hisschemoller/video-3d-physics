import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { ProjectSettings } from '@app/interfaces';
import { createSVG } from './actor-mesh';
import { AxesHelper } from 'three';

export interface ShapeArgs {
  gltf: GLTF;
  patternDuration: number;
  projectSettings: ProjectSettings;
  scene: THREE.Scene;
  stepDuration: number;
  timeline: Timeline;
}

// const TEST_IMAGE = '../assets/projects/test/testimage3d.jpg';
const WIRE_RADIUS = 0.01;
const EXTRUDE_DEPTH = 0.03;
const Z = -2;

async function createShape(
  projectSettings: ProjectSettings,
  svgScale: number,
  svgUrl: string,
  imgUrl: string,
) {
  const { scene } = projectSettings;
  const texture = new THREE.TextureLoader().load(imgUrl);
  const mesh = await createSVG(svgUrl, svgScale, texture, EXTRUDE_DEPTH, 0x888888);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

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
  return mesh;
}

async function createShape1({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.5 / 1024,
    '../assets/projects/piazzamaggiore/shape1.svg',
    '../assets/projects/piazzamaggiore/shape1.jpg',
  );
  mesh.position.set(-0.6, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-1, 1, Z);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * 8;
    },
  }));
}

async function createShape2({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    5 / 1024,
    '../assets/projects/piazzamaggiore/shape2.svg',
    '../assets/projects/piazzamaggiore/shape2.jpg',
  );
  mesh.rotation.y = -0.3;
  mesh.position.set(-3, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-1, -1.9, Z);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.499,
    ease: 'sineInOut',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = -0.1 + (progress * Math.PI * 0.2);
    },
  }));
  timeline.add(createTween({
    delay: stepDuration + (patternDuration * 0.5),
    duration: patternDuration * 0.499,
    ease: 'sineInOut',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = -0.1 + ((1 - progress) * Math.PI * 0.2);
    },
  }));
}

async function createShape3({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.8 / 1024,
    '../assets/projects/piazzamaggiore/shape3.svg',
    '../assets/projects/piazzamaggiore/shape3.jpg',
  );
  mesh.rotation.z = Math.PI * 0.47;
  mesh.position.set(-0.75, -1, 0);

  const mesh2 = mesh.clone();
  mesh2.rotation.y = Math.PI * 0.5;
  mesh2.position.set(0, -1, 0.75);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(mesh2);
  // group.rotation.z = 0.6;
  group.position.set(0.75, -0.4, Z);
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

async function createShape4({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.6 / 1024,
    '../assets/projects/piazzamaggiore/shape4.svg',
    '../assets/projects/piazzamaggiore/shape4.jpg',
  );
  mesh.position.set(-0.7, 0.5, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(1.2, 3.8, Z);
  scene.add(group);

  for (let i = 0; i < 8; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.125),
      duration: patternDuration * 0.1249,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.rotation.z = -1 + (prog * Math.PI * 0.7);
        // group.rotation.y = 0.3 + (prog * Math.PI * -0.3);
      },
    }));
  }
}

async function createShape5({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.6 / 1024,
    '../assets/projects/piazzamaggiore/shape5.svg',
    '../assets/projects/piazzamaggiore/shape5.jpg',
  );
  mesh.position.set(-0.75, 0.75, 0);
  // mesh.add(new AxesHelper(1));

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(0.75, 2.6, Z + 0.1);
  scene.add(group);
  // group.add(new AxesHelper(2));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 1.3 + (prog * 1.7);
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
      group.rotation.z = progress * Math.PI * 4;
    },
  }));
}

async function createShape6({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.0 / 1024,
    '../assets/projects/piazzamaggiore/shape6.svg',
    '../assets/projects/piazzamaggiore/shape6.jpg',
  );
  mesh.position.set(-0.5, -1, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-1, 3.5, Z);
  scene.add(group);
}

async function createShape7({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.0 / 1024,
    '../assets/projects/piazzamaggiore/shape7.svg',
    '../assets/projects/piazzamaggiore/shape7.jpg',
  );
  mesh.rotation.z = Math.PI * 0.3;
  mesh.position.set(-0.6, -0.2, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-3.5, 3.8, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 3.8 - (prog * 2.5);
      },
    }));
  }
}

async function createTwoRedCircles({
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
  group.position.set(0.75, 2.0, -2.1);
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
  // createTwoRedCircles(shapeArgs);
  createShape1(shapeArgs);
  createShape2(shapeArgs);
  createShape3(shapeArgs);
  createShape4(shapeArgs);
  createShape5(shapeArgs);
  createShape6(shapeArgs);
  createShape7(shapeArgs);
}
