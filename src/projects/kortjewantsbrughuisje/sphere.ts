import { ExtendedObject3D } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings } from './interfaces';

interface SphereArgs {
  duration: number;
}

export default function createSphere(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  {
    duration,
  }: SphereArgs,
) {
  scene3d.physics.add.box({
    x: -2, y: 1.7, z: 0.4, mass: 0, height: 0.1, width: 1, depth: 0.6,
  }, { phong: { color: 0x333333 } });

  let sphere : ExtendedObject3D;
  const sphereConfig = {
    x: -2, y: 2.2, z: 0.4, radius: 0.28, mass: 10,
  };
  const materialConfig = { lambert: { color: 0x333333 } };
  const tween = createTween({
    duration,
    onStart: () => {
      sphere = scene3d.physics.add.sphere(sphereConfig, materialConfig);
      sphere.body.applyImpulse({ x: -10 }, {});
    },
    onComplete: () => {
      sphere.remove();
    },
  });
  timeline.add(tween);
}
