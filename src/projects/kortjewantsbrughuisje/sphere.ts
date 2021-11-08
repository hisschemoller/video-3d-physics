// import { THREE } from 'enable3d';
// import { Timeline } from '@app/timeline';
import { ProjectSettings } from './interfaces';

// interface SphereArgs {
//   scene: THREE.Scene;
//   timeline: Timeline;
// }

export default function createSphere(
  {
    scene3d,
  }: ProjectSettings,
) {
  const bounciness = 0.6;
  scene3d.physics.add.sphere(
    {
      x: -2, y: 2.2, z: 0.4, radius: 0.3,
    },
    { lambert: { color: 0x333333 } },
  ).body.setBounciness(bounciness);
}
