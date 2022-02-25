/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 112.5;
const STEPS = 48;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 4;
const STEP_DURATION = PATTERN_DURATION / STEPS;

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1484;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 12.5;
    this.captureFps = 25;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 3;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 2.8, 0);
    this.pCamera.position.set(0, 0, 12);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    this.ambientLight.intensity = 0.55;

    this.directionalLight.position.set(12, 12, 12);
    this.directionalLight.intensity = 1.2;
    this.directionalLight.color.setHSL(0.1, 0.5, 0.95);

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videos = {
      main: {
        fps: 25,
        height: this.height,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/robertmosesplaza/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/robertmosesplaza/frames/&img=frame_#FRAME#.png',
      },
      top: {
        fps: 25,
        height: 742,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 960,
        imgSrcPath: isPreview
          ? '../assets/projects/robertmosesplaza/frames-top_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/robertmosesplaza-top/frames/&img=frame_#FRAME#.png',
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

    const group = createTweenGroup(projectSettings); // GROUP
    group.setStaticPosition(getMatrix4({ x: -8.4, y: 9.45, rx: 0.227, sx: 1.05, sy: 1.05 }));

    await this.createBackgroundActors(projectSettings, videos, group.getMesh());
    await this.createGroundActors(projectSettings, videos, group.getMesh());
    await this.createActors(projectSettings, videos, group.getMesh());

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createBackgroundActors
   */
  async createBackgroundActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    const y = to3d(-860);

    const tweenConfig = (
      videoStart: number,
      imagePos: THREE.Vector2,
      delay: number,
      duration: number,
    ) => ({
      videoStart,
      delay: STEP_DURATION * delay,
      duration: STEP_DURATION * duration,
      fromImagePosition: imagePos.clone(),
      toImagePosition: imagePos.clone(),
    });

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: to3d(1160), d: 0.02 },
        imageRect: { w: this.width, h: 1160 },
      });
      actor.setStaticPosition(getMatrix4({ }));
      actor.addTween({ ...tweenConfig(2, new THREE.Vector2(0, 0), 0, 48) });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // RIGHT
      const imagePos = new THREE.Vector2(1426, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(490), h: to3d(320), d: 0.02 },
        imageRect: { w: 490, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1426), y, z: 0.01 }));
      actor.addTween({ ...tweenConfig(2, imagePos, 0, 8) });
      actor.addTween({ ...tweenConfig(2, imagePos, 8, 8) });
      actor.addTween({ ...tweenConfig(2, imagePos, 16, 8) });
      actor.addTween({ ...tweenConfig(2, imagePos, 24, 8) });
      actor.addTween({ ...tweenConfig(2, imagePos, 32, 8) });
      actor.addTween({ ...tweenConfig(2, imagePos, 40, 8) });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MID RIGHT
      const imagePos = new THREE.Vector2(940, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(520), h: to3d(320), d: 0.02 },
        imageRect: { w: 520, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(940), y, z: 0.02 }));
      actor.addTween({ ...tweenConfig(30, imagePos, 0, 8) });
      actor.addTween({ ...tweenConfig(30, imagePos, 8, 8) });
      actor.addTween({ ...tweenConfig(30, imagePos, 16, 8) });
      actor.addTween({ ...tweenConfig(30, imagePos, 24, 8) });
      actor.addTween({ ...tweenConfig(30, imagePos, 32, 8) });
      actor.addTween({ ...tweenConfig(30, imagePos, 40, 8) });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MID LEFT
      const imagePos = new THREE.Vector2(330, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(630), h: to3d(320), d: 0.02 },
        imageRect: { w: 630, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(330), y, z: 0.01 }));
      actor.addTween({ ...tweenConfig(18, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(18, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(18, imagePos, 32, 8) });
      actor.addTween({ ...tweenConfig(18, imagePos, 40, 8) });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // LEFT
      const imagePos = new THREE.Vector2(0, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(340), h: to3d(320), d: 0.02 },
        imageRect: { w: 340, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(0), y: y + 0.02, z: 0.02 }));
      actor.addTween({ ...tweenConfig(30, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(30, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(30, imagePos, 32, 16) });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }

  /**
   * createBackgroundActors
   */
  async createGroundActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    const tweenConfig = (
      videoStart: number,
      imagePos: THREE.Vector2,
      delay: number,
      duration: number,
    ) => ({
      videoStart,
      delay: STEP_DURATION * delay,
      duration: STEP_DURATION * duration,
      fromImagePosition: imagePos.clone(),
      toImagePosition: imagePos.clone(),
    });

    { // RIGHT FRONT
      const imagePos = new THREE.Vector2(482, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 8, h: 4, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 8, y: -10.3, z: 2, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(40, imagePos, to3d(0), 16) });
      actor.addTween({ ...tweenConfig(40, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(40, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // LEFT FRONT
      const imagePos = new THREE.Vector2(172, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 8, h: 4, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 0.1, y: -10.3, z: 2, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(42, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(42, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(42, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // RIGHT 2
      const imagePos = new THREE.Vector2(178, 114);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 7.9, y: -11.12, z: -3, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(3, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(3, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(3, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // RIGHT RIGHT 2
      const imagePos = new THREE.Vector2(172, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 16.4, y: -11.12, z: -3, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(44, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // LEFT 2
      const imagePos = new THREE.Vector2(476, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: -0.8, y: -11.12, z: -3, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(47, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // LEFT LEFT 2
      const imagePos = new THREE.Vector2(172, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: -9.3, y: -11.12, z: -3, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(47, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // RIGHT 3
      const imagePos = new THREE.Vector2(482, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 7.95, y: -11.95, z: -8, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(44, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // LEFT 3
      const imagePos = new THREE.Vector2(172, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: -0.8, y: -11.95, z: -8, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(47, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(47, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // LEFT LEFT 3
      const imagePos = new THREE.Vector2(174, 110);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: -9.3, y: -11.95, z: -8, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(3, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(3, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(3, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }

    { // RIGHT RIGHT 3
      const imagePos = new THREE.Vector2(172, 398);
      const actor = await createActor(projectSettings, videos.top, {
        box: { w: 9, h: 5, d: 0.01 },
        imageRect: { w: 311, h: 266 },
      });
      actor.setStaticPosition(getMatrix4({ x: 16.4, y: -11.95, z: -8, rx: Math.PI * -0.55 }));
      actor.addTween({ ...tweenConfig(44, imagePos, 0, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 16, 16) });
      actor.addTween({ ...tweenConfig(44, imagePos, 32, 16) });
      group.add(actor.getMesh());
    }
  }

  /**
   * createBackgroundActors
   */
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    const SVG_SCALE = this.width3d / this.width;
    const S = STEP_DURATION;
    const V = 5.9;
    const ease = 'sineInOut';

    const tweenConfig = (
      m4From: THREE.Matrix4,
      m4To: THREE.Matrix4,
      imgFrom: THREE.Vector2,
      imgTo: THREE.Vector2,
      delay: number,
      duration: number,
    ) => ({
      delay: S * delay,
      duration: S * duration,
      fromMatrix4: m4From,
      toMatrix4: m4To,
      fromImagePosition: imgFrom.clone(),
      toImagePosition: imgTo.clone(),
    });

    { // CIRCLE 1
      const mm1 = getMatrix4({ x: to3d(600), y: to3d(-750), z: 0.5 });
      const mm2 = getMatrix4({ x: to3d(400), y: to3d(-750), z: 4 });
      const mm3 = getMatrix4({ x: to3d(1200), y: to3d(-750), z: 3 });
      const p1 = new THREE.Vector2(600, 750 + 100);
      const p2 = new THREE.Vector2(400, 750 + 100);
      const p3 = new THREE.Vector2(1200, 750 + 100);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 100 * 4, h: 100 * 4 },
        svg: { depth: 0.1, scale: SVG_SCALE * 4, url: '../assets/projects/robertmosesplaza/circle.svg' },
      });
      actor.addTween({ ...tweenConfig(mm1, mm2, p1, p2, 0, 16), videoStart: V + (S * 0), ease });
      actor.addTween({ ...tweenConfig(mm2, mm3, p2, p3, 16, 16), videoStart: V + (S * 16), ease });
      actor.addTween({ ...tweenConfig(mm3, mm1, p3, p1, 32, 16), videoStart: V + (S * 32), ease });
      group.add(actor.getMesh());
    }

    { // CIRCLE 2
      const mm1 = getMatrix4({ x: to3d(600), y: to3d(-750), z: 5 });
      const mm2 = getMatrix4({ x: to3d(200), y: to3d(-750), z: 0.5 });
      const mm3 = getMatrix4({ x: to3d(1200), y: to3d(-800), z: 5 });
      const p1 = new THREE.Vector2(600, 750 + 100);
      const p2 = new THREE.Vector2(200, 750 + 100);
      const p3 = new THREE.Vector2(1200, 800 + 100);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 100 * 3, h: 100 * 3 },
        svg: { depth: 0.1, scale: SVG_SCALE * 3, url: '../assets/projects/robertmosesplaza/circle.svg' },
      });
      actor.addTween({ ...tweenConfig(mm2, mm3, p2, p3, 7, 17), videoStart: V + (S * 7), ease });
      actor.addTween({ ...tweenConfig(mm3, mm1, p3, p1, 24, 14), videoStart: V + (S * 24), ease });
      actor.addTween({ ...tweenConfig(mm1, mm2, p1, p2, 38, 17), videoStart: V + (S * 38), ease });
      group.add(actor.getMesh());
    }

    { // CIRCLE 3
      const mm1 = getMatrix4({ x: to3d(1150), y: to3d(-750), z: 5 });
      const mm2 = getMatrix4({ x: to3d(1000), y: to3d(-750), z: 0.5 });
      const mm3 = getMatrix4({ x: to3d(300), y: to3d(-750), z: 1.5 });
      const p1 = new THREE.Vector2(1150, 750 + 100);
      const p2 = new THREE.Vector2(1000, 750 + 100);
      const p3 = new THREE.Vector2(300, 750 + 100);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 100 * 4, h: 100 * 4 },
        svg: { depth: 0.1, scale: SVG_SCALE * 4, url: '../assets/projects/robertmosesplaza/circle.svg' },
      });
      actor.addTween({ ...tweenConfig(mm1, mm2, p1, p2, 7, 14), videoStart: V + (S * 7), ease });
      actor.addTween({ ...tweenConfig(mm2, mm3, p2, p3, 21, 14), videoStart: V + (S * 21), ease });
      actor.addTween({ ...tweenConfig(mm3, mm1, p3, p1, 35, 20), videoStart: V + (S * 35), ease });
      group.add(actor.getMesh());
    }
  }
}
