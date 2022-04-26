import { Types } from 'enable3d';
import MainScene from '@app/mainscene';

interface MachineConfig {
  ground: Types.ExtendedObject3D;
  scene3d: MainScene;
  z?: number;
}

export default function createPhysicsMachine({
  ground,
  scene3d,
  z = 3.5,
}: MachineConfig) {
  // WHEEL_MOTOR
  const wheelMotor = scene3d.add.cylinder({
    height: 0.05,
    radiusBottom: 0.5,
    radiusSegments: 64,
    radiusTop: 0.5,
    x: 2,
    y: 0,
    z,
  });
  wheelMotor.rotation.x = Math.PI * 0.5;
  scene3d.physics.add.existing(wheelMotor, { mass: 10 });

  // POLE
  const pole = scene3d.add.box({
    depth: 0.05,
    height: 0.05,
    width: 3.4,
    x: 0.3,
    y: 0.2,
    z: z + 0.11,
  });
  scene3d.physics.add.existing(pole, { mass: 0.5 });

  // WHEEL_LARGE
  const wheelLarge = scene3d.add.cylinder({
    height: 0.05,
    radiusBottom: 1,
    radiusSegments: 64,
    radiusTop: 1,
    x: -1.4,
    y: -1,
    z,
  });
  wheelLarge.rotation.x = Math.PI * 0.5;
  scene3d.physics.add.existing(wheelLarge, { mass: 0.1 });

  // RAIL
  scene3d.physics.add.box({
    depth: 0.05,
    height: 0.1,
    width: 1,
    x: -1.4,
    y: -1.9,
    z: z - 0.05,
    mass: 0,
  });

  // STOP
  scene3d.physics.add.box({
    depth: 0.05,
    height: 0.05,
    width: 0.05,
    x: -2.8,
    y: -1,
    z,
    mass: 0,
  });

  // GROUND TO WHEEL_MOTOR: HINGE
  const pivotOnGround: Types.XYZ = { x: 2, y: 2.2, z: z - ground.position.z };
  const pivotOnWheelM: Types.XYZ = { x: 0, y: 0, z: 0 };
  const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  const hingeWheelMAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
  const motorHinge = scene3d.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
    pivotA: { ...pivotOnGround },
    pivotB: { ...pivotOnWheelM },
    axisA: { ...hingeGroundAxis },
    axisB: { ...hingeWheelMAxis },
  });

  { // WHEEL_MOTOR TO POLE: HINGE
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: 0.45 };
    const pivotOnPole: Types.XYZ = { x: 1.7, y: 0, z: 0 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    scene3d.physics.add.constraints.hinge(wheelMotor.body, pole.body, {
      pivotA: { ...pivotOnWheel },
      pivotB: { ...pivotOnPole },
      axisA: { ...hingeWheelAxis },
      axisB: { ...hingePoleAxis },
    });
  }

  { // POLE TO WHEEL_LARGE: HINGE
    const pivotOnPole: Types.XYZ = { x: -1.7, y: 0, z: 0 };
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: -0.95 };
    const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    scene3d.physics.add.constraints.hinge(pole.body, wheelLarge.body, {
      pivotA: { ...pivotOnPole },
      pivotB: { ...pivotOnWheel },
      axisA: { ...hingePoleAxis },
      axisB: { ...hingeWheelAxis },
    });
  }

  const speed = 2;
  motorHinge.enableAngularMotor(true, speed, 0.25);
}
