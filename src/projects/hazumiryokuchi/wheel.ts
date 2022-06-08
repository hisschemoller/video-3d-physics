import { ExtendedObject3D, THREE } from 'enable3d';
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
  const mass = 1;
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
  mesh.position.set(-RADIUS, RADIUS, DEPTH * -0.5);
  const wheel = new ExtendedObject3D();
  wheel.add(mesh);
  wheel.position.set(x, y, z);
  wheel.rotation.x = Math.PI / 2;
  scene3d.scene.add(wheel);
  scene3d.physics.add.existing(wheel, {
    mass,
    shape: 'mesh',
  });
  wheel.body.setCollisionFlags(2); // make it kinematic

  // MOTOR HINGE TWEEN
  const tween = createTween({
    delay: 0,
    duration: patternDuration * 0.999,
    onStart: () => {},
    onUpdate: (progress: number) => {
      wheel.rotation.z = progress * DOUBLE_PI;
      wheel.body.needUpdate = true;
    },
  });
  timeline.add(tween);

  return wheel;
}

export function addSphere(
  scene3d: MainScene,
  wheel: ExtendedObject3D,
) {
  const { x, y, z } = wheel.position;
  console.log(x, y, z);
  const box = scene3d.physics.add.box({
    x,
    y: y - 4,
    z: z + 2,
  }, { lambert: { color: 'hotpink' } });
  scene3d.physics.add.constraints.pointToPoint(wheel.body, box.body, {
    pivotA: { y: 2 },
    pivotB: { y: 4 },
  });
}
