import { ExtendedObject3D, Types } from 'enable3d';
import createTween from '@app/tween';
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
  connector: { radius: number, height: number },
  pivotBlock: Types.XYZ,
  pivotConnectorToBlock: Types.XYZ,
  tween: { axis: 'x' | 'y' | 'z', distance: number },
  position: number,
  duration: number,
}

const DOUBLE_PI = Math.PI * 2;

export default function createPole(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  {
    box: {
      x,
      y,
      z,
      w: width,
      h: height,
      d: depth,
    },
    connector: connData,
    pivotBlock,
    pivotConnectorToBlock,
    tween: {
      axis,
      distance,
    },
    position,
    duration,
  }: PoleArgs,
) {
  // BLOCK
  const yellowMaterial = scene3d.add.material(
    { lambert: { color: 'yellow', transparent: true, opacity: 0.5 } },
  );
  const block = scene3d.physics.add.box({
    x, y, z, width, height, depth, collisionFlags: 2,
  }, { custom: yellowMaterial });

  // BLOCK TWEEN
  const phase = 0;
  const startPositionOnAxis = block.position[axis];
  const tween = createTween({
    duration,
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      const currentDistance = Math.sin(phasedProgress * DOUBLE_PI) * distance;
      block.position.y = startPositionOnAxis + currentDistance;
      block.body.needUpdate = true;
    },
  });
  timeline.add(tween);

  // CONNECTOR
  const connector = scene3d.physics.add.cylinder({
    radiusBottom: connData.radius, radiusTop: connData.radius, height: connData.height,
  }, { custom: yellowMaterial });

  // POINT_TO_POINT CONNECTOR TO BLOCK
  scene3d.physics.add.constraints.pointToPoint(block.body, connector.body, {
    // the offset from the center of each object
    pivotA: { ...pivotBlock },
    pivotB: { ...pivotConnectorToBlock },
  });
}
