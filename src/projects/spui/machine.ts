import { ExtendedObject3D, THREE, Types } from 'enable3d';
import MainScene from '@app/mainscene';
import createTween from '@app/tween';
import { Timeline } from '@app/timeline';
import { getAngleRadians, getDistance } from '@app/utils';
import { createSVG } from './actor-mesh';

interface MachineConfig {
  delay?: number;
  duration: number;
  ground: Types.ExtendedObject3D;
  isFlipped?: boolean;
  radiusLarge?: number;
  radiusMotor?: number;
  scene3d: MainScene;
  svgWheelLarge?: string;
  svgWheelMotor?: string;
  timeline: Timeline;
  x?: number;
  xWheelDistance?: number;
  yMotor?: number;
  z?: number;
}

const DOUBLE_PI = Math.PI * 2;
const SVG_WHEEL_SIZE = 1000;
const DEPTH = 0.05;
const BAR_WHEEL_MARGIN = 0.05;

async function createWheel(
  mass: number,
  radius: number,
  scene3d: MainScene,
  svgPath: string,
  x: number,
  y: number,
  z: number,
) {
  const svgScale = (radius * 2) / SVG_WHEEL_SIZE;
  const svgMesh = await createSVG(
    svgPath,
    svgScale,
    undefined,
    DEPTH,
  );
  const geometry = svgMesh.geometry.clone();
  // the canvas should exactly cover the SVG extrude front
  const sizeVector = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox?.getSize(sizeVector);
  const wRepeat = (1 / sizeVector.x) * svgScale;
  const hRepeat = (1 / sizeVector.y) * svgScale * -1;
  const texture = new THREE.TextureLoader().load('../assets/projects/spui/texture-rust2.jpg');
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-radius, radius, DEPTH * -0.5);
  const wheel = new ExtendedObject3D();
  wheel.add(mesh);
  wheel.position.set(x, y, z);
  scene3d.scene.add(wheel);
  scene3d.physics.add.existing(wheel, {
    mass,
    shape: 'mesh',
  });
  return wheel;
}

export default async function createPhysicsMachine({
  delay = 0.1,
  duration,
  ground,
  isFlipped = false,
  radiusLarge = 1,
  radiusMotor = 0.5,
  scene3d,
  svgWheelLarge = '../assets/projects/spui/wheel1.svg',
  svgWheelMotor = '../assets/projects/spui/wheel2.svg',
  timeline,
  x = -1.4,
  xWheelDistance = 3.4,
  yMotor = 1.8,
  z = 3.5,
}: MachineConfig) {
  const flip = isFlipped ? -1 : 1;
  const y = ground.position.y + 0.4;

  // WHEEL_MOTOR
  const wheelMotor = await createWheel(
    10,
    radiusMotor,
    scene3d,
    svgWheelMotor,
    x + (xWheelDistance * flip),
    y + yMotor,
    z,
  );
  wheelMotor.body.setCollisionFlags(2); // make it kinematic

  // BAR
  const barWheelSideY = y + radiusLarge;
  const barMotorSideY = y + yMotor + radiusMotor - BAR_WHEEL_MARGIN;
  const barY = Math.min(barWheelSideY, barMotorSideY)
    + (Math.abs(barWheelSideY - barMotorSideY) / 2);
  const barRotateZ = getAngleRadians(0, barWheelSideY, xWheelDistance, barMotorSideY) * flip;
  const barLength = getDistance(0, barWheelSideY, xWheelDistance, barMotorSideY);
  const bar = scene3d.add.box({
    depth: DEPTH,
    height: DEPTH,
    width: barLength,
    x: x + ((xWheelDistance / 2) * flip),
    y: barY,
    z: z + 0.09,
  });
  bar.rotation.z = barRotateZ;
  scene3d.physics.add.existing(bar, { mass: 0.5 });

  // BAR CAP LEFT
  const capLeft = scene3d.add.cylinder({
    height: 0.08,
    radiusBottom: 0.07,
    radiusSegments: 24,
    radiusTop: 0.07,
    x: (barLength / -2) * flip,
  });
  capLeft.rotation.x = Math.PI * 0.5;
  bar.add(capLeft);

  // BAR CAP RIGHT
  const capRight = scene3d.add.cylinder({
    height: 0.08,
    radiusBottom: 0.05,
    radiusSegments: 24,
    radiusTop: 0.05,
    x: (barLength / 2) * flip,
  });
  capRight.rotation.x = Math.PI * 0.5;
  bar.add(capRight);

  // WHEEL_LARGE
  const wheelLarge = await createWheel(
    1,
    radiusLarge,
    scene3d,
    svgWheelLarge,
    x,
    y + radiusLarge,
    z,
  );

  // const wheelLarge = scene3d.add.cylinder({
  //   height: 0.05,
  //   radiusBottom: radiusLarge,
  //   radiusSegments: 64,
  //   radiusTop: radiusLarge,
  //   x,
  //   y: ground.position.y + radiusLarge,
  //   z,
  // });
  // wheelLarge.rotation.x = Math.PI * 0.5;
  // scene3d.physics.add.existing(wheelLarge, { mass: 0.01 });
  // wheelLarge.body.setFriction(0.5);

  // RAIL
  scene3d.physics.add.box({
    depth: 0.05,
    height: 0.2,
    width: 1,
    x,
    y: ground.position.y + 0.4 + 0.05,
    z: z - 0.05 - (isFlipped ? 0.05 : 0),
    mass: 0,
  });

  // GROUND TO WHEEL_MOTOR: HINGE
  const pivotOnGround: Types.XYZ = {
    x: x + (xWheelDistance * flip), y: 0.4 + yMotor, z: z - ground.position.z };
  const pivotOnWheelM: Types.XYZ = { x: 0, y: 0, z: 0 };
  const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  const hingeWheelMAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  scene3d.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
    pivotA: { ...pivotOnGround },
    pivotB: { ...pivotOnWheelM },
    axisA: { ...hingeGroundAxis },
    axisB: { ...hingeWheelMAxis },
  });

  { // WHEEL_MOTOR TO BAR: HINGE
    const pivotOnWheel: Types.XYZ = { x: 0, y: (radiusMotor - 0.05) * 1, z: 0 };
    const pivotOnBar: Types.XYZ = { x: (barLength / 2) * flip, y: 0, z: -0.11 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeBarAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    scene3d.physics.add.constraints.hinge(wheelMotor.body, bar.body, {
      pivotA: { ...pivotOnWheel },
      pivotB: { ...pivotOnBar },
      axisA: { ...hingeWheelAxis },
      axisB: { ...hingeBarAxis },
    });
  }

  { // BAR TO WHEEL_LARGE: HINGE
    const pivotOnBar: Types.XYZ = { x: (barLength / -2) * flip, y: 0, z: -0.09 };
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: 0 }; // z: -radiusLarge + 0.05
    const hingeBarAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    scene3d.physics.add.constraints.hinge(bar.body, wheelLarge.body, {
      pivotA: { ...pivotOnBar },
      pivotB: { ...pivotOnWheel },
      axisA: { ...hingeBarAxis },
      axisB: { ...hingeWheelAxis },
    });
  }

  // MOTOR HINGE TWEEN
  const tween = createTween({
    delay,
    duration,
    onStart: () => {},
    onUpdate: (progress: number) => {
      wheelMotor.rotation.z = progress * DOUBLE_PI * flip;
      wheelMotor.body.needUpdate = true;
    },
  });
  timeline.add(tween);
}
