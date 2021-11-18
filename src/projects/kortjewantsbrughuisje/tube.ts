import { THREE } from 'enable3d';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { ProjectSettings } from './interfaces';

interface TubeArgs {
  xPx: number,
  yPx: number,
  z: number,
  duration: number,
  curve: [number, number, number][],
  angleY: number;
  angleZ: number;
  phase?: number;
}

const DOUBLE_PI = Math.PI * 2;

export default function createTube(
  {
    scene3d,
    timeline,
    width,
    height,
    width3d,
    height3d,
  }: ProjectSettings,
  {
    xPx,
    yPx,
    z,
    duration,
    curve,
    angleY,
    angleZ,
    phase = 0,
  }: TubeArgs,
) {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (width3d / width);
  const y3d = yPx * (height3d / height);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (width3d / 2);
  const yVP = (y3d - (height3d / 2)) * -1;

  // TUBE
  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.03, 16, false);
  const material = new THREE.MeshPhongMaterial({ color: 0x3a3a3a });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // SPHERE
  const endPoint = curve[curve.length - 1];
  // const sphereConfig = {
  //   x: endPoint[0], y: endPoint[1], z: endPoint[2], radius: 0.15,
  // };
  const cylinderConfig = {
    x: endPoint[0],
    y: endPoint[1],
    z: endPoint[2],
    radiusTop: 0.12,
    radiusBottom: 0.12,
    radiusSegments: 24,
    height: 0.3,
    heightSegments: 24,
  };
  const materialConfig = { phong: { color: 0x3a3a3a, shininess: 2 } };
  const sphere = scene3d.make.cylinder(cylinderConfig, materialConfig);

  // GROUP
  const group = new THREE.Group();
  group.add(mesh);
  group.add(sphere);
  group.applyMatrix4(getMatrix4({ x: xVP, y: yVP, z }));

  scene3d.scene.add(group);

  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      group.rotation.y = Math.cos(phasedProgress * DOUBLE_PI) * angleY;
      group.rotation.z = Math.cos(phasedProgress * DOUBLE_PI) * angleZ;
    },
  });
  timeline.add(tween);
}

export function createRoofTube(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  {
    duration,
  }: { duration: number },
) {
  // TUBE
  const curve = [[0, 0, 0], [0, 0.7, 0], [-0.1, 0.8, 0], [-0.2, 0.8, 0]];
  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.04, 16, false);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4466aa, opacity: 0.5, transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(getMatrix4({ x: -1.2, y: 2.6, z: 0.4 }));
  // mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene3d.scene.add(mesh);

  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      mesh.rotation.y = Math.sin(progress * DOUBLE_PI);
    },
  });
  timeline.add(tween);
}
