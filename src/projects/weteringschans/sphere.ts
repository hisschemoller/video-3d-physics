import { ExtendedObject3D, THREE } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings } from './interfaces';

interface SphereArgs {
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius: number;
  position?: number;
  duration: number;
}

const BG_SCALE = 1.097;

export default function createSphere(
  {
    scene,
    scene3d,
    timeline,
    width,
    height,
    width3d,
    height3d,
  }: ProjectSettings,
  {
    x,
    y,
    w = 1,
    h = 1,
    position = 0,
    duration,
    radius = 0.27,
  }: SphereArgs,
) {
  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const x3d = x * (width3d / width);
  const y3d = y * (height3d / height);

  // translate image coordinates which are left top to 3D scene coordinates which are centered
  const xVP = x3d - (width3d / 2);
  const yVP = -y3d + (height3d / 2);

  // PLANE
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(w, h),
    new THREE.MeshPhongMaterial({ color: 0x000000, opacity: 0.7, transparent: true }),
  );
  plane.position.set(xVP * BG_SCALE, yVP * BG_SCALE, -0.9);
  scene.add(plane);

  // SPHERE
  let sphere : ExtendedObject3D;
  const spheres: ExtendedObject3D[] = [];
  const sphereConfig = {
    x: xVP, y: yVP + 0.8, z: -0.1 - radius, radius: radius * 0.5, mass: 1,
  };
  const materialConfig = {
    phong: {
      color: 0xcccccc, opacity: 0.6, transparent: true, shininess: 100,
    },
  };
  const sphereTween = createTween({
    delay: position,
    duration,
    onStart: () => {
      sphere = scene3d.physics.add.sphere(sphereConfig, materialConfig);
      sphere.body.applyImpulse({ y: -2.5, z: 0.5 }, {});
      spheres.unshift(sphere);
    },
    onComplete: () => {
      while (spheres.length > 2) {
        const sphereToRemove = spheres.pop();
        if (sphereToRemove) {
          scene3d.scene.remove(sphereToRemove);
          scene3d.physics.destroy(sphereToRemove);
        }
      }
    },
  });
  timeline.add(sphereTween);
}
