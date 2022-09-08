/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import createTween from '@app/tween';
import MainScene from '@app/mainscene';
import { Timeline } from '@app/timeline';
import { createSVG } from './actor-mesh';

const RADIUS = 3.5;
const DOUBLE_PI = Math.PI * 2;
const SVG_WHEEL_SIZE = 1000;
const DEPTH = 0.05;

async function createWheel(
  svgPath: string,
  textureUrl: string,
  wheelRadius: number,
): Promise<THREE.Mesh> {
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
    map: texture,
    color: 0xffffff,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-wheelRadius, wheelRadius, 0);
  // mesh.rotation.x = Math.PI / 2;

  return mesh;
}

export default async function addWheel(
  scene3d: MainScene,
  timeline: Timeline,
  patternDuration: number,
  direction: number = -1,
): Promise<THREE.Group> {
  const group = new THREE.Group();
  scene3d.scene.add(group);

  const svgPath = '../assets/projects/piazzamaggiore/wheel1.svg';
  const textureUrl = '../assets/projects/piazzamaggiore/texture-rust.jpg';
  const wheelMesh = await createWheel(svgPath, textureUrl, RADIUS);
  group.add(wheelMesh);

  const tween = createTween({
    delay: 0.1,
    duration: patternDuration * 0.999,
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * DOUBLE_PI * direction;
    },
  });
  timeline.add(tween);

  return group;
}
