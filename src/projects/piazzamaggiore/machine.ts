/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import createTween from '@app/tween';
import { ExtendedObject3D, THREE } from 'enable3d';
import Scene from './scene';
import addWheel from './wheel';

export async function createMachine(
  scene3d: Scene,
  patternDuration: number,
  stepDuration: number,
) {
  { // WHEEL
    const scale = 0.34;
    const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
    wheel.position.set(-8.0, -1.4, -4.5);
    wheel.scale.set(scale, scale, 2);
  }

  { // WHEEL 2
    const scale = 0.28;
    const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
    wheel.position.set(-5.3, -1.0, -4.7);
    wheel.scale.set(scale, scale, 2);
  }

  { // WHEEL 3
    const scale = 0.5;
    const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration);
    wheel.position.set(-2.2, 0.4, -2.7);
    wheel.scale.set(scale, scale, 3);
  }

  { // WHEEL 4
    const scale = 0.5;
    const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration, 1);
    wheel.position.set(-0.7, -1.9, -2.1);
    wheel.scale.set(scale, scale, 4);
  }

  { // WHEEL 5
    const scale = 0.6;
    const wheel = await addWheel(scene3d, scene3d.timeline, patternDuration, 1);
    // wheel.position.set(-8.0, -1.4, -4.5);
    wheel.position.set(5.0, -1.2, -1.9);
    wheel.scale.set(scale, scale, 4);
  }

  { // SPHERE
    const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/texture-grey.jpg');
    const geometry = new THREE.SphereBufferGeometry(0.7);
    const material = new THREE.MeshPhongMaterial({
      color: 0xb6a385, shininess: 0.4, map: texture, flatShading: false,
    });
    const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.set(1.5, 4.1, -2.1);
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    const obj3d = new ExtendedObject3D();
    obj3d.position.set(1.5, 4.1, -2.1);
    obj3d.add(sphere);
    scene3d.scene.add(obj3d);
    scene3d.physics.add.existing(obj3d);
  }
}
