/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';
// import { createActor2 } from './actor2';
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
    // await this.createActorsGroup1(projectSettings, videos);
    // await this.createActorsGroup2(projectSettings, videos);
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
    const z = 3.6;
    const x1 = 3;
    const x2 = 1;
    const x3 = -1;
    const x4 = -3;
    const m1 = getMatrix4({ x: x1, y, z, ry: Math.PI * 0.03 });
    const m2 = getMatrix4({ x: x2, y, z, ry: Math.PI * 0.03 });
    const m3 = getMatrix4({ x: x3, y, z, ry: Math.PI * -0.47 });
    const m4 = getMatrix4({ x: x4, y, z, ry: Math.PI * -0.47 });
    const m5 = getMatrix4({ x: x4, y, z, ry: Math.PI * -0.97 });
    const m6 = getMatrix4({ x: x3, y, z, ry: Math.PI * -0.97 });
    const m7 = getMatrix4({ x: x2, y, z, ry: Math.PI * -1.47 });
    const m8 = getMatrix4({ x: x1, y, z, ry: Math.PI * -1.47 });
    const m9 = getMatrix4({ x: x1, y, z, ry: Math.PI * -1.97 });

    let actor1: Actor;
    let actor2: Actor;
    let actor3: Actor;
    let actor4: Actor;
    const actorWidth = 240;
    const aW3d = to3d(actorWidth);
    const S = STEP_DURATION;

    { // ACTOR 1
      const h = 560;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / 2, y: to3d(h), z: aW3d / 2, ry: Math.PI / 2 }));
      actor1 = actor;
    }

    { // ACTOR 2
      const h = 500;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / -2, y: to3d(h), z: aW3d / 2 }));
      actor2 = actor;
    }

    { // ACTOR 3
      const h = 560;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / 2, y: to3d(h), z: aW3d / 2, ry: Math.PI / 2 }));
      actor3 = actor;
    }

    { // ACTOR 4
      const h = 500;
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: aW3d, h: to3d(h), d: 0.02 },
        imageRect: { w: actorWidth, h },
      });
      actor.setStaticPosition(getMatrix4({ x: aW3d / -2, y: to3d(h), z: aW3d / 2 }));
      actor4 = actor;
    }

    { // GROUP 1
      const group = createTweenGroup(projectSettings);
      group.getMesh().add(actor1.getMesh());
      group.getMesh().add(actor2.getMesh());
      group.addTween({ delay: S * 0, duration: S * 4.5, fromMatrix4: m1, toMatrix4: m2 });
      group.addTween({ delay: S * 4.5, duration: S * 4, fromMatrix4: m2, toMatrix4: m3 });
      group.addTween({ delay: S * 8.5, duration: S * 4.5, fromMatrix4: m3, toMatrix4: m4 });
      group.addTween({ delay: S * 13, duration: S * 3, fromMatrix4: m4, toMatrix4: m5 });
      group.addTween({ delay: S * 16, duration: S * 4.5, fromMatrix4: m5, toMatrix4: m6 });
      group.addTween({ delay: S * 20.5, duration: S * 4, fromMatrix4: m6, toMatrix4: m7 });
      group.addTween({ delay: S * 24.5, duration: S * 4.5, fromMatrix4: m7, toMatrix4: m8 });
      group.addTween({ delay: S * 29, duration: S * 3, fromMatrix4: m8, toMatrix4: m9 });
    }

    { // GROUP 2
      const group = createTweenGroup(projectSettings);
      group.getMesh().add(actor3.getMesh());
      group.getMesh().add(actor4.getMesh());
      group.addTween({ delay: S * 0, duration: S * 4.5, fromMatrix4: m5, toMatrix4: m6 });
      group.addTween({ delay: S * 4.5, duration: S * 4, fromMatrix4: m6, toMatrix4: m7 });
      group.addTween({ delay: S * 8.5, duration: S * 4.5, fromMatrix4: m7, toMatrix4: m8 });
      group.addTween({ delay: S * 13, duration: S * 3, fromMatrix4: m8, toMatrix4: m9 });
      group.addTween({ delay: S * 16, duration: S * 4.5, fromMatrix4: m1, toMatrix4: m2 });
      group.addTween({ delay: S * 20.5, duration: S * 4, fromMatrix4: m2, toMatrix4: m3 });
      group.addTween({ delay: S * 24.5, duration: S * 4.5, fromMatrix4: m3, toMatrix4: m4 });
      group.addTween({ delay: S * 29, duration: S * 3, fromMatrix4: m4, toMatrix4: m5 });
    }
  }

  /**
   * @param projectSettings
   * @param videos
   */
  async createActorsGroup2(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    let actor1: Actor;
    let actor2: Actor;

    { // MOEDER EN KIND?
      const imagePositionA = new THREE.Vector2(470, 680);
      const imagePositionB = new THREE.Vector2(1020, 680);
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: to3d(380 * 0.7), h: to3d(600 * 0.7), d: 0.02 },
        imageRect: { w: 380, h: 600 },
      });
      // actor.setStaticPosition(getMatrix4({ x: 2, y: toVP3d(680, false), z: 4 }));
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(600 * 0.7), ry: Math.PI * 0.5 }));
      actor.addTween({
        delay: STEP_DURATION * 0,
        duration: STEP_DURATION * 14,
        videoStart: 53,
        fromImagePosition: imagePositionA,
        toImagePosition: imagePositionB,
      });
      actor1 = actor;
    }

    { // MAN MET WANDELSTOK
      const height = 660;
      const imagePositionA = new THREE.Vector2(70, 550);
      const imagePositionB = new THREE.Vector2(690, 550);
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: to3d(300 * 0.72), h: to3d(height * 0.72), d: 0.02 },
        imageRect: { w: 300 * 1.25, h: height * 1.25 },
      });
      // actor.setStaticPosition(getMatrix4({ x: -1, y: toVP3d(630, false), z: 4 }));
      actor.setStaticPosition(getMatrix4({ x: to3d(300 * -0.72), y: to3d(height * 0.72) }));
      actor.addTween({
        delay: STEP_DURATION * 0,
        duration: STEP_DURATION * 12,
        videoStart: 41.0,
        fromImagePosition: imagePositionA,
        toImagePosition: imagePositionB,
      });
      actor2 = actor;
    }

    { // GROUP
      const matrix4a = getMatrix4({
        x: toVP3d(800), y: toVP3d(1100, false), z: 3.6, ry: Math.PI * 0.03,
      });
      const matrix4b = getMatrix4({
        x: toVP3d(1000), y: toVP3d(1100, false), z: 3.4, ry: Math.PI * 0.03,
      });
      const matrix4c = getMatrix4({
        x: toVP3d(1100), y: toVP3d(1100, false), z: 3.3, ry: Math.PI * -0.47,
      });
      const matrix4d = getMatrix4({
        x: toVP3d(1200), y: toVP3d(1100, false), z: 3.0, ry: Math.PI * -0.47,
      });
      const group = createTweenGroup(projectSettings);
      // group.setStaticPosition(getMatrix4({ x: -1, y: toVP3d(1100, false), z: 4 }));
      const delayAdd = STEP_DURATION * 0;
      group.getMesh().add(actor1.getMesh());
      group.getMesh().add(actor2.getMesh());
      group.addTween({
        delay: (STEP_DURATION * 0) + delayAdd,
        duration: STEP_DURATION * 6,
        fromMatrix4: matrix4a,
        toMatrix4: matrix4b,
      });
      group.addTween({
        delay: (STEP_DURATION * 6) + delayAdd,
        duration: STEP_DURATION * 4,
        fromMatrix4: matrix4b,
        toMatrix4: matrix4c,
      });
      group.addTween({
        delay: (STEP_DURATION * 10) + delayAdd,
        duration: STEP_DURATION * 4,
        fromMatrix4: matrix4c,
        toMatrix4: matrix4d,
      });
    }
  }

  /**
   * 
   * @param projectSettings 
   * @param videos 
   */
  async createActorsGroup1(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    let actor1: Actor;
    let actor2: Actor;

    { // MAN 1
      const imagePositionA = new THREE.Vector2(1400, 690);
      const imagePositionB = new THREE.Vector2(880, 690);
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: to3d(300 * 0.72), h: to3d(600 * 0.72), d: 0.02 },
        imageRect: { w: 300, h: 600 },
      });
      // actor.setStaticPosition(getMatrix4({ x: -2, y: toVP3d(670, false), z: 4 }));
      actor.setStaticPosition(getMatrix4({ x: to3d(300 * -0.72), y: to3d(600 * 0.72) }));
      actor.addTween({
        delay: STEP_DURATION * 0,
        duration: STEP_DURATION * 12,
        videoStart: 73.8,
        fromImagePosition: imagePositionA,
        toImagePosition: imagePositionB,
      });
      actor1 = actor;
    }

    { // MAN 2
      const height = 750;
      const imagePositionA = new THREE.Vector2(1650, 530);
      const imagePositionB = new THREE.Vector2(700, 530);
      const actor = await createActor3(projectSettings, videos.main, {
        box: { w: to3d(350 * 0.70), h: to3d(height * 0.70), d: 0.02 },
        imageRect: { w: 350 * 1.25, h: height * 1.25 },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(height * 0.65), ry: Math.PI * 0.5 }));
      actor.addTween({
        delay: STEP_DURATION * 0,
        duration: STEP_DURATION * 14,
        videoStart: 50.0,
        fromImagePosition: imagePositionA,
        toImagePosition: imagePositionB,
      });
      actor2 = actor;
    }

    { // GROUP
      const matrix4a = getMatrix4({
        x: toVP3d(1400), y: toVP3d(1100, false), z: 3.7, ry: Math.PI * 0.03,
      });
      const matrix4b = getMatrix4({
        x: toVP3d(1200), y: toVP3d(1100, false), z: 4.0, ry: Math.PI * 0.03,
      });
      const matrix4c = getMatrix4({
        x: toVP3d(1000), y: toVP3d(1100, false), z: 4.1, ry: Math.PI * -0.47,
      });
      const matrix4d = getMatrix4({
        x: toVP3d(800), y: toVP3d(1100, false), z: 4.3, ry: Math.PI * -0.47,
      });
      const group = createTweenGroup(projectSettings);
      group.getMesh().add(actor1.getMesh());
      group.getMesh().add(actor2.getMesh());
      // group.getMesh().add(new THREE.GridHelper());
      group.addTween({
        delay: STEP_DURATION * 0,
        duration: STEP_DURATION * 6,
        fromMatrix4: matrix4a,
        toMatrix4: matrix4b,
      });
      group.addTween({
        delay: STEP_DURATION * 6,
        duration: STEP_DURATION * 4,
        fromMatrix4: matrix4b,
        toMatrix4: matrix4c,
      });
      group.addTween({
        delay: STEP_DURATION * 10,
        duration: STEP_DURATION * 4,
        fromMatrix4: matrix4c,
        toMatrix4: matrix4d,
      });
    }

    // {
    //   const actor = await createActor2(projectSettings, videos.main, { // MAN 1
    //     box: { w: to3d(300), h: to3d(600), d: 0.02 },
    //     imageRect: {
    //       x: 1400, y: 680, w: 300, h: 600,
    //     },
    //     matrix4: getMatrix4({
    //       x: toVP3d(1400), y: toVP3d(670, false), z: 3.7, sx: 0.72, sy: 0.72,
    //     }),
    //     video: { start: 73.8 },
    //     tween: {
    //       delay: STEP_DURATION * 0,
    //       duration: STEP_DURATION * 6,
    //       toMatrix4: getMatrix4({ x: toVP3d(1200), y: toVP3d(670, false), z: 4.0 }),
    //       toImagePosition: new THREE.Vector2(1150, 690),
    //     },
    //   });
    //   actor.addTween({
    //     delay: STEP_DURATION * 6,
    //     duration: STEP_DURATION * 6,
    //     videoStart: 73.8 + STEP_DURATION * 6,
    //     fromMatrix4: getMatrix4({ x: toVP3d(1200), y: toVP3d(670, false), z: 4.0 }),
    //     toMatrix4: getMatrix4({ x: toVP3d(1000), y: toVP3d(670, false), z: 4.0 }),
    //     fromImagePosition: new THREE.Vector2(1150, 690),
    //     toImagePosition: new THREE.Vector2(800, 690),
    //   });
    //   // actor.addTween({
    //   //   delay: STEP_DURATION * 6,
    //   //   duration: STEP_DURATION * 1,
    //   //   fromMatrix4: getMatrix4({ x: toVP3d(1000), y: toVP3d(670, false), z: 4.0 }),
    //   //   toMatrix4: getMatrix4({
    //   //  x: toVP3d(1000), y: toVP3d(670, false), z: 4.0, ry: Math.PI / 1.5 }),
    //   // });
    //   // actor.addTween({
    //   //   delay: STEP_DURATION * 7,
    //   //   duration: STEP_DURATION * 5 ,
    //   //   fromMatrix4: getMatrix4({
    //   //    x: toVP3d(1000), y: toVP3d(670, false), z: 4.0, ry: Math.PI / 1.5 }),
    //   //   toMatrix4: getMatrix4({
    //   //  x: toVP3d(900), y: toVP3d(670, false), z: 2.0, ry: Math.PI / 1.5 }),
    //   // });
    //   actors.push(actor);
    // }
  }

  // async createActors2(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
  //   const to3d = this.to3d.bind(this);
  //   const toVP3d = this.toVP3d.bind(this);

  //   actors.push(await createActor2(projectSettings, videos.main, { // MAN 3
  //     box: { w: to3d(300), h: to3d(700), d: 0.02 },
  //     imageRect: {
  //       x: 1400, y: 570, w: 350, h: 750,
  //     },
  //     matrix4: getMatrix4({
  //       x: toVP3d(1600), y: toVP3d(600, false), z: 4.5, sx: 0.70, sy: 0.70,
  //     }),
  //     video: { start: 28 },
  //     tween: {
  //       delay: STEP_DURATION * 0,
  //       duration: PATTERN_DURATION,
  //       toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(600, false), z: 4.5 }),
  //       toImagePosition: { x: -380, y: 590 },
  //     },
  //   }));

  //   actors.push(await createActor2(projectSettings, videos.main, { // MAN 2
  //     box: { w: to3d(350), h: to3d(700), d: 0.02 },
  //     imageRect: {
  //       x: 1700, y: 500, w: 400, h: 850,
  //     },
  //     matrix4: getMatrix4({
  //       x: toVP3d(1610), y: toVP3d(600, false), z: 4.7, sx: 0.73, sy: 0.73,
  //     }),
  //     video: { start: 50.0 },
  //     tween: {
  //       delay: STEP_DURATION * 10.66,
  //       duration: PATTERN_DURATION,
  //       toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(600, false), z: 5 }),
  //       toImagePosition: { x: -480, y: 520 },
  //     },
  //   }));

  //   actors.push(await createActor2(projectSettings, videos.main, { // MAN 1
  //     box: { w: to3d(300), h: to3d(600), d: 0.02 },
  //     imageRect: {
  //       x: 1720, y: 680, w: 300, h: 600,
  //     },
  //     matrix4: getMatrix4({
  //       x: toVP3d(1600), y: toVP3d(670, false), z: 3.7, sx: 0.72, sy: 0.72,
  //     }),
  //     video: { start: 72.4 },
  //     tween: {
  //       delay: STEP_DURATION * 21.33,
  //       duration: PATTERN_DURATION,
  //       toMatrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(670, false), z: 4.0 }),
  //       toImagePosition: { x: 400, y: 690 },
  //     },
  //   }));
  // }

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
