/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { Material } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 115;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 8;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;
console.log(PATTERN_DURATION);
console.log(STEP_DURATION);

const GROUND_ROTATION_X = Math.PI / -3;

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1080;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0x8abaf4;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.cameraTarget.y = 2;
    this.pCamera.position.y = 2;
    this.pCamera.lookAt(this.cameraTarget);

    // ORBIT CONTROLS
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.90;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(-7, 10, 1.5);
    this.directionalLight.intensity = 0.99;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // BLENDER GLTF
    const gltf = await this.load.gltf('../assets/projects/frederiksplein/frederiksplein.glb');

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein/frames/&img=frame_#FRAME#.png',
      },
      chromatest: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/chromatest-frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-chromatest/frames/&img=frame_#FRAME#.png',
      },
      auto1: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/frames_preview-auto1/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-auto1/frames/&img=frame_#FRAME#.png',
      },
      bike1b: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/frames_preview-bike1b/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-bike1b/frames/&img=frame_#FRAME#.png',
      },
      auto2: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/frames_preview-auto2/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-auto2/frames/&img=frame_#FRAME#.png',
      },
      scooter: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/frederiksplein/frames_preview-scooter/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-scooter/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
      previewScale: PROJECT_PREVIEW_SCALE,
      scene: this.scene,
      scene3d: this,
      timeline: this.timeline,
      width: this.width,
      width3d: this.width3d,
    };

    // this.createShadowMaterialTest();
    await this.createActors(projectSettings, videos);
    await this.createBalloons(gltf);
    this.createClock();

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createActors
   */
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
  ) {
    const BOX_SCALE = this.width3d / this.width;

    { // BACKGROUND, Z=-2
      const scale = 1.21;
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: -9.65, y: 7.4, z: -2, sx: scale, sy: scale }));
      for (let i = 0; i < MEASURES; i += 1) {
        actor.addTween({
          delay: STEP_DURATION * 16 * i,
          duration: STEP_DURATION * 15.9,
          videoStart: 30, // 20,
          fromImagePosition: new THREE.Vector2(0, 0),
        });
      }
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = true;
    }

    // TRAFFIC, Z=0
    ['auto1', 'bike1b', 'auto2', 'scooter', 'auto1', 'bike1b', 'auto2', 'scooter'].forEach(async (video, i) => {
      const videoData = videos[video];
      const scale = 1;
      const actor = await createActor(projectSettings, videoData, {
        box: {
          w: videoData.width * BOX_SCALE,
          h: videoData.height * BOX_SCALE,
          d: 0.02 },
        imageRect: { w: videoData.width, h: videoData.height },
      });
      const matrix = { x: -8, y: 3.4, z: 0, sx: scale, sy: scale };
      actor.addTween({
        delay: PATTERN_DURATION * i * 0.125,
        duration: PATTERN_DURATION / 2,
        videoStart: 0, // 20,
        fromImagePosition: new THREE.Vector2(0, 0),
        fromMatrix4: getMatrix4({ ...matrix }),
        toMatrix4: getMatrix4({ ...matrix, z: -0.1 }),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = true;
    });
  }

  /**
   * createClock
   */
  async createClock() {
    const scale = 0.13;
    const group = new THREE.Group();
    group.position.set(-3.76, 2.31, -1);
    group.rotation.y = -0.5;
    group.scale.set(scale, scale, scale);
    this.scene.add(group);

    const faceRadius = 0.6;
    const face = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(faceRadius, faceRadius, 0.01, 16),
      new THREE.MeshPhongMaterial({ color: 0xeeeeee }),
    );
    face.rotateX(Math.PI * 0.5);
    group.add(face);

    const handLargeWidth = 0.3;
    const handLargeHeight = 1;
    const handLargeGeometry = new THREE.BoxBufferGeometry(handLargeWidth, handLargeHeight, 0.01);
    handLargeGeometry.translate(0, handLargeHeight * 0.45, 0);
    const handLarge = new THREE.Mesh(
      handLargeGeometry,
      new THREE.MeshPhongMaterial({ color: 0x999999 }),
    );
    handLarge.position.setZ(0.1);
    group.add(handLarge);

    this.timeline.add(createTween({
      delay: 0,
      duration: PATTERN_DURATION * 0.99,
      ease: 'linear',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        handLarge.rotation.z = progress * Math.PI * -4;
      },
    }));

    const handSmallWidth = 0.4;
    const handSmallHeight = 0.6;
    const handSmallGeometry = new THREE.BoxBufferGeometry(handSmallWidth, handSmallHeight, 0.01);
    handSmallGeometry.translate(0, handSmallHeight * 0.45, 0);
    const handSmall = new THREE.Mesh(
      handSmallGeometry,
      new THREE.MeshPhongMaterial({ color: 0x999999 }),
    );
    handSmall.position.setZ(0.1);
    group.add(handSmall);

    this.timeline.add(createTween({
      delay: 0,
      duration: PATTERN_DURATION * 0.99,
      ease: 'linear',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        handSmall.rotation.z = progress * Math.PI * -2;
      },
    }));
  }

  /**
   * createBalloons
   */
  async createBalloons(gltf: GLTF) {
    this.addGround(0.2, -1.1, 2.4);
    this.addGround(-1, 1, 2.4);

    const balloon = gltf.scene.getObjectByName('balloon') as THREE.Mesh;

    await this.addBalloon({
      balloon: balloon.clone(true),
      ropeLength: 6,
      scale: 0.3,
      tweenOffset: 0,
      tweenOffsetWind: 0,
      wind: [-0.1, 0.1, -0.08, 0.12],
      x: -2,
      y: -0.95,
      z: 1,
    });

    await this.addBalloon({
      balloon: balloon.clone(true),
      ropeLength: 3.5,
      scale: 0.2,
      tweenOffset: 48,
      tweenOffsetWind: 27,
      wind: [0.1, -0.08, 0.03, -0.05],
      x: -1,
      y: 0.15,
      z: -1,
    });

    await this.addBalloon({
      balloon: balloon.clone(true),
      ropeLength: 4,
      scale: 0.22,
      tweenOffset: 32,
      tweenOffsetWind: 12,
      wind: [-0.03, 0.08, -0.01, 0.02],
      x: 3.5,
      y: 0,
      z: -0.75,
    });
  }

  /**
   * addBalloon
   */
  async addBalloon({
    balloon,
    ropeLength,
    scale,
    tweenOffset,
    tweenOffsetWind,
    wind = [-0.1, 0.1, -0.15, 0.15],
    x,
    y,
    z,
  }: {
    balloon: THREE.Mesh;
    ropeLength: number;
    scale: number;
    tweenOffset: number;
    tweenOffsetWind: number;
    wind: number[];
    x: number;
    y: number;
    z: number;
  }) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    this.scene.add(group);

    const brick = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1.33, 0.27, 0.5),
      new THREE.MeshPhongMaterial({ color: 0x777777 }),
    );
    brick.position.set(0, 0, 0);
    brick.scale.set(scale, scale, scale);
    brick.rotateX(-2.6);
    brick.rotateY(Math.PI * -0.01);
    brick.castShadow = true;
    brick.receiveShadow = true;
    group.add(brick);

    const winder = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.06, 0.06, 0.5),
      new THREE.MeshPhongMaterial({ color: 0x555555 }),
    );
    winder.position.set(0, 0.07, 0);
    winder.scale.set(scale, scale, scale);
    winder.rotateY(Math.PI * -0.01);
    winder.rotateZ(Math.PI / 2);
    winder.castShadow = true;
    winder.receiveShadow = true;
    group.add(winder);

    const balloonGroup = new THREE.Group();
    balloonGroup.position.set(x, y, z);
    // eslint-disable-next-line prefer-destructuring
    balloonGroup.rotation.z = wind[0];
    this.scene.add(balloonGroup);

    if (balloon.material instanceof Material) {
      balloon.material = new THREE.MeshPhysicalMaterial({
        clearcoat: 1,
        color: 0x881100, // 0x990000,
        opacity: 0.9,
        reflectivity: 0.9,
        roughness: 0.4,
        side: THREE.FrontSide,
        transparent: true,
      });
      // balloon.material = new THREE.MeshPhysicalMaterial({
      //   attenuationDistance: 0.5,
      //   clearcoat: 1,
      //   color: 0xaa0000,
      //   reflectivity: 0.9,
      //   roughness: 0.35,
      //   transmission: 0.4,
      //   transparent: true,
      // });
    }
    balloon.scale.set(scale, scale, scale);
    balloon.position.set(0, ropeLength, 0);
    balloon.castShadow = true;
    balloon.receiveShadow = true;
    balloonGroup.add(balloon);

    const rope = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.004, 0.004, ropeLength),
      new THREE.MeshPhongMaterial({ color: 0x885511 }),
    );
    rope.position.set(0, ropeLength / 2, 0);
    rope.castShadow = true;
    rope.receiveShadow = true;
    balloonGroup.add(rope);

    const DURATION = 48;

    const tweenDown = createTween({
      delay: (tweenOffset + 0) * STEP_DURATION,
      duration: DURATION * STEP_DURATION,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const length = 0.1 + ((1 - progress) * (ropeLength - 0.1));
        balloon.position.setY(length);
        rope.position.setY(length / 2);
        rope.scale.setY(length / ropeLength);
      },
    });
    this.timeline.add(tweenDown);
    const tweenUp = createTween({
      delay: (tweenOffset + 64) * STEP_DURATION,
      duration: DURATION * STEP_DURATION,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const length = 0.1 + (progress * (ropeLength - 0.1));
        balloon.position.setY(length);
        rope.position.setY(length / 2);
        rope.scale.setY(length / ropeLength);
      },
    });
    this.timeline.add(tweenUp);

    wind.forEach((windX, i) => {
      const tweenWind = createTween({
        delay: (tweenOffsetWind + (i * 32)) * STEP_DURATION,
        duration: 32 * STEP_DURATION,
        ease: 'sineInOut',
        onComplete: () => {},
        onStart: () => {},
        onUpdate: (progress: number) => {
          balloonGroup.rotation.z = wind[i] + ((wind[(i + 1) % wind.length] - wind[i]) * progress);
        },
      });
      this.timeline.add(tweenWind);
    });
  }

  /**
   * addGround
   */
  addGround(y: number, z: number, depth: number) {
    const planeGeometry = new THREE.PlaneGeometry(20, depth);
    planeGeometry.rotateX(GROUND_ROTATION_X);
    const ground = new THREE.Mesh(
      planeGeometry,
      new THREE.ShadowMaterial({ opacity: 0.6, transparent: true, side: THREE.FrontSide }),
      // new THREE.MeshPhongMaterial({ color: 0x999999 }),
    );
    ground.position.set(0, y, z);
    ground.receiveShadow = true;
    this.scene.add(ground);
    return ground;
  }

  createShadowMaterialTest() {
    const y = 1;
    const z = 1;
    const cylinder = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.1, 0.1, 1.5),
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    );
    cylinder.position.set(0, y + 0.75, z);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    this.scene.add(cylinder);

    const planeGeometry = new THREE.PlaneGeometry(10, 1);
    planeGeometry.rotateX(Math.PI / -2);
    const ground = new THREE.Mesh(
      planeGeometry,
      new THREE.ShadowMaterial({ opacity: 0.6, transparent: true, side: THREE.FrontSide }),
    );
    ground.position.set(0, y, z - 0.5 + 0.2);
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
}
