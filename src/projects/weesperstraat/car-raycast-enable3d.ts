import { ExtendedObject3D, THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import Vehicle from './vehicle';

export default async function carRaycastExample(
  projectSettings: ProjectSettings,
): Promise<Vehicle | undefined> {
  const { scene3d } = projectSettings;

  // CAMERA & ORBIT_CONTROLS
  // scene3d.cameraTarget.set(0, 0, 0);
  // scene3d.camera.position.set(5, 0, 5);
  // scene3d.camera.lookAt(scene3d.cameraTarget);
  // scene3d.camera.updateProjectionMatrix();
  // scene3d.orbitControls.target = scene3d.cameraTarget;
  // scene3d.orbitControls.update();
  // scene3d.orbitControls.saveState();

  const grass = await scene3d.load.texture('../assets/projects/weesperstraat/grass.jpg');
  const grassGround = grass.clone();
  grassGround.needsUpdate = true;
  grassGround.wrapT = 1000;
  grassGround.wrapS = 1000; // RepeatWrapping
  grassGround.offset.set(0, 0);
  grassGround.repeat.set(10, 10);

  scene3d.physics.add.ground(
    { y: -2 /* -1 */, width: 100, height: 100 }, { lambert: { map: grassGround } },
  );

  const gltf = await scene3d.load.gltf('../assets/projects/weesperstraat/car-tutorial.glb');
  const scene = gltf.scenes[0];

  let chassis: ExtendedObject3D | undefined;
  let tire: ExtendedObject3D | undefined;

  scene.traverse((child: THREE.Object3D) => {
    const mesh = child as ExtendedObject3D;
    if (mesh) {
      if (/window/gi.test(child.name)) {
        if (mesh.material instanceof THREE.Material) {
          mesh.material.transparent = true;
          mesh.material.opacity = 0.5;
        }
      } else if (child.name === 'Body') {
        // chassis = mesh;

        const texture = new THREE.TextureLoader().load('../assets/projects/weesperstraat/car-texture.jpg');
        texture.flipY = false;

        chassis = gltf.scene.getObjectByName('Body') as ExtendedObject3D;
        chassis.material = new THREE.MeshPhongMaterial({
          map: texture,
          shininess: 1,
        });
        chassis.receiveShadow = true;
        chassis.castShadow = true;
      } else if (child.name === 'Wheel') {
        tire = mesh;

        const texture = new THREE.TextureLoader().load('../assets/projects/weesperstraat/wheel-texture.jpg');
        texture.flipY = false;

        tire.material = new THREE.MeshPhongMaterial({
          map: texture,
          shininess: 0,
        });
        // tire.geometry.computeVertexNormals();
        // tire.geometry.normalizeNormals();
        // tire.material.needsUpdate = true;

        tire.receiveShadow = true;
        tire.castShadow = true;
        tire.geometry.center();
      }
    }
  });

  if (!chassis || !tire) {
    return undefined;
  }

  scene3d.add.existing(chassis);
  scene3d.physics.add.existing(chassis, { shape: 'convex', mass: 1200 });

  // chassis.add(scene3d.camera);

  const car = new Vehicle(scene3d.scene, scene3d.physics, chassis, tire);
  return car;
}
