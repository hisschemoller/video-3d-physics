import { ExtendedObject3D, THREE } from 'enable3d';
// import * as TWEEN from '@tweenjs/tween.js';
import { renderBackground, setupBackground } from '@app/background';
import MainScene from '@app/mainscene';

export default class Scene extends MainScene {
  pCamera: THREE.PerspectiveCamera;

  constructor() {
    super();
  }

  async create() {
    this.warpSpeed();

    this.renderer.setSize(this.width, this.height);
    this.pCamera = this.camera as THREE.PerspectiveCamera;
    this.pCamera.aspect = this.width / this.height;
    this.pCamera.updateProjectionMatrix();

    // dynamic physics objects
    const x = () => (Math.random() - 0.5) * 2;
    const bounciness = 0.6;
    this.physics.add.sphere({ x: x(), y: 5 }, { lambert: { color: 'red' } }).body.setBounciness(bounciness);
    this.physics.add.box({ x: x(), y: 10 }, { lambert: { color: 'blue' } }).body.setBounciness(bounciness);
    this.physics.add.torus({ x: x(), y: 12 }, { lambert: { color: 'orange' } }).body.setBounciness(bounciness);
    this.physics.add.cone({ x: x(), y: 14 }, { lambert: { color: 'green' } }).body.setBounciness(bounciness);
    this.physics.add.cylinder({ x: x(), y: 16 }, { lambert: { color: 'yellow' } }).body.setBounciness(bounciness);

    // Use tween.js to move three.js objects with or without kinematic body.
    const box1 = this.add.box({ x: -1, y: 1, collisionFlags: 2 });
    const box2 = this.physics.add.box({ x: 1, y: 1, collisionFlags: 2 });
    this.tween(box1, new THREE.Vector3(-2, 3, 2), 1000, 0);
    this.tween(box2, new THREE.Vector3(1, 4, 0), 1000, 0);

    // gltf loader
    const gltf = await this.load.gltf('../assets/projects/test/test.glb');

    const house = gltf.scene.getObjectByName('house') as ExtendedObject3D;
    house.castShadow = true;
    house.receiveShadow = true;
    house.position.set(0, 0, 0);
    const texture: THREE.Texture = new THREE.TextureLoader().load('../assets/projects/test/testimage3d.jpg');
    texture.flipY = true;
    house.material = new THREE.MeshPhongMaterial({ map: texture });
    this.scene.add(house);
    this.physics.add.existing(house, { shape: 'convex' });
    
    const box = gltf.scene.getObjectByName('box') as ExtendedObject3D;
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(0, 0, 5);
    const video = document.createElement('video');
    video.src = '../assets/projects/test/30_seconds_of_frame_counter.mp4';
    video.loop = true;
    video.load();
    video.play();
    const boxTexture = new THREE.VideoTexture(video);
    boxTexture.minFilter = THREE.LinearFilter;
    boxTexture.magFilter = THREE.LinearFilter;
    boxTexture.flipY = true;
    box.material = new THREE.MeshPhongMaterial({ map: boxTexture });
    this.scene.add(box);
    this.physics.add.existing(box, { shape: 'convex' });

    setupBackground('../assets/projects/test/30_seconds_of_frame_counter.mp4');

    super.create();
  }

  preRender() {
    renderBackground(this.renderer);
  }

  update(time: number, delta: number) {
    // TWEEN.update(time * 1000);
    super.update(time, delta);
  }

  tween(object: THREE.Object3D, moveTo: THREE.Vector3, time = 1000, delay = 0) {
    const coords = object.position.clone();

    // const tween = new TWEEN.Tween(coords)
    //   .to({ x: moveTo.x, y: moveTo.y, z: moveTo.z }, time)
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .onUpdate(() => {
    //     object.position.set(coords.x, coords.y, coords.z);
    //     if (object.body) object.body.needUpdate = true;
    //   })

    // if (delay === 0) tween.start();
    // else setTimeout(() => tween.start(), delay);
  }
};
