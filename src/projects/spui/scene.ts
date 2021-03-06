/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import createPhysicsMachine from './machine';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 100;
const MEASURES = 2;
const STEPS = 16 * MEASURES;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * MEASURES;
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
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0x9ed3ff;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 9.6);

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(10, 15, 10);
    this.directionalLight.intensity = 0.98;

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.62;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/spui/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/spui-0164/frames/&img=frame_#FRAME#.png',
      },
    };

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

    await this.createActors(projectSettings, videos);
    this.createPhysics();

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createActors
   */
  async createActors(projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(-960), y: to3d(540) }));
      actor.addTween({
        delay: 0,
        duration: STEP_DURATION * 15.9,
        videoStart: 79,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.addTween({
        delay: STEP_DURATION * 16,
        duration: STEP_DURATION * 15.9,
        videoStart: 112.7,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }

    const straatImgData = {
      height: 719,
      imgSrc: '../assets/projects/spui/straat.jpg',
      width: 1980,
    };

    { // STRAAT
      const actor = await createActor(projectSettings, straatImgData, {
        box: { w: this.width3d, h: to3d(719), d: 0.02 },
        imageRect: { w: 1920, h: 719 },
      });
      actor.setStaticImage(0, 0);
      actor.setStaticPosition(getMatrix4({
        x: toVP3d(0),
        y: -2,
        rx: Math.PI * -0.5,
        ry: -0.0188,
      }));
    }
  }

  /**
   * createPhysics
   */
  createPhysics() {
    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    const ground = this.add.box({
      y: -2.38, z: 3, width: 16, height: 0.8, depth: 6,
    });
    ground.rotation.z = 0.0188;
    this.physics.add.existing(ground, { mass: 0 });
    ground.body.setFriction(1);

    const machineBasics = {
      duration: PATTERN_DURATION,
      ground,
      scene3d: this,
      timeline: this.timeline,
    };

    createPhysicsMachine({
      ...machineBasics,
      radiusMotor: 0.8,
      z: 1.65, // 2.5
    });

    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 10,
      isFlipped: true,
      radiusLarge: 1.3,
      radiusMotor: 0.5,
      rotateY: -0.07,
      x: 0.8,
      yMotor: 2.3,
      z: 2.6,
    });

    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 20,
      radiusLarge: 1.7,
      radiusMotor: 0.3,
      rotateY: -0.04,
      svgWheelMotor: '../assets/projects/spui/wheel4.svg',
      textureUrl: '../assets/projects/spui/texture-rust4.jpg',
      x: -2.2,
      xWheelDistance: 5,
      yMotor: 3.5,
      z: 3.55,
    });

    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 15,
      radiusLarge: 0.5,
      radiusMotor: 0.8,
      railLength: 4,
      rotateY: -0.08,
      textureUrl: '../assets/projects/spui/texture-rust7.jpg',
      x: 1.5,
      xWheelDistance: 1.5,
      yMotor: 2.1,
      z: 3.8,
    });

    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 18,
      isFlipped: true,
      radiusLarge: 0.8,
      radiusMotor: 0.6,
      railLength: 3,
      rotateY: Math.PI * -0.035,
      textureUrl: '../assets/projects/spui/texture-rust6.jpg',
      x: -0.9,
      xWheelDistance: 1.2,
      yMotor: 2.1,
      z: 4.67,
    });

    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 24,
      isFlipped: true,
      railLength: 1.4,
      radiusLarge: 0.55,
      radiusMotor: 0.2,
      rotateY: Math.PI * -0.04,
      textureUrl: '../assets/projects/spui/texture-rust3.jpg',
      x: 1.5,
      xWheelDistance: 0.7,
      yMotor: 3.7,
      z: 4.93,
    });
  }
}
