import { ExtendedObject3D, THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import MainScene from '@app/mainscene';

const transparent = true;
const debug = true;

function addAxis(scene3d: MainScene, z: number, radius: number = 0.06) {
  const axis = scene3d.add.cylinder(
    {
      z, y: 1, mass: 10, radiusTop: radius, radiusBottom: radius, height: 2.6,
    },
    { lambert: { color: 'blue', transparent, opacity: 0.5 } },
  );
  axis.rotateZ(Math.PI / 2);
  scene3d.physics.add.existing(axis);
  return axis;
}

function addPlate(scene3d: MainScene) {
  const plate = scene3d.add.box(
    {
      y: 1, width: 1.8, depth: 4.7, mass: 5000, height: 0.25,
    },
    { lambert: { wireframe: true } },
  );
  scene3d.physics.add.existing(plate);
  return plate;
}

function addRotor(scene3d: MainScene, x: number, z: number) {
  const rotor = scene3d.add.cylinder(
    {
      mass: 10, radiusBottom: 0.35, radiusTop: 0.35, radiusSegments: 24, height: 0.4, x, y: 1, z,
    },
    { lambert: { color: 'red', transparent, opacity: 0.5 } },
  );

  rotor.rotateZ(Math.PI / 2);
  scene3d.physics.add.existing(rotor);
  return rotor;
}

function addWheel(scene3d: MainScene, x: number, z: number) {
  const wheel = scene3d.add.cylinder(
    {
      mass: 20, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35, x, y: 1, z,
    },
    { lambert: { color: 'blue', transparent, opacity: 0.5 } },
  );

  wheel.rotateZ(Math.PI / 2);
  scene3d.physics.add.existing(wheel);
  wheel.body.setFriction(3);
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  return wheel;
}

// constraint axis to rotor
function axisToRotor(
  scene3d: MainScene,
  rotorRight: ExtendedObject3D,
  rotorLeft: ExtendedObject3D,
  axis: ExtendedObject3D,
  z: number,
) {
  const right = scene3d.physics.add.constraints.hinge(rotorRight.body, axis.body, {
    pivotA: { y: 0.2, z },
    pivotB: { y: -1.3 },
    axisA: { x: 1 },
    axisB: { x: 1 },
  });
  const left = scene3d.physics.add.constraints.hinge(rotorLeft.body, axis.body, {
    pivotA: { y: -0.2, z },
    pivotB: { y: 1.3 },
    axisA: { x: 1 },
    axisB: { x: 1 },
  });
  return { right, left };
}

export default async function carPhysicsExample(
  projectSettings: ProjectSettings,
) {
  const { scene3d } = projectSettings;

  // scene3d.warpSpeed('-ground');

  const texture = new THREE.TextureLoader().load('../assets/projects/test/testimage3d.jpg');
  const ground = scene3d.physics.add.ground(
    { width: 500, height: 500, y: -3 }, { phong: { map: texture } },
  );
  ground.body.setFriction(1);
  ground.receiveShadow = true;

  if (debug) scene3d.physics.debug?.enable();
  scene3d.physics.debug?.mode(2048 + 4096);

  // CAMERA & ORBIT_CONTROLS
  scene3d.cameraTarget.set(0, 0, 0);
  scene3d.camera.position.set(10, 10, 10);
  scene3d.camera.lookAt(scene3d.cameraTarget);
  scene3d.camera.updateProjectionMatrix();
  scene3d.orbitControls.target = scene3d.cameraTarget;
  scene3d.orbitControls.update();
  scene3d.orbitControls.saveState();

  const wheelX = 1.5;
  const wheelZ = 2;
  const axisZ = 0.2;

  // blue wheels
  const wheelBackRight = addWheel(scene3d, wheelX, wheelZ);
  const wheelBackLeft = addWheel(scene3d, -wheelX, wheelZ);
  const wheelFrontRight = addWheel(scene3d, wheelX, -wheelZ);
  const wheelFrontLeft = addWheel(scene3d, -wheelX, -wheelZ);

  // red rotors
  const rotorBackRight = addRotor(scene3d, wheelX, wheelZ);
  const rotorBackLeft = addRotor(scene3d, -wheelX, wheelZ);
  const rotorFrontRight = addRotor(scene3d, wheelX, -wheelZ);
  const rotorFrontLeft = addRotor(scene3d, -wheelX, -wheelZ);

  // blue axis
  const axisBackOne = addAxis(scene3d, wheelZ); // the one at the back
  const axisFrontOne = addAxis(scene3d, -wheelZ + axisZ, 0.04);
  const axisFrontTwo = addAxis(scene3d, -wheelZ - axisZ);

  /**
   * CONSTRAINTS
   */

  // constraint wheel to rotor
  const wheelToRotorConstraint = { axisA: { y: 1 }, axisB: { y: 1 } };
  const motorBackLeft = scene3d.physics.add.constraints.hinge(
    wheelBackLeft.body,
    rotorBackLeft.body,
    wheelToRotorConstraint,
  );
  const motorBackRight = scene3d.physics.add.constraints.hinge(
    wheelBackRight.body,
    rotorBackRight.body,
    wheelToRotorConstraint,
  );
  const motorFrontLeft = scene3d.physics.add.constraints.hinge(
    wheelFrontLeft.body,
    rotorFrontLeft.body,
    wheelToRotorConstraint,
  );
  const motorFrontRight = scene3d.physics.add.constraints.hinge(
    wheelFrontRight.body,
    rotorFrontRight.body,
    wheelToRotorConstraint,
  );

  // lock back rotors to wheels
  scene3d.physics.add.constraints.lock(rotorBackRight.body, axisBackOne.body);
  scene3d.physics.add.constraints.lock(rotorBackLeft.body, axisBackOne.body);

  const m0 = axisToRotor(scene3d, rotorFrontRight, rotorFrontLeft, axisFrontTwo, -0);
  axisToRotor(scene3d, rotorFrontRight, rotorFrontLeft, axisFrontOne, 0.4);

  const plate = addPlate(scene3d);
  // plate.add(scene3d.camera);
  // scene3d.camera.lookAt(plate.position.clone());
  scene3d.physics.add.constraints.lock(plate.body, axisBackOne.body);

  scene3d.physics.add.constraints.lock(plate.body, axisFrontTwo.body);

  const limit = 0.3;
  const dofSettings = {
    angularLowerLimit: { x: 0, y: 0, z: 0 },
    angularUpperLimit: { x: 0, y: 0, z: 0 },
    linearLowerLimit: { x: 0, y: -limit, z: -0.1 },
    linearUpperLimit: { x: 0, y: limit, z: 0.1 },
  };
  scene3d.physics.add.constraints.dof(
    plate.body, axisFrontOne.body, { ...dofSettings, offset: { y: 0.9 } },
  );
  scene3d.physics.add.constraints.dof(
    plate.body, axisFrontOne.body, { ...dofSettings, offset: { y: -0.9 } },
  );

  m0.left.enableAngularMotor(true, 0, 1000);
  m0.right.enableAngularMotor(true, 0, 1000);
}
