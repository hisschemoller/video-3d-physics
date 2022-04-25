/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE, Types } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

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
    const to3d = this.to3d.bind(this);

    if (this.physics.debug) {
      this.physics.debug.enable();
    }

    const ground = this.add.box({
      y: -2.4, z: to3d(360), width: to3d(1920), height: 1, depth: to3d(720),
    });
    ground.rotation.z = 0.0188;
    this.physics.add.existing(ground, { mass: 0 });
    ground.body.setFriction(1);

    // this.createPhysicsMachine1(ground);
    // this.sliderTest(ground);
    this.createPhysicsMachine2(ground);
  }

  createPhysicsMachine2(ground: Types.ExtendedObject3D) {
    const Z = 3.5;

    // WHEEL_MOTOR
    const wheelMotor = this.add.cylinder({
      height: 0.05,
      radiusBottom: 0.5,
      radiusSegments: 64,
      radiusTop: 0.5,
      x: 2,
      y: 0,
      z: Z,
    });
    wheelMotor.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelMotor, { mass: 10 });

    // POLE
    const pole = this.add.box({
      depth: 0.05,
      height: 0.05,
      width: 3.4,
      x: 0.3,
      y: 0.2,
      z: Z + 0.11,
    });
    this.physics.add.existing(pole, { mass: 0.5 });

    // WHEEL_LARGE
    const wheelLarge = this.add.cylinder({
      height: 0.05,
      radiusBottom: 1,
      radiusSegments: 64,
      radiusTop: 1,
      x: -1.4,
      y: -1,
      z: Z,
    });
    wheelLarge.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelLarge, { mass: 0.1 });

    // RAIL
    this.physics.add.box({
      depth: 0.05,
      height: 0.1,
      width: 1,
      x: -1.4,
      y: -1.9,
      z: Z - 0.05,
      mass: 0,
    });

    // STOP
    this.physics.add.box({
      depth: 0.05,
      height: 0.05,
      width: 0.05,
      x: -2.8,
      y: -1,
      z: Z,
      mass: 0,
    });

    // POLE2
    // const pole2 = this.add.box({
    //   depth: 0.05,
    //   height: 0.05,
    //   width: 1.5,
    //   x: 0.7,
    //   y: -1.1,
    //   z: Z + 0.11,
    // });
    // this.physics.add.existing(pole2, { mass: 0.5 });

    // GROUND TO WHEEL_MOTOR: HINGE
    const pivotOnGround: Types.XYZ = { x: 2, y: 2.2, z: 0.5 };
    const pivotOnWheelM: Types.XYZ = { x: 0, y: 0, z: 0 };
    const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelMAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    const motorHinge = this.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
      pivotA: { ...pivotOnGround },
      pivotB: { ...pivotOnWheelM },
      axisA: { ...hingeGroundAxis },
      axisB: { ...hingeWheelMAxis },
    });

    { // WHEEL_MOTOR TO POLE: HINGE
      const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: 0.45 };
      const pivotOnPole: Types.XYZ = { x: 1.7, y: 0, z: 0 };
      const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
      this.physics.add.constraints.hinge(wheelMotor.body, pole.body, {
        pivotA: { ...pivotOnWheel },
        pivotB: { ...pivotOnPole },
        axisA: { ...hingeWheelAxis },
        axisB: { ...hingePoleAxis },
      });
    }

    { // POLE TO WHEEL_LARGE: HINGE
      const pivotOnPole: Types.XYZ = { x: -1.7, y: 0, z: 0 };
      const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: -0.95 };
      const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
      const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      this.physics.add.constraints.hinge(pole.body, wheelLarge.body, {
        pivotA: { ...pivotOnPole },
        pivotB: { ...pivotOnWheel },
        axisA: { ...hingePoleAxis },
        axisB: { ...hingeWheelAxis },
      });
    }

    // { // WHEEL_LARGE TO POLE2: HINGE
    //   const pivotOnWheel: Types.XYZ = { x: 0.8, y: 0.11, z: 0.1 };
    //   const pivotOnPole: Types.XYZ = { x: -0.8, y: 0, z: 0 };
    //   const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    //   const hingePoleAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    //   this.physics.add.constraints.hinge(wheelLarge.body, pole2.body, {
    //     pivotA: { ...pivotOnWheel },
    //     pivotB: { ...pivotOnPole },
    //     axisA: { ...hingeWheelAxis },
    //     axisB: { ...hingePoleAxis },
    //   });
    // }

    const speed = 2;
    motorHinge.enableAngularMotor(true, speed, 0.25);
  }

  sliderTest(ground: Types.ExtendedObject3D) {
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

  createPhysicsMachine1(ground: Types.ExtendedObject3D) {
    // WHEEL_BIG
    const wheelBig = this.add.cylinder({
      height: 0.05,
      radiusBottom: 1.2,
      radiusSegments: 64,
      radiusTop: 1.2,
      x: -2,
      y: -0.7,
      z: 3.54,
    });
    // wheelBig.rotation.z = 0.03;
    wheelBig.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelBig);

    // WHEEL_BIG_FIX
    const wheelBigFix = this.add.cylinder({
      height: 0.05,
      radiusBottom: 0.2,
      radiusSegments: 64,
      radiusTop: 0.2,
      x: -2,
      y: -0.7,
      z: 3.64,
    });
    // wheelBigFix.rotation.z = 0.03;
    wheelBigFix.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelBigFix);

    // WHEEL_BIG_SLIDER
    const wheelBigSlider = this.add.box({
      depth: 0.05,
      height: 0.05,
      width: 1,
      x: -2,
      y: -0.7,
      z: 3.7,
    });
    this.physics.add.existing(wheelBigSlider);

    // WHEEL_MOTOR
    const wheelMotor = this.add.cylinder({
      height: 0.05,
      radiusBottom: 0.4,
      radiusSegments: 64,
      radiusTop: 0.4,
      x: 1.6,
      y: 0,
      z: 3.54,
    });
    wheelMotor.rotation.z = 0.03;
    wheelMotor.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(wheelMotor);

    // POLE
    const pole = this.add.box({
      depth: 0.05,
      height: 0.05,
      width: 3.4,
      x: -0.3,
      y: 0.2,
      z: 3.7,
    });
    pole.rotation.z = 0.03;
    pole.rotation.x = Math.PI * 0.5;
    this.physics.add.existing(pole);

    { // HINGE GROUND TO WHEEL_BIG_FIX
      const pivotOnGround: Types.XYZ = { x: -2, y: 1.7, z: 0.65 };
      const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: 0 };
      const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
      const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      this.physics.add.constraints.hinge(ground.body, wheelBigFix.body, {
        pivotA: { ...pivotOnGround },
        pivotB: { ...pivotOnWheel },
        axisA: { ...hingeGroundAxis },
        axisB: { ...hingeWheelAxis },
      });
    }

    { // SLIDER WHEEL_BIG_FIX TO WHEEL_BIG_SLIDER
      const frameA = { x: 0, y: 0, z: 0 };
      const frameB = { x: 0, y: 0, z: 0 };
      this.physics.add.constraints.slider(wheelBigFix.body, wheelBigSlider.body, {
        frameA,
        frameB,
        linearLowerLimit: -0.5,
        linearUpperLimit: 0.5,
      });
    }

    { // HINGE WHEEL_BIG_SLIDER TO WHEEL_BIG
      const pivotOnSlider: Types.XYZ = { x: -0.5, y: 0, z: 0 };
      const pivotOnWheel: Types.XYZ = { x: 0, y: 0.4, z: 0 };
      const hingeSliderAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      this.physics.add.constraints.hinge(wheelBigSlider.body, wheelBig.body, {
        pivotA: { ...pivotOnSlider },
        pivotB: { ...pivotOnWheel },
        axisA: { ...hingeSliderAxis },
        axisB: { ...hingeWheelAxis },
      });
    }

    // HINGE GROUND TO WHEEL_MOTOR
    const pivotOnGround: Types.XYZ = { x: 1.6, y: 2.3, z: 0.65 };
    const pivotOnWheel: Types.XYZ = { x: 0, y: 0, z: 0 };
    const hingeGroundAxis: Types.XYZ = { x: 0, y: 0, z: 1 };
    const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    const motorHinge = this.physics.add.constraints.hinge(ground.body, wheelMotor.body, {
      pivotA: { ...pivotOnGround },
      pivotB: { ...pivotOnWheel },
      axisA: { ...hingeGroundAxis },
      axisB: { ...hingeWheelAxis },
    });

    { // HINGE WHEEL_MOTOR TO POLE
      const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: 0.35 };
      const pivotOnPole: Types.XYZ = { x: 1.7, y: 0, z: 0 };
      const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      const hingePoleAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
      this.physics.add.constraints.hinge(wheelMotor.body, pole.body, {
        pivotA: { ...pivotOnWheel },
        pivotB: { ...pivotOnPole },
        axisA: { ...hingeWheelAxis },
        axisB: { ...hingePoleAxis },
      });
    }

    // { // HINGE POLE TO WHEEL_BIG
    //   const pivotOnPole: Types.XYZ = { x: -1.7, y: 0, z: 0 };
    //   const pivotOnWheel: Types.XYZ = { x: 0, y: 0.11, z: -1.1 };
    //   const hingePoleAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    //   const hingeWheelAxis: Types.XYZ = { x: 0, y: 1, z: 0 };
    //   this.physics.add.constraints.hinge(pole.body, wheelBig.body, {
    //     pivotA: { ...pivotOnPole },
    //     pivotB: { ...pivotOnWheel },
    //     axisA: { ...hingePoleAxis },
    //     axisB: { ...hingeWheelAxis },
    //   });
    // }

    const speed = 2;
    motorHinge.enableAngularMotor(true, speed, 0.25);
  }
}
