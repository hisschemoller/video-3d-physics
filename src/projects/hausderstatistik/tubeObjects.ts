/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import createTween, { EaseFunction } from '@app/tween';

export function oscillateOnAxis(
  projectSettings: ProjectSettings,
  object3d: THREE.Mesh | THREE.Group,
  delay: number,
  duration: number,
  oscillations: number,
  amplitude: number,
  offset: number = 0,
) {
  const { stepDuration, timeline } = projectSettings;

  const tween = createTween({
    delay: stepDuration * delay,
    duration: stepDuration * duration,
    onStart: () => {
      object3d.visible = true;
    },
    onUpdate: async (progress: number) => {
      // object3d.position.y = progress * Math.PI * oscillations;
      object3d.position.y = Math.sin((progress + offset) * oscillations * Math.PI) * amplitude;
    },
    onComplete: () => {
      // FIXME: removed for Prins Hendrikkade
      // mesh.visible = false;
    },
  });
  timeline.add(tween);
}

export function rotateAroundAxis(
  projectSettings: ProjectSettings,
  object3d: THREE.Mesh | THREE.Group,
  delay: number,
  duration: number,
  rotations: number,
  ease: keyof typeof EaseFunction = 'linear',
) {
  const { stepDuration, timeline } = projectSettings;

  const tween = createTween({
    delay: stepDuration * delay,
    duration: stepDuration * duration,
    ease,
    onStart: () => {
      object3d.visible = true;
    },
    onUpdate: async (progress: number) => {
      object3d.rotation.y = progress * Math.PI * rotations;
    },
    onComplete: () => {
      // FIXME: removed for Prins Hendrikkade
      // mesh.visible = false;
    },
  });
  timeline.add(tween);
}

export function createBox(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  color: number = 0x555555,
) {
  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(w, h, d),
    new THREE.MeshPhongMaterial({ color }),
  );
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.set(x, y, z);
  return box;
}

export function createTube(
  x: number,
  y: number,
  z: number,
  curve: [number, number, number][],
  radius: number = 0.05,
  color: number = 0x555555,
) {
  // const curve = [[0, 0, 0], [-0.2, 4, 0.2], [-0.5, 6, 0.5]];
  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);

  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve3, 128, radius, 4, false),
    new THREE.MeshPhongMaterial({ color, flatShading: true, shininess: 0 }),
  );
  tube.castShadow = true;
  tube.receiveShadow = true;
  tube.position.set(x, y, z);
  return tube;
}
