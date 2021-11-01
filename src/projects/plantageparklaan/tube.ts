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
};

export function createTube({scene, timeline, xPx, yPx, z, duration}: TubeArgs) {

  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (VIEWPORT_3D_WIDTH / PROJECT_WIDTH);
  const y3d = yPx * (VIEWPORT_3D_HEIGHT / PROJECT_HEIGHT);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (VIEWPORT_3D_WIDTH / 2);
  const yVP = (y3d - (VIEWPORT_3D_HEIGHT / 2)) * -1;

  const curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 5, 0, 0.4 ),
    new THREE.Vector3( 6, 1, 0.2 )
  ] );
  const geometry = new THREE.TubeGeometry(curve, 40, 0.05, 16, false);
  const material = new THREE.MeshPhongMaterial({ color: BASE_COLOR });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
