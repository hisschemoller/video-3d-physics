import { ExtendedObject3D, THREE, Types } from 'enable3d';
import createTween from '@app/tween';
import { ProjectSettings } from '@app/interfaces';

interface PoleArgs {
  ground: ExtendedObject3D,
  block: {
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  },
  connector: { radius: number, height: number },
  pivotBlockToConnector: Types.XYZ,
  pivotConnectorToBlock: Types.XYZ,
  pole: { radius: number, height: number },
  pivotPoleToConnector: Types.XYZ,
  pivotConnectorToPole: Types.XYZ,
  pivotPoleToGround: Types.XYZ,
  pivotGroundToPole: Types.XYZ,
  hingePoleToGroundAxis: Types.XYZ,
  blockTexture?: string,
  tween: { axis: 'x' | 'y' | 'z', distance: number, phase?: number },
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
    ground,
    block: {
      x,
      y,
      z,
      w: width,
      h: height,
      d: depth,
    },
    connector: connData,
    pivotBlockToConnector,
    pivotConnectorToBlock,
    pole: poleData,
    pivotPoleToConnector,
    pivotConnectorToPole,
    pivotPoleToGround,
    pivotGroundToPole,
    hingePoleToGroundAxis,
    blockTexture = 'assets/projects/weesperflat/texture-lightest.jpg',
    tween: {
      axis,
      distance,
      phase = 0,
    },
    position,
    duration,
  }: PoleArgs,
) {
  const yellowMaterial = scene3d.add.material(
    { lambert: { color: 0x8f7c63, transparent: false, opacity: 1 } },
  );
  // const mapHeight = new THREE.TextureLoader().load('assets/projects/weesperflat/bumpmap1.jpg');
  // const bumpMaterial = new THREE.MeshPhongMaterial({
  //   color: 0x8f7c63,
  //   specular: 0xcccccc,
  //   shininess: 1,
  //   bumpMap: mapHeight,
  //   bumpScale: 1,
  // });

  // BLOCK
  const texture = new THREE.TextureLoader().load(blockTexture);
  const blockMaterial = scene3d.add.material(
    { lambert: { map: texture } },
  );
  const block = scene3d.physics.add.box({
    x, y, z, width, height, depth, collisionFlags: 2,
  }, { custom: blockMaterial });

  // BLOCK TWEEN
  const startPositionOnAxis = block.position[axis];
  const tween = createTween({
    delay: position,
    duration,
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      const currentDistance = Math.sin(phasedProgress * DOUBLE_PI) * distance;
      block.position[axis] = startPositionOnAxis + currentDistance;
      block.body.needUpdate = true;
    },
  });
  timeline.add(tween);

  // CONNECTOR
  const connectorPos = new THREE.Vector3().lerpVectors(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(pivotGroundToPole.x, pivotPoleToGround.y, pivotGroundToPole.z),
    0.5,
  );
  const connector = scene3d.physics.add.cylinder({
    x: connectorPos.x,
    y: connectorPos.y,
    z: connectorPos.z,
    radiusBottom: connData.radius,
    radiusTop: connData.radius,
    height: connData.height,
  }, { custom: yellowMaterial });

  // POINT_TO_POINT CONNECTOR TO BLOCK
  scene3d.physics.add.constraints.pointToPoint(block.body, connector.body, {
    // the offset from the center of each object
    pivotA: { ...pivotBlockToConnector },
    pivotB: { ...pivotConnectorToBlock },
  });

  // POLE
  const pole = scene3d.physics.add.cylinder({
    x: pivotGroundToPole.x || 0,
    y: pivotPoleToGround.y || 0,
    z: pivotGroundToPole.z || 0,
    radiusBottom: poleData.radius,
    radiusTop: poleData.radius,
    height: poleData.height,
  }, { custom: yellowMaterial });

  // POLE TOP
  // const sphereRadius = 0.15;
  // const sphere = scene3d.physics.add.sphere({
  //   x: pivotGroundToPole.x || 0,
  //   y: (pivotPoleToGround.y || 0) + (poleData.height / 2) + (sphereRadius / 2),
  //   z: pivotGroundToPole.z || 0,
  //   radius: sphereRadius,
  // }, { custom: yellowMaterial });
  const bottomRadius = 0.2;
  const topRadius = 0.2;
  const topheight = 0.2;
  const top = scene3d.physics.add.cylinder({
    x: pivotGroundToPole.x || 0,
    y: (pivotPoleToGround.y || 0) + (poleData.height / 2) + (topheight / 2),
    z: pivotGroundToPole.z || 0,
    radiusBottom: bottomRadius,
    radiusTop: topRadius,
    height: topheight,
  }, { custom: yellowMaterial });

  // LOCK SPHERE TO POLE
  scene3d.physics.add.constraints.lock(pole.body, top.body);

  // POINT_TO_POINT POLE TO CONNECTOR
  scene3d.physics.add.constraints.pointToPoint(pole.body, connector.body, {
    pivotA: { ...pivotPoleToConnector },
    pivotB: { ...pivotConnectorToPole },
  });

  // HINGE POLE TO GROUND
  scene3d.physics.add.constraints.hinge(pole.body, ground.body, {
    pivotA: { ...pivotPoleToGround },
    pivotB: { ...pivotGroundToPole },
    axisA: { ...hingePoleToGroundAxis },
    axisB: { ...hingePoleToGroundAxis },
  });
}
