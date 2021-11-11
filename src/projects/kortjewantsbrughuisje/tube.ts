import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
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

  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.04, 16, false);
  // const texture = new THREE.TextureLoader().load('assets/projects/plantageparklaan/pipe1.jpg');
  const material = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const endPoint = curve[curve.length - 1];
  const sphereConfig = {
    x: endPoint[0], y: endPoint[1], z: endPoint[2], radius: 0.15,
  };
  const materialConfig = { phong: { color: 0x444444 } };
  const sphere = scene3d.make.sphere(sphereConfig, materialConfig);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(sphere);
  group.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));

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
