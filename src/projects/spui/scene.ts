/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE, Types } from 'enable3d';
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
    this.ambientLight.intensity = 0.6;

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
        duration: STEP_DURATION * 16,
        videoStart: 79,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.addTween({
        delay: STEP_DURATION * 16,
        duration: STEP_DURATION * 16,
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

  createPhysics() {
    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    const ground = this.add.box({
      y: -2.4, z: 3, width: 16, height: 0.8, depth: 6,
    });
    ground.rotation.z = 0.0188;
    this.physics.add.existing(ground, { mass: 0 });
    ground.body.setFriction(1);

    // this.sliderTest(ground);
    const machineBasics = {
      duration: PATTERN_DURATION,
      ground,
      scene3d: this,
      timeline: this.timeline,
    };
    createPhysicsMachine({
      ...machineBasics,
      radiusMotor: 0.8,
      z: 2.5,
    });
    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 10,
      isFlipped: true,
      radiusLarge: 1.3,
      radiusMotor: 0.5,
      x: 1,
      yMotor: 2.3,
      z: 3.5,
    });
    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 20,
      radiusLarge: 1.5,
      radiusMotor: 0.3,
      x: -2.5,
      xWheelDistance: 5,
      yMotor: 3.5,
      z: 4,
    });
    createPhysicsMachine({
      ...machineBasics,
      delay: STEP_DURATION * 24,
      // duration: STEP_DURATION * 16,
      isFlipped: true,
      radiusLarge: 0.5,
      radiusMotor: 0.2,
      x: 2,
      xWheelDistance: 1,
      yMotor: 3.3,
      z: 5,
    });
  }

  sliderConstraintTest(ground: Types.ExtendedObject3D) {
    // WHEEL_MOTOR
    const wheelMotor = this.add.cylinder({
      height: 0.05,
      radiusBottom: 0.4,
      radiusSegments: 64,
      radiusTop: 0.4,
      x: 0,
      y: 0,
      z: 3.5,
    });
    // wheelMotor.rotation.z = 0.03;
    wheelMotor.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelMotor);

    // SLIDER_BAR
    const sliderBar = this.add.box({
      depth: 0.05,
      height: 0.05,
      width: 1,
      x: 0,
      y: 0,
      z: 3.7,
    });
    this.physics.add.existing(sliderBar, { mass: 1 });

    // WHEEL_SLIDING
    const wheelSliding = this.add.cylinder({
      height: 0.05,
      radiusBottom: 0.2,
      radiusSegments: 64,
      radiusTop: 0.2,
      x: 0,
      y: 0,
      z: 3.6,
    });
    // wheelMotor.rotation.z = 0.03;
    wheelSliding.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelSliding, { mass: 0.01 });

    // GROUND TO WHEEL_MOTOR: HINGE
    const pivotOnGround: Types.XYZ = { x: 0, y: 2, z: 0.5 };
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: 0 };
    const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    const motorHinge = this.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
      pivotA: { ...pivotOnGround },
      pivotB: { ...pivotOnWheel },
      axisA: { ...hingeGroundAxis },
      axisB: { ...hingeWheelAxis },
    });

    // WHEEL_MOTOR TO SLIDER_BAR: LOCK
    this.physics.add.constraints.lock(wheelMotor.body, sliderBar.body, true);

    { // SLIDER_BAR TO WHEEL_SLIDING: SLIDER
      const frameA = { x: 0, y: 0, z: 0 };
      const frameB = { x: 0, y: 0, z: Math.PI / 2 };
      this.physics.add.constraints.slider(sliderBar.body, wheelSliding.body, {
        frameA,
        frameB,
        linearLowerLimit: -0.5,
        linearUpperLimit: 0.5,
      });
    }

    const speed = 2;
    motorHinge.enableAngularMotor(true, speed, 0.25);
  }
}
