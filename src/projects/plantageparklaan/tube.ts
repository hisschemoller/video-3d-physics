import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { VIEWPORT_3D_HEIGHT, VIEWPORT_3D_WIDTH, PROJECT_HEIGHT, PROJECT_WIDTH } from './scene';
import { BASE_COLOR } from './actor-mesh';

interface TubeArgs {
  scene: THREE.Scene;
  timeline: Timeline;
  xPx: number,
  yPx: number,
  z: number,
  duration: number,
  curve: [number, number, number][],
  angleY: number;
  angleZ: number;
  phase?: number;
};

const DOUBLE_PI = Math.PI * 2;

export function createTube({
  scene, timeline, xPx, yPx, z, duration, curve, angleY, angleZ, phase = 0,
}: TubeArgs) {

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
  const y3d = yPx * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (VIEWPORT_3D_WIDTH / 2);
  const yVP = (y3d - (VIEWPORT_3D_HEIGHT / 2)) * -1;

  const points = curve.map((curve) => new THREE.Vector3(...curve));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.05, 16, false);
  const texture = new THREE.TextureLoader().load( 'assets/projects/plantageparklaan/pipe1.jpg' );
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture, });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      mesh.rotation.y = Math.cos(phasedProgress * DOUBLE_PI) * angleY;
      mesh.rotation.z = Math.cos(phasedProgress * DOUBLE_PI) * angleZ;
    },
  });
  timeline.add(tween);
}
