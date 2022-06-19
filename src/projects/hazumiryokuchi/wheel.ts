/* eslint-disable no-param-reassign */
import { ExtendedObject3D, THREE } from 'enable3d';
import { Material } from 'three';
import createTween from '@app/tween';
import MainScene from '@app/mainscene';
import { Timeline } from '@app/timeline';
import { createSVG } from './actor-mesh';

const RADIUS = 3.5;
const DOUBLE_PI = Math.PI * 2;
const SVG_WHEEL_SIZE = 1000;
const DEPTH = 0.05;
const CYLINDER_RADIUS = 0.025;

async function createCylinder(
  height: number,
  radius: number,
  rotation: number,
) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height);
  const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotateY(rotation);
  // cylinder.rotateX(Math.PI * -0.025);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;

  return cylinder;
}

async function createWheel(
  svgPath: string,
  textureUrl: string,
  wheelRadius: number,
) {
  const svgScale = (wheelRadius * 2) / SVG_WHEEL_SIZE;
  const svgMesh = await createSVG(
    svgPath,
    svgScale,
    undefined,
    DEPTH,
  );
  const geometry = svgMesh.geometry.clone();

  // the canvas should exactly cover the SVG extrude front
  const sizeVector = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox?.getSize(sizeVector);
  const wRepeat = (1 / sizeVector.x) * svgScale;
  const hRepeat = (1 / sizeVector.y) * svgScale * -1;

  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  const material = new THREE.MeshPhongMaterial({
    // map: texture,
    color: 0xcccccc,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-wheelRadius, 0, wheelRadius);
  mesh.rotation.x = Math.PI / 2;

  return mesh;
}
export async function addCylinderWheel({
  parent,
  timeline,
  patternDuration,
  cylinderHeight,
  distanceFromCenter,
  rotation,
  wheelRadius,
  y,
}: {
  parent: THREE.Group;
  timeline: Timeline;
  patternDuration: number;
  cylinderHeight: number;
  distanceFromCenter: number;
  rotation: number;
  wheelRadius: number;
  y: number;
}) {
  // console.log('parent.position.y', parent.position.y);
  const group = new THREE.Group();
  group.position.setX(Math.sin(rotation) * distanceFromCenter);
  group.position.setY(y);
  group.position.setZ(Math.cos(rotation) * distanceFromCenter);
  parent.add(group);

  // const axesHelper = new THREE.AxesHelper(25);
  // group.add(axesHelper);

  const svgPath = '../assets/projects/hazumiryokuchi/wheel2.svg';
  const textureUrl = '../assets/projects/hazumiryokuchi/texture-rust.jpg';
  const wheelMesh = await createWheel(svgPath, textureUrl, wheelRadius);
  wheelMesh.position.setY(cylinderHeight * -1);
  group.add(wheelMesh);

  const cylinder = await createCylinder(cylinderHeight, 0.022, rotation);
  cylinder.position.setY(cylinderHeight * -0.5);
  group.add(cylinder);

  const tween = createTween({
    delay: 0,
    duration: patternDuration * 0.999,
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * DOUBLE_PI * -2;
    },
  });
  timeline.add(tween);
  // console.log('wheel.position.y', group.position.y);

  return group;
}

export async function addBead({
  parent,
  bead,
  beadImagePath,
}: {
  parent: THREE.Group;
  bead: THREE.Mesh;
  beadImagePath: string;
}) {
  if (bead.material instanceof Material) {
    const texture = new THREE.TextureLoader().load(beadImagePath);
    bead.material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 90,
      // side: THREE.DoubleSide,
    });
  }
  bead.castShadow = true;
  bead.receiveShadow = true;
  bead.position.set(0, 0, 0);
  parent.add(bead);
  return bead;
}

export async function addLine({
  parent,
  cylinderHeight,
  distanceFromCenter,
  rotation,
}: {
  parent: THREE.Group;
  cylinderHeight: number;
  distanceFromCenter: number;
  rotation: number;
}) {
  const group = new THREE.Group();
  group.rotateY(rotation);
  group.rotateX(Math.PI * -0.025);
  group.position.setX(Math.sin(rotation) * distanceFromCenter);
  group.position.setZ(Math.cos(rotation) * distanceFromCenter);
  parent.add(group);

  const line = await createCylinder(cylinderHeight, CYLINDER_RADIUS, rotation);
  line.position.setY(cylinderHeight / -2);
  group.add(line);
  return group;
}

export default async function addMainWheel(
  scene3d: MainScene,
  timeline: Timeline,
  patternDuration: number,
  z: number,
) {
  const group = new THREE.Group();
  group.position.set(0, 2, z);
  scene3d.scene.add(group);

  const svgPath = '../assets/projects/hazumiryokuchi/wheel1.svg';
  const textureUrl = '../assets/projects/hazumiryokuchi/texture-rust.jpg';
  const wheelMesh = await createWheel(svgPath, textureUrl, RADIUS);
  group.add(wheelMesh);

  const tween = createTween({
    delay: 0,
    duration: patternDuration * 0.999,
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * DOUBLE_PI * -1;
    },
  });
  timeline.add(tween);

  return group;
}

