import { ExtendedObject3D } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';

interface PoleArgs {
  box: {
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  },
  tween: [ x: number, y: number, z: number ],
  position?: number,
  duration?: number,
}

export default function createPole(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  { box: {
    x,
    y,
    z,
    w: width,
    h: height,
    d: depth,
  },
  }: PoleArgs,
) {
  const material = scene3d.add.material(
    { lambert: { color: 'yellow', transparent: true, opacity: 0.5 } },
  );
  const box = scene3d.physics.add.box({
    x, y, z, width, height, depth, mass: 0,
  }, { custom: material });
}
