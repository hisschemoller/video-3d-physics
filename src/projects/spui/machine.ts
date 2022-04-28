import { ExtendedObject3D, THREE, Types } from 'enable3d';
import MainScene from '@app/mainscene';
import createTween from '@app/tween';
import { Timeline } from '@app/timeline';
import { createSVG } from './actor-mesh';

interface MachineConfig {
  duration: number;
  ground: Types.ExtendedObject3D;
  phase?: number;
  radiusLarge?: number;
  radiusMotor?: number;
  scene3d: MainScene;
  timeline: Timeline;
  x?: number;
  yMotor?: number;
  z?: number;
}

const DOUBLE_PI = Math.PI * 2;
const SVG_WHEEL_SIZE = 1000;

export default async function createPhysicsMachine({
  duration,
  ground,
  phase = 0,
  radiusLarge = 1,
  radiusMotor = 0.5,
  scene3d,
  timeline,
  x = -1.4,
  yMotor = 1.8,
  z = 3.5,
}: MachineConfig) {
  // WHEEL_MOTOR
  const wheelMotor = scene3d.add.cylinder({
    height: 0.05,
    radiusBottom: radiusMotor,
    radiusSegments: 64,
    radiusTop: radiusMotor,
    x: x + 3.4 - 0.08,
    y: ground.position.y + yMotor,
    z,
  });
  wheelMotor.rotation.x = Math.PI * 0.5;
  scene3d.physics.add.existing(wheelMotor, { mass: 10 });
  wheelMotor.body.setCollisionFlags(2); // make it kinematic

  // POLE
  const pole = scene3d.add.box({
    depth: 0.05,
    height: 0.05,
    width: 3.4,
    x: x + 1.7,
    y: 0,
    z: z + 0.11,
  });
  scene3d.physics.add.existing(pole, { mass: 0.5 });

  // POLE CAP LEFT
  const capLeft = scene3d.add.cylinder({
    height: 0.08,
    radiusBottom: 0.07,
    radiusSegments: 24,
    radiusTop: 0.07,
    x: 3.4 * -0.5,
  });
  capLeft.rotation.x = Math.PI * 0.5;
  pole.add(capLeft);

  // POLE CAP RIGHT
  const capRight = scene3d.add.cylinder({
    height: 0.08,
    radiusBottom: 0.05,
    radiusSegments: 24,
    radiusTop: 0.05,
    x: 3.4 * 0.5,
  });
  capRight.rotation.x = Math.PI * 0.5;
  pole.add(capRight);

  // WHEEL_LARGE
  const depth = 0.05;
  const svgMesh = await createSVG(
    '../assets/projects/spui/wheel1.svg',
    (radiusLarge * 2) / SVG_WHEEL_SIZE,
    undefined,
    depth,
  );
  const geometry = svgMesh.geometry.clone();
  const material = new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.BackSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-radiusLarge, radiusLarge, depth * -0.5);
  const wheelLarge = new ExtendedObject3D();
  wheelLarge.add(mesh);
  wheelLarge.position.set(x, ground.position.y + radiusLarge, z);
  scene3d.scene.add(wheelLarge);
  scene3d.physics.add.existing(wheelLarge, {
    shape: 'mesh',
  });

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
    height: 0.1,
    width: 1,
    x,
    y: -1.9,
    z: z - 0.05,
    mass: 0,
  });

  // GROUND TO WHEEL_MOTOR: HINGE
  const pivotOnGround: Types.XYZ = { x: x + 3.4, y: yMotor, z: z - ground.position.z };
  const pivotOnWheelM: Types.XYZ = { x: 0, y: 0, z: 0 };
  const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  const hingeWheelMAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
  scene3d.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
    pivotA: { ...pivotOnGround },
    pivotB: { ...pivotOnWheelM },
    axisA: { ...hingeGroundAxis },
    axisB: { ...hingeWheelMAxis },
  });

  { // WHEEL_MOTOR TO POLE: HINGE
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: radiusMotor - 0.05 };
    const pivotOnPole: Types.XYZ = { x: 1.7, y: 0, z: -0.11 };
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
    const pivotOnPole: Types.XYZ = { x: -1.7, y: 0, z: -0.11 };
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: 0 }; // z: -radiusLarge + 0.05
    const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    scene3d.physics.add.constraints.hinge(pole.body, wheelLarge.body, {
      pivotA: { ...pivotOnPole },
      pivotB: { ...pivotOnWheel },
      axisA: { ...hingePoleAxis },
      axisB: { ...hingeWheelAxis },
    });
  }

  // MOTOR HINGE TWEEN
  const tween = createTween({
    delay: 0.1,
    duration,
    onStart: () => {},
    onUpdate: (progress: number) => {
      const phasedProgress = (progress + phase) % 1;
      wheelMotor.rotation.y = phasedProgress * DOUBLE_PI;
      wheelMotor.body.needUpdate = true;
    },
  });
  timeline.add(tween);
}