export function addNewspaper({
  scene3d,
  timeline,
  wheel,
  cylinderHeight = 4,
  cylinderRadius = 0.02,
  distanceFromCenter = 0,
  rotation = 0,
  patternDuration,
  paperObject,
  paperImagePath,
}: {
  scene3d: MainScene;
  timeline: Timeline;
  wheel: THREE.Group;
  cylinderHeight?: number;
  cylinderRadius?: number;
  distanceFromCenter?: number;
  rotation?: number;
  patternDuration: number,
  paperObject?: THREE.Mesh | undefined;
  paperImagePath?: string;
}) {
  const cylinder = scene3d.add.cylinder({
    height: cylinderHeight,
    radiusBottom: cylinderRadius,
    radiusTop: cylinderRadius,
    x: 0 + (Math.sin(rotation) * distanceFromCenter),
    y: 0 - (cylinderHeight / 2),
    z: 0 + (Math.cos(rotation) * distanceFromCenter),
  });
  cylinder.rotateY(rotation);
  cylinder.rotateX(Math.PI * -0.025);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  wheel.add(cylinder);

  if (paperObject && paperImagePath) {
    if (paperObject.material instanceof Material) {
      const texture = new THREE.TextureLoader().load(paperImagePath);
      (paperObject.material as THREE.MeshBasicMaterial).map = texture;
      paperObject.material.side = THREE.DoubleSide;
      paperObject.castShadow = true;
      paperObject.receiveShadow = true;
    }
    const { x, y, z } = cylinder.position;
    paperObject.position.set(x, y + (cylinderHeight / -2), z);
    wheel.add(paperObject);

    const tween = createTween({
      delay: 0,
      duration: patternDuration * 0.999,
      onStart: () => {},
      onUpdate: (progress: number) => {
        paperObject.rotation.y = progress * DOUBLE_PI * -3;
      },
    });
    timeline.add(tween);
  }
}

export function addSphere({
  scene3d,
  wheel,
  cylinderHeight = 4,
  cylinderRadius = 0.02,
  sphereRadius = 0.3,
  xOffset = 0,
  zOffset = 0,
}: {
  scene3d: MainScene;
  wheel: ExtendedObject3D;
  cylinderHeight?: number;
  cylinderRadius?: number;
  sphereRadius?: number;
  xOffset?: number;
  zOffset?: number;
}) {
  const { x, y, z } = wheel.position;

  const cylinder = scene3d.physics.add.cylinder({
    height: cylinderHeight,
    radiusBottom: cylinderRadius,
    radiusTop: cylinderRadius,
    x: x + xOffset,
    y: y - (cylinderHeight / 2),
    z: z + zOffset,
  });
  // scene3d.physics.add.constraints.lock(wheel.body, cylinder.body);
  scene3d.physics.add.constraints.pointToPoint(wheel.body, cylinder.body, {
    pivotA: { x: xOffset, y: zOffset },
    pivotB: { y: cylinderHeight / 2 },
  });

  const sphere = scene3d.physics.add.sphere({
    mass: 0.1,
    radius: sphereRadius,
    x: x + xOffset,
    y: y - cylinderHeight,
    z: z + zOffset,
  });
  scene3d.physics.add.constraints.lock(cylinder.body, sphere.body);
}

export function addTweenOnLine(
  bead: THREE.Mesh | THREE.Group,
  timeline: Timeline,
  stepDuration: number,
  delay: number,
  duration: number,
  startY: number,
  endY: number,
) {
  const tween = createTween({
    delay: delay * stepDuration,
    duration: duration * stepDuration,
    ease: 'sineInOut',
    onStart: () => {},
    onUpdate: (progress: number) => {
      bead.position.y = -startY - (progress * (endY - startY));
    },
    onComplete: () => {},
  });
  timeline.add(tween);
}

export async function addWheel({
  parent,
  radius,
  timeline,
  patternDuration,
  speed,
}: {
  parent: THREE.Group;
  radius: number;
  timeline: Timeline;
  patternDuration: number;
  speed: number;
}) {
  const group = new THREE.Group();
  parent.add(group);

  const svgPath = '../assets/projects/hazumiryokuchi/wheel2.svg';
  const textureUrl = '../assets/projects/hazumiryokuchi/texture-rust.jpg';
  const wheelMesh = await createWheel(svgPath, textureUrl, radius);
  group.add(wheelMesh);

  const tween = createTween({
    delay: 0,
    duration: patternDuration * 0.999,
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * DOUBLE_PI * speed;
    },
  });
  timeline.add(tween);

  return group;
}
