import { THREE } from 'enable3d';
import { getMatrix } from '@app/utils';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';

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
  vp3dWidth: number;
  vp3dHeight: number;
  projectPxWidth: number;
  projectPxHeight: number;
}

const DOUBLE_PI = Math.PI * 2;

export function createTube({
  scene, timeline, xPx, yPx, z, duration, curve, angleY, angleZ, phase = 0,
  vp3dWidth,
  vp3dHeight,
  projectPxWidth,
  projectPxHeight,
}: TubeArgs) {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (vp3dWidth / projectPxWidth);
  const y3d = yPx * (vp3dHeight / projectPxHeight);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (vp3dWidth / 2);
  const yVP = (y3d - (vp3dHeight / 2)) * -1;

  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.05, 16, false);
  const texture = new THREE.TextureLoader().load('assets/projects/plantageparklaan/pipe1.jpg');
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
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

export function createSkyTube({
  scene, timeline, xPx, yPx, z, duration, curve, angleY, angleZ, phase = 0,
  vp3dWidth,
  vp3dHeight,
  projectPxWidth,
  projectPxHeight,
}: TubeArgs) {
  // translate position and size of image section in px to 3d units so it covers the surface
  const x3d = xPx * (vp3dWidth / projectPxWidth);
  const y3d = yPx * (vp3dHeight / projectPxHeight);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (vp3dWidth / 2);
  const yVP = (y3d - (vp3dHeight / 2)) * -1;

  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve3, 40, 0.03, 16, false);
  const material = new THREE.MeshPhongMaterial(
    { color: 0xbdd2ec, opacity: 0.4, transparent: true },
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, z }));
  // mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      mesh.rotation.y = Math.cos(phasedProgress * DOUBLE_PI) * angleY;
      mesh.rotation.z = Math.cos(phasedProgress * DOUBLE_PI) * angleZ;
      mesh.position.y = yVP + (Math.cos(phasedProgress * DOUBLE_PI) * 0.03);
    },
  });
  timeline.add(tween);
}
