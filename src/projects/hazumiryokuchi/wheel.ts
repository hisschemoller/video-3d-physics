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

export default async function createWheel(
  scene3d: MainScene,
  timeline: Timeline,
  patternDuration: number,
  z: number,
) {
  const x = 0;
  const y = 2;
  const textureUrl = '../assets/projects/hazumiryokuchi/texture-rust.jpg';
  const svgPath = '../assets/projects/hazumiryokuchi/wheel1.svg';
  const svgScale = (RADIUS * 2) / SVG_WHEEL_SIZE;
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
    map: texture,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-RADIUS, 0, RADIUS);
  mesh.rotation.x = Math.PI / 2;

  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.add(mesh);
  scene3d.scene.add(group);

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

interface NewspaperArgs {
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
}: NewspaperArgs) {
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

interface SphereArgs {
  scene3d: MainScene;
  wheel: ExtendedObject3D;
  cylinderHeight?: number;
  cylinderRadius?: number;
  sphereRadius?: number;
  xOffset?: number;
  zOffset?: number;
}

export function addSphere({
  scene3d,
  wheel,
  cylinderHeight = 4,
  cylinderRadius = 0.02,
  sphereRadius = 0.3,
  xOffset = 0,
  zOffset = 0,
}: SphereArgs) {
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
