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
  railLength?: number;
  rotateY?: number;
  scene3d: MainScene;
  svgWheelLarge?: string;
  svgWheelMotor?: string;
  textureUrl?: string;
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
  rotateY: number,
  scene3d: MainScene,
  svgPath: string,
  textureUrl: string,
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

  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const displacementMap = new THREE.TextureLoader()
    .load('../assets/projects/spui/tileable_metal_scratch_texture.jpg');
  displacementMap.offset = new THREE.Vector2(0, 1);
  displacementMap.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const material = new THREE.MeshPhongMaterial({
    displacementBias: 0,
    displacementMap,
    displacementScale: 0.01,
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
  wheel.rotation.y = rotateY;
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
  railLength = 1,
  rotateY = 0,
  scene3d,
  svgWheelLarge = '../assets/projects/spui/wheel1.svg',
  svgWheelMotor = '../assets/projects/spui/wheel2.svg',
  textureUrl = '../assets/projects/spui/texture-rust2.jpg',
  timeline,
  x = -1.4,
  xWheelDistance = 3.4,
  yMotor = 1.8,
  z = 3.5,
}: MachineConfig) {
  const flip = isFlipped ? -1 : 1;
  const y = ground.position.y + 0.4;
  const wheelDistanceX = Math.cos(rotateY) * xWheelDistance;
  const wheelDistanceZ = Math.sin(rotateY) * xWheelDistance;

  // WHEEL_MOTOR
  const wheelMotor = await createWheel(
    10,
    radiusMotor,
    rotateY,
    scene3d,
    svgWheelMotor,
    textureUrl,
    x + (wheelDistanceX * flip),
    y + yMotor,
    z + (wheelDistanceZ * -flip),
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
    x: x + ((wheelDistanceX / 2) * flip) + (Math.sin(rotateY) * (0.09 * flip)),
    y: barY,
    z: z + ((wheelDistanceZ / 2) * -flip) + (Math.cos(rotateY) * (0.09 * flip)),
  }, {
    phong: {
      map: new THREE.TextureLoader().load(textureUrl),
    },
  });
  bar.rotation.y = rotateY;
  bar.rotation.z = barRotateZ;
  scene3d.physics.add.existing(bar, { mass: 0.5 });

  // BAR CAP LEFT
  const capLeft = scene3d.add.cylinder({
    height: 0.08,
    radiusBottom: 0.07,
    radiusSegments: 24,
    radiusTop: 0.07,
    x: (barLength / -2) * flip,
  }, {
    phong: {
      map: new THREE.TextureLoader().load(textureUrl),
    },
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
  }, {
    phong: {
      map: new THREE.TextureLoader().load(textureUrl),
    },
  });
  capRight.rotation.x = Math.PI * 0.5;
  bar.add(capRight);

  // WHEEL_LARGE
  const wheelLarge = await createWheel(
    0.1,
    radiusLarge,
    rotateY,
    scene3d,
    svgWheelLarge,
    textureUrl,
    x,
    y + radiusLarge,
    z,
  );
  wheelLarge.body.setFriction(1);

  // RAIL
  const rail = scene3d.add.box({
    depth: 0.05,
    height: 0.2,
    x: x + (Math.sin(rotateY) * (0.05 * flip)),
    y: y + 0.05,
    z: z + (Math.cos(rotateY) * (0.05 * flip)),
    width: railLength,
  }, {
    phong: {
      color: 0x958a78,
    },
  });
  rail.rotation.y = rotateY;
  scene3d.physics.add.existing(rail, { mass: 0 });

  // GROUND TO WHEEL_MOTOR: HINGE
  // const pivotOnGround: Types.XYZ = {
  //   x: x + (xWheelDistance * flip), y: 0.4 + yMotor, z: z - ground.position.z,
  // };
  // const pivotOnWheelM: Types.XYZ = { x: 0, y: 0, z: 0 };
  // const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  // const hingeWheelMAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
  // scene3d.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
  //   pivotA: { ...pivotOnGround },
  //   pivotB: { ...pivotOnWheelM },
  //   axisA: { ...hingeGroundAxis },
  //   axisB: { ...hingeWheelMAxis },
  // });

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
