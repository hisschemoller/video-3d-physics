/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { Material } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 115;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 4;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

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
    this.fps = 30;
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
    this.ambientLight.intensity = 0.80;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(-10, 7, 3);
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
          ? '../assets/projects/frederiksplein/frames_preview_auto1/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/frederiksplein-auto1/frames/&img=frame_#FRAME#.png',
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
      actor.addTween({
        delay: 0,
        duration: STEP_DURATION * 15.9,
        videoStart: 30, // 20,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }

    // CARS, Z=0
    new Array(4).fill(true).forEach(async (el, i) => {
      const scale = 1;
      const actor = await createActor(projectSettings, videos.auto1, {
        box: {
          w: videos.auto1.width * BOX_SCALE,
          h: videos.auto1.height * BOX_SCALE,
          d: 0.02 },
        imageRect: { w: videos.auto1.width, h: videos.auto1.height },
      });
      const matrix = { x: -8, y: 3.4, z: 0, sx: scale, sy: scale };
      actor.addTween({
        delay: PATTERN_DURATION * i * 0.25,
        duration: PATTERN_DURATION,
        videoStart: 0, // 20,
        fromImagePosition: new THREE.Vector2(0, 0),
        fromMatrix4: getMatrix4({ ...matrix }),
        toMatrix4: getMatrix4({ ...matrix, z: -0.1 }),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    });
  }

  /**
   * createBalloons
   */
  async createBalloons(gltf: GLTF) {
    this.addGround(0.2, -1, 2.4);
    this.addGround(-1, 1, 2.4);

    await this.addBalloon({
      balloon: (gltf.scene.getObjectByName('balloon') as THREE.Mesh).clone(true),
      balloonImagePath: '../assets/projects/hazumiryokuchi/texture-brown.jpg',
    });
  }

  /**
   * addBalloon
   */
  async addBalloon({
    balloon,
    balloonImagePath,
    scale = 0.3,
    x = -2,
    z = 2,
  }: {
    balloon: THREE.Mesh;
    balloonImagePath: string;
    scale?: number;
    x?: number;
    z?: number;
  }) {
    if (balloon.material instanceof Material) {
      const texture = new THREE.TextureLoader().load(balloonImagePath);
      // eslint-disable-next-line no-param-reassign
      balloon.material = new THREE.MeshPhongMaterial({
        map: texture,
        opacity: 0.8,
        shininess: 90,
        side: THREE.DoubleSide,
        transparent: true,
      });
    }
    balloon.scale.set(scale, scale, scale);
    balloon.position.set(x, 3, z);
    this.scene.add(balloon);
  }

  /**
   * addGround
   */
  addGround(y: number, z: number, depth: number) {
    const planeGeometry = new THREE.PlaneGeometry(20, depth);
    planeGeometry.rotateX(Math.PI / -3);
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
