/* eslint-disable new-cap */

import { AmmoPhysics, ExtendedObject3D } from '@enable3d/ammo-physics';

// https://github.com/kripken/ammo.js/blob/master/examples/webgl_demo_vehicle/index.html
export default class Vehicle {
  scene;

  physics;

  chassis;

  vehicle;

  wheelMesh;

  tuning;

  wheelMeshes: THREE.Mesh[] = [];

  engineForce = 0;

  vehicleSteering = 0;

  breakingForce = 0;

  constructor(
    scene: THREE.Scene,
    physics: AmmoPhysics,
    chassis: ExtendedObject3D,
    wheelMesh: ExtendedObject3D,
    wheelRadiusBack: number = 0.4,
    wheelRadiusFront: number = 0.4,
    wheelAxisPositionBack: number = -1.3,
    wheelAxisFrontPosition: number = 1.2,
    wheelHalfTrackBack: number = 1.1,
    wheelHalfTrackFront: number = 1.1,
    wheelAxisHeightBack: number = 0,
    wheelAxisHeightFront: number = 0,
  ) {
    this.scene = scene;
    this.physics = physics;
    this.chassis = chassis;
    this.wheelMesh = wheelMesh;

    const { physicsWorld } = physics;

    this.tuning = new Ammo.btVehicleTuning();
    const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
    this.vehicle = new Ammo.btRaycastVehicle(this.tuning, chassis.body.ammo, rayCaster);

    // do not automatically sync the mesh to the physics body
    this.chassis.body.skipUpdate = true;

    this.vehicle.setCoordinateSystem(0, 1, 2);
    physicsWorld.addAction(this.vehicle);

    const FRONT_LEFT = 0;
    const FRONT_RIGHT = 1;
    const BACK_LEFT = 2;
    const BACK_RIGHT = 3;

    this.addWheel(
      true,
      new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
      wheelRadiusFront,
      FRONT_LEFT,
    );
    this.addWheel(
      true,
      new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
      wheelRadiusFront,
      FRONT_RIGHT,
    );
    this.addWheel(
      false,
      new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack),
      wheelRadiusBack,
      BACK_LEFT,
    );
    this.addWheel(
      false,
      new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack),
      wheelRadiusBack,
      BACK_RIGHT,
    );
  }

  update() {
    let tm; let p; let q; let
      i;
    const n = this.vehicle.getNumWheels();
    for (i = 0; i < n; i += 1) {
      // this.vehicle.updateWheelTransform(i, true)
      tm = this.vehicle.getWheelTransformWS(i);
      p = tm.getOrigin();
      q = tm.getRotation();
      this.wheelMeshes[i].position.set(p.x(), p.y(), p.z());
      this.wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
      // this.wheelMeshes[i].rotateZ(Math.PI / 2)
    }

    tm = this.vehicle.getChassisWorldTransform();
    p = tm.getOrigin();
    q = tm.getRotation();

    this.chassis.position.set(p.x(), p.y(), p.z());
    this.chassis.quaternion.set(q.x(), q.y(), q.z(), q.w());
  }

  addWheel(isFront: boolean, pos: Ammo.btVector3, radius: number, index: number) {
    const suspensionStiffness = 50.0;
    const suspensionDamping = 2.3;
    const suspensionCompression = 4.4;
    const suspensionRestLength = 0;

    const friction = 50;
    const rollInfluence = 0.01;

    const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
    const wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

    const wheelInfo = this.vehicle.addWheel(
      pos,
      wheelDirectionCS0,
      wheelAxleCS,
      suspensionRestLength,
      radius,
      this.tuning,
      isFront,
    );

    wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
    wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
    wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);

    wheelInfo.set_m_frictionSlip(friction);
    wheelInfo.set_m_rollInfluence(rollInfluence);

    this.wheelMeshes[index] = this.wheelMesh.clone(true);
    this.scene.add(this.wheelMeshes[index]);
  }
}
