/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';
import { createActor3, createTweenGroup } from './actor3';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 96;
const STEPS = 32;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 2;
const STEP_DURATION = PATTERN_DURATION / STEPS;
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

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.6;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(15, 5, 10);
    this.directionalLight.intensity = 0.9;

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
    await this.createActorsGroups(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * Actor groups.
   */
  async createActorsGroups(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    const y = toVP3d(1100, false);
    const x1 = 2;
    const x2 = 0.75;
    const x3 = -0.75;
    const x4 = -2;
    const z1 = 3.6;
    const z2 = 3.7;
    const z3 = 3.8;
    const z4 = 3.9;
    const m1 = getMatrix4({ x: x1, y, z: z1, ry: Math.PI * 0.03 });
    const m2 = getMatrix4({ x: x2, y, z: z2, ry: Math.PI * 0.03 });
    const m3 = getMatrix4({ x: x3, y, z: z3, ry: Math.PI * -0.47 });
    const m4 = getMatrix4({ x: x4, y, z: z4, ry: Math.PI * -0.47 });
    const m5 = getMatrix4({ x: x4, y, z: z4, ry: Math.PI * -0.97 });
    const m6 = getMatrix4({ x: x3, y, z: z3, ry: Math.PI * -0.97 });
    const m7 = getMatrix4({ x: x2, y, z: z2, ry: Math.PI * -1.47 });
    const m8 = getMatrix4({ x: x1, y, z: z1, ry: Math.PI * -1.47 });
    const m9 = getMatrix4({ x: x1, y, z: z1, ry: Math.PI * -1.97 });

    let panel1: Actor;
    let panel2: Actor;
    let panel3: Actor;
    let panel4: Actor;
    const actorWidth = 240;
    const aW3d = to3d(actorWidth);
    const S = STEP_DURATION;

    { // PANEL 1
      const h = 560;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / 2, y: to3d(h), z: aW3d / 2, ry: Math.PI / 2 }));
      // actor.setStaticPosition(getMatrix4({ x: aW3d * -1, y: 2.2, z: 3, ry: Math.PI * 1 }));
      panel1 = actor;
    }

    { // PANEL 2
      const h = 500;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / -2, y: to3d(h), z: aW3d / 2 }));
      // actor.setStaticPosition(getMatrix4({ x: aW3d * -2, y: 1.7, z: 3, ry: Math.PI * 1 }));
      panel2 = actor;
    }

    { // PANEL 3
      const h = 560;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / 2, y: to3d(h), z: aW3d / 2, ry: Math.PI / 2 }));
      // actor.setStaticPosition(getMatrix4({ x: aW3d * 1, y: 2.2, z: 3, ry: Math.PI * 1 }));
      panel3 = actor;
    }

    { // PANEL 4
      const h = 500;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / -2, y: to3d(h), z: aW3d / 2 }));
      // actor.setStaticPosition(getMatrix4({ x: aW3d * 2, y: 1.7, z: 3, ry: Math.PI * 1 }));
      panel4 = actor;
    }

    { // GROUP 1
      const group = createTweenGroup(projectSettings);
      group.getMesh().add(panel1.getMesh());
      group.getMesh().add(panel2.getMesh());
      group.addTween({ delay: S * 0, duration: S * 4.5, fromMatrix4: m1, toMatrix4: m2 });
      group.addTween({ delay: S * 4.5, duration: S * 4, fromMatrix4: m2, toMatrix4: m3, ease: 'sineInOut' });
      group.addTween({ delay: S * 8.5, duration: S * 4.5, fromMatrix4: m3, toMatrix4: m4 });
      group.addTween({ delay: S * 13, duration: S * 3, fromMatrix4: m4, toMatrix4: m5, ease: 'sineInOut' });
      group.addTween({ delay: S * 16, duration: S * 4.5, fromMatrix4: m5, toMatrix4: m6 });
      group.addTween({ delay: S * 20.5, duration: S * 4, fromMatrix4: m6, toMatrix4: m7, ease: 'sineInOut' });
      group.addTween({ delay: S * 24.5, duration: S * 4.5, fromMatrix4: m7, toMatrix4: m8 });
      group.addTween({ delay: S * 29, duration: S * 3, fromMatrix4: m8, toMatrix4: m9, ease: 'sineInOut' });
    }

    { // GROUP 2
      const group = createTweenGroup(projectSettings);
      group.getMesh().add(panel3.getMesh());
      group.getMesh().add(panel4.getMesh());
      group.addTween({ delay: S * 0, duration: S * 4.5, fromMatrix4: m5, toMatrix4: m6 });
      group.addTween({ delay: S * 4.5, duration: S * 4, fromMatrix4: m6, toMatrix4: m7, ease: 'sineInOut' });
      group.addTween({ delay: S * 8.5, duration: S * 4.5, fromMatrix4: m7, toMatrix4: m8 });
      group.addTween({ delay: S * 13, duration: S * 3, fromMatrix4: m8, toMatrix4: m9, ease: 'sineInOut' });
      group.addTween({ delay: S * 16, duration: S * 4.5, fromMatrix4: m1, toMatrix4: m2 });
      group.addTween({ delay: S * 20.5, duration: S * 4, fromMatrix4: m2, toMatrix4: m3, ease: 'sineInOut' });
      group.addTween({ delay: S * 24.5, duration: S * 4.5, fromMatrix4: m3, toMatrix4: m4 });
      group.addTween({ delay: S * 29, duration: S * 3, fromMatrix4: m4, toMatrix4: m5, ease: 'sineInOut' });
    }

    await Scene.addTallManInside(projectSettings, videos.main, panel1, aW3d, to3d(560), actorWidth);
    await Scene.addShortManInside(projectSettings, videos.main, panel2, aW3d, to3d(500), actorWidth);
    await Scene.addManWithCaseInside(projectSettings, videos.main, panel3, aW3d, to3d(560), actorWidth);
    await Scene.addManOpenJacketInside(projectSettings, videos.main, panel4, aW3d, to3d(560), actorWidth);

    await Scene.addTallMan(projectSettings, videos.main, panel1, aW3d, to3d(560), actorWidth, 4.5, 10.5);
    await Scene.addShortMan(projectSettings, videos.main, panel2, aW3d, to3d(500), actorWidth, 29, 0, 3, 13);
    await Scene.addManWithCase(projectSettings, videos.main, panel3, aW3d, to3d(560), actorWidth, 20.5, 10.5);
    await Scene.addManOpenJacket(projectSettings, videos.main, panel4, aW3d, to3d(500), actorWidth, 13, 16, 3, 13);
  }

  /**
   * addTallManInside
   */
  static async addTallManInside(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
  ) {
    const duration1 = 19;
    const duration2 = 16;
    const h = 500 * 1.6;
    const w = imgW * 1.6;
    const imgDistanceX = 1700 - 300;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI, z: -0.01 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.setMirrored(true);
    actor.addTween({
      delay: STEP_DURATION * 13,
      duration: STEP_DURATION * duration1,
      videoStart: 50.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1700, 470),
      toImagePosition: new THREE.Vector2(1700 - (imgDistanceX * (duration1 / (duration1 + duration2))), 470),
      isMirrored: true,
    });
    actor.addTween({
      delay: STEP_DURATION * 0,
      duration: STEP_DURATION * 9.5,
      videoStart: 50.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1700, 470),
      toImagePosition: new THREE.Vector2(1700 - (imgDistanceX * (duration1 / (duration1 + duration2))), 470),
      isMirrored: true,
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addShortManInside
   */
  static async addShortManInside(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
  ) {
    const h = 500 * 1.4;
    const w = imgW * 1.4;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI, z: -0.01 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.setMirrored(true);
    actor.addTween({
      delay: STEP_DURATION * 13,
      duration: STEP_DURATION * 19,
      videoStart: 73.8,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1400, 600),
      toImagePosition: new THREE.Vector2(720, 600),
      isMirrored: true,
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addManWithCaseInside
   */
  static async addManWithCaseInside(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
  ) {
    const duration1 = 3;
    const duration2 = 24.5;
    const h = 500 * 1.6;
    const w = imgW * 1.6;
    const imgDistanceX = 700 - 0;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI, z: -0.01 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.setMirrored(true);
    actor.addTween({
      delay: STEP_DURATION * 29,
      duration: STEP_DURATION * duration1,
      videoStart: 30.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(700, 500),
      toImagePosition: new THREE.Vector2(700 - (imgDistanceX * (duration1 / (duration1 + duration2))), 500),
      isMirrored: true,
    });
    actor.addTween({
      delay: STEP_DURATION * 0,
      duration: STEP_DURATION * duration2,
      videoStart: 30.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(700, 500),
      toImagePosition: new THREE.Vector2(700 - (imgDistanceX * (duration1 / (duration1 + duration2))), 500),
      isMirrored: true,
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addManOpenJacketInside
   */
  static async addManOpenJacketInside(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
  ) {
    const duration1 = 3;
    const duration2 = 20.5;
    const h = 500 * 1.6;
    const w = imgW * 1.6;
    const imgDistanceX = 1400 - 500;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI, z: -0.01 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.setMirrored(true);
    actor.addTween({
      delay: STEP_DURATION * 29,
      duration: STEP_DURATION * duration1,
      videoStart: 25.5,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1400, 550),
      toImagePosition: new THREE.Vector2(1400 - (imgDistanceX * (duration1 / (duration1 + duration2))), 550),
      isMirrored: true,
    });
    actor.addTween({
      delay: STEP_DURATION * 0,
      duration: STEP_DURATION * duration2,
      videoStart: 25.5,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1400, 550),
      toImagePosition: new THREE.Vector2(1400 - (imgDistanceX * (duration1 / (duration1 + duration2))), 550),
      isMirrored: true,
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addManWithCane
   */
  static async addManWithCane(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    delay2: number,
    duration1: number,
    duration2: number,
  ) {
    const h = 500 * 1.6;
    const w = imgW * 1.6;
    const imgDistanceX = 850 - 220;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 41.3,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(220, 570),
      toImagePosition: new THREE.Vector2(220 + (imgDistanceX * (duration1 / (duration1 + duration2))), 570),
    });
    actor.addTween({
      delay: STEP_DURATION * delay2,
      duration: STEP_DURATION * duration2,
      videoStart: 41.3 + (STEP_DURATION * duration1),
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(220 + (imgDistanceX * (duration1 / (duration1 + duration2))), 570),
      toImagePosition: new THREE.Vector2(850, 570),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addWomanAndChild
   */
  static async addWomanAndChild(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    delay2: number,
    duration1: number,
    duration2: number,
  ) {
    const h = 500 * 1.4;
    const w = imgW * 1.4;
    const imgDistanceX = 1200 - 500;
    const matrix4 = getMatrix4({ x: boxW, ry: Math.PI });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 53,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(500, 680),
      toImagePosition: new THREE.Vector2(500 + (imgDistanceX * (duration1 / (duration1 + duration2))), 680),
    });
    actor.addTween({
      delay: STEP_DURATION * delay2,
      duration: STEP_DURATION * duration2,
      videoStart: 53 + (STEP_DURATION * duration1),
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(500 + (imgDistanceX * (duration1 / (duration1 + duration2))), 680),
      toImagePosition: new THREE.Vector2(1200, 680),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addManWithCase
   */
  static async addManWithCase(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    duration1: number,
  ) {
    const h = 560 * 1.5;
    const w = imgW * 1.5;
    const matrix4 = getMatrix4({ z: 0 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 30.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(700, 500),
      toImagePosition: new THREE.Vector2(0, 500),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addTallMan
   */
  static async addTallMan(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    duration1: number,
    isFlippedY?: boolean,
  ) {
    const h = 560 * 1.5;
    const w = imgW * 1.5;
    const matrix4 = getMatrix4(isFlippedY ? { x: boxW, ry: Math.PI } : {});
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 50.0,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1700, 470),
      toImagePosition: new THREE.Vector2(980, 470),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addManOpenJacket
   */
  static async addManOpenJacket(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    delay2: number,
    duration1: number,
    duration2: number,
  ) {
    const h = 500 * 1.7;
    const w = imgW * 1.7;
    const imgDistanceX = 1400 - 720;
    const matrix4 = getMatrix4({ z: 0 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 25.5,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1450, 550),
      toImagePosition: new THREE.Vector2(1450 - (imgDistanceX * (duration1 / (duration1 + duration2))), 550),
    });
    actor.addTween({
      delay: STEP_DURATION * delay2,
      duration: STEP_DURATION * duration2,
      videoStart: 25.5 + (STEP_DURATION * duration1),
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1450 - (imgDistanceX * (duration1 / (duration1 + duration2))), 550),
      toImagePosition: new THREE.Vector2(500, 550),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * addMan
   */
  static async addShortMan(
    projectSettings: ProjectSettings,
    video: VideoData,
    panel: Actor,
    boxW: number,
    boxH: number,
    imgW: number,
    delay1: number,
    delay2: number,
    duration1: number,
    duration2: number,
  ) {
    const h = 500 * 1.3;
    const w = imgW * 1.3;
    const imgDistanceX = 1400 - 720;
    const matrix4 = getMatrix4({ z: 0 });
    const actor = await createActor3(projectSettings, video, {
      box: { w: boxW, h: boxH, d: 0.02 },
      imageRect: { w, h },
    });
    actor.addTween({
      delay: STEP_DURATION * delay1,
      duration: STEP_DURATION * duration1,
      videoStart: 73.8,
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1400, 600),
      toImagePosition: new THREE.Vector2(1400 - (imgDistanceX * (duration1 / (duration1 + duration2))), 620),
    });
    actor.addTween({
      delay: STEP_DURATION * delay2,
      duration: STEP_DURATION * duration2,
      videoStart: 73.8 + (STEP_DURATION * duration1),
      fromMatrix4: matrix4,
      fromImagePosition: new THREE.Vector2(1400 - (imgDistanceX * (duration1 / (duration1 + duration2))), 620),
      toImagePosition: new THREE.Vector2(720, 600),
    });
    panel.getMesh().add(actor.getMesh());
  }

  /**
   * createActors
   */
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
      video: { start: 54.5, duration: STEP_DURATION * 16 },
      tween: { position: 0, duration: STEP_DURATION * 16 },
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
