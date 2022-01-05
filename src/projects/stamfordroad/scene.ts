import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';
import { createActor2 } from './actor2';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 96;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 2;
const STEP_DURATION = PATTERN_DURATION / (STEPS * 2);
const actors: Actor[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1440;
    this.width3d = 16;
    this.height3d = 12;
    this.fps = 15;
    this.captureFps = 25;
    this.captureThrottle = 15;
    this.captureDuration = PATTERN_DURATION * 1;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 12.8);

    // RENDERER
    this.renderer.setClearColor(0xeeeeee);

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
          ? '../assets/projects/stamfordroad/stamfordroad-main_frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/stamfordroad/frames/&img=frame_#FRAME#.png',
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
    await this.createActors2(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  async createActors2(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    actors.push(await createActor2(projectSettings, videos.main, { // MAN 3
      box: { w: to3d(300), h: to3d(700), d: 0.02 },
      imageRect: {
        x: 1400, y: 570, w: 350, h: 750,
      },
      matrix4: getMatrix4({
        x: toVP3d(1600), y: toVP3d(600, false), z: 4.5, sx: 0.70, sy: 0.70,
      }),
      video: { start: 28, duration: PATTERN_DURATION },
      tween: {
        delay: STEP_DURATION * 0,
        duration: PATTERN_DURATION,
        toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(600, false), z: 4.5 }),
        toImagePosition: { x: -380, y: 590 },
      },
    }));

    actors.push(await createActor2(projectSettings, videos.main, { // MAN 2
      box: { w: to3d(350), h: to3d(700), d: 0.02 },
      imageRect: {
        x: 1700, y: 500, w: 400, h: 850,
      },
      matrix4: getMatrix4({
        x: toVP3d(1610), y: toVP3d(600, false), z: 4.7, sx: 0.73, sy: 0.73,
      }),
      video: { start: 50.0, duration: PATTERN_DURATION },
      tween: {
        delay: STEP_DURATION * 10.66,
        duration: PATTERN_DURATION,
        toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(600, false), z: 5 }),
        toImagePosition: { x: -480, y: 520 },
      },
    }));

    actors.push(await createActor2(projectSettings, videos.main, { // MAN 1
      box: { w: to3d(300), h: to3d(600), d: 0.02 },
      imageRect: {
        x: 1720, y: 680, w: 300, h: 600,
      },
      matrix4: getMatrix4({
        x: toVP3d(1600), y: toVP3d(670, false), z: 3.7, sx: 0.72, sy: 0.72,
      }),
      video: { start: 72.4, duration: PATTERN_DURATION },
      tween: {
        delay: STEP_DURATION * 21.33,
        duration: PATTERN_DURATION,
        toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(670, false), z: 4.0 }),
        toImagePosition: { x: 400, y: 690 },
      },
    }));
  }

  async createActors(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    actors.push(await createActor(projectSettings, videos.main, { // ACHTERGROND
      box: { w: this.width, h: this.height },
      matrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(0, false) }),
      video: { start: 59.2, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.main, { // HIDE CHILDREN
      box: { w: 570, h: 320 },
      matrix4: getMatrix4({ x: toVP3d(120), y: toVP3d(690, false), z: 0.001 }),
      video: { start: 54.5, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    const rotationHMatrix4 = getMatrix4({ rx: (Math.PI * -0.5) + 0.2, ry: -0.011, rz: 0.05 });
    const rotationVMatrix4 = getMatrix4({ rx: 0, ry: 0.047, rz: 0.02 });

    {
      const texture = new THREE.TextureLoader().load('../assets/projects/stamfordroad/stoep.jpg');
      const box = this.add.box({
        x: 0,
        y: toVP3d(960, false),
        z: 0.3,
        width: to3d(1920),
        height: to3d(200),
        depth: 0.1,
      }, { lambert: { map: texture } });
      box.setRotationFromMatrix(rotationHMatrix4);
      this.physics.add.existing(box, { collisionFlags: 2, mass: 0 });
    }

    {
      const texture = new THREE.TextureLoader().load('../assets/projects/stamfordroad/stoeprand.jpg');
      const box = this.add.box({
        x: 0,
        y: toVP3d(987, false),
        z: 1.078,
        width: to3d(1920),
        height: to3d(24),
        depth: 0.1,
      }, { lambert: { map: texture } });
      box.setRotationFromMatrix(rotationVMatrix4);
      this.physics.add.existing(box, { collisionFlags: 2, mass: 0 });
    }

    {
      const texture = new THREE.TextureLoader().load('../assets/projects/stamfordroad/straat1.jpg');
      const box = this.add.box({
        x: 0,
        y: toVP3d(1043, false),
        z: 2.7,
        width: to3d(1820),
        height: to3d(400),
        depth: 0.1,
      }, { lambert: { map: texture } });
      box.setRotationFromMatrix(rotationHMatrix4);
      this.physics.add.existing(box, { collisionFlags: 2, mass: 0 });
    }

    {
      const texture = new THREE.TextureLoader().load('../assets/projects/stamfordroad/straat2.jpg');
      const box = this.add.box({
        x: 0.15,
        y: toVP3d(1105, false),
        z: 5.22,
        width: to3d(1270),
        height: to3d(220),
        depth: 0.1,
      }, { lambert: { map: texture } });
      box.setRotationFromMatrix(rotationHMatrix4);
      this.physics.add.existing(box, { collisionFlags: 2, mass: 0 });
    }
  }
}
