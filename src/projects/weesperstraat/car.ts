import { ExtendedObject3D, THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings } from '@app/interfaces';
import Vehicle from './vehicle';

function createWheel(gltf: GLTF, texturePath: string) {
  const wheel = gltf.scene.getObjectByName('Wheel') as ExtendedObject3D;
  const wheelTexture = new THREE.TextureLoader().load(texturePath);
  wheelTexture.flipY = false;
  wheel.material = new THREE.MeshPhongMaterial({
    map: wheelTexture,
    shininess: 0,
  });
  wheel.receiveShadow = true;
  wheel.castShadow = true;
  wheel.geometry.center();
  return wheel;
}

export async function createBlackCar(
  projectSettings: ProjectSettings,
): Promise<Vehicle | undefined> {
  const { scene3d } = projectSettings;

  const gltf = await scene3d.load.gltf('../assets/projects/weesperstraat/car-tutorial.glb');

  // BODY
  const body = gltf.scene.getObjectByName('Body') as ExtendedObject3D;
  const bodyTexture = new THREE.TextureLoader().load('../assets/projects/weesperstraat/car-texture.jpg');
  bodyTexture.flipY = false;
  body.material = new THREE.MeshPhongMaterial({
    map: bodyTexture,
    shininess: 1,
  });
  body.receiveShadow = true;
  body.castShadow = true;
  body.position.x = -5;
  body.rotation.y = Math.PI / 2;
  scene3d.add.existing(body);
  scene3d.physics.add.existing(body, { shape: 'convex', mass: 1200 });

  // WHEEL
  const wheel = createWheel(gltf, '../assets/projects/weesperstraat/wheel-texture.jpg');

  // CAR
  const wheelRadius = 0.675 / 2;
  const axisPositionBack = -1.17;
  const axisPositionFront = 1.55;
  const wheelHalfTrack = 0.85;
  const wheelAxisHeight = 0.05;
  const car = new Vehicle(
    scene3d.scene, scene3d.physics, body, wheel,
    wheelRadius, wheelRadius, axisPositionBack, axisPositionFront,
    wheelHalfTrack, wheelHalfTrack, wheelAxisHeight, wheelAxisHeight,
  );

  // const FRONT_LEFT = 0;
  // const FRONT_RIGHT = 1;
  const BACK_LEFT = 2;
  const BACK_RIGHT = 3;
  let engineForce = 0;
  const maxEngineForce = 5000;
  engineForce = maxEngineForce / 4;
  car.vehicle.applyEngineForce(engineForce, BACK_LEFT);
  car.vehicle.applyEngineForce(engineForce, BACK_RIGHT);

  return car;
}

export async function createRedCar() {

}
