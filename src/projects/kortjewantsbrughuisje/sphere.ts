import { ExtendedObject3D } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings } from './interfaces';

interface SphereArgs {
  x: number;
  y: number;
  z: number;
  position?: number;
  duration: number;
}

export default function createSphere(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  {
    x,
    y,
    z,
    position = 0,
    duration,
  }: SphereArgs,
) {
  let sphere : ExtendedObject3D;
  const sphereConfig = {
    x, y, z, radius: 0.27, mass: 10,
  };
  const materialConfig = { lambert: { color: 0x444444 } };
  const tween = createTween({
    delay: position,
    duration,
    onStart: () => {
      sphere = scene3d.physics.add.sphere(sphereConfig, materialConfig);
      sphere.body.applyImpulse({ x: -8 }, {});
    },
    onComplete: () => {
      sphere.remove();
    },
  });
  timeline.add(tween);
}
