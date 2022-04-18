/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
// import { getMesh, getScene, renderBackground, setupBackground } from '@app/background';
import { Actor, createActor } from './actor';
// import { getScene2, renderScene2, setupScene2 } from './scene2';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 130;
const MEASURES = 3;
const STEPS = 16 * MEASURES;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  scene2: THREE.Scene;

  contextWebGL: WebGLRenderingContext;

  contextSpui: CanvasRenderingContext2D | null;

  clippingPath: Path2D;

  actorGirlBlack: Actor;

  actorGirlAtStart: Actor;

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

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // CANVAS SPUI
    const canvas = document.getElementById('canvas-spui') as HTMLCanvasElement;
    if (canvas) {
      this.contextSpui = canvas.getContext('2d');
    }
    this.contextWebGL = this.renderer.getContext();

    this.clippingPath = new Path2D();
    this.clippingPath.moveTo(0, 0);
    this.clippingPath.lineTo(816, 0);
    this.clippingPath.lineTo(816, 668);
    this.clippingPath.lineTo(802, 741);
    this.clippingPath.lineTo(802, 808);
    this.clippingPath.lineTo(796, 1080);
    this.clippingPath.lineTo(0, 1080);
    this.clippingPath.closePath();

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

    this.postCreate();
  }

  postRender() {
    if (this.contextSpui) {
      // draw the complete canvas for the right half
      this.contextSpui.drawImage(this.contextWebGL.canvas, 0, 0);

      // set the stage for the left half
      // this.blue.getMesh().visible = false;
      // this.actorGirlBlack.getMesh().visible = true;
      this.actorGirlAtStart.getMesh().visible = false;

      // render the scene again
      this.renderer.render(this.scene, this.camera);

      // draw the left half
      this.contextSpui.save();
      this.contextSpui.clip(this.clippingPath);
      this.contextSpui.drawImage(this.contextWebGL.canvas, 0, 0);
      this.contextSpui.restore();

      // restore the stage for the right half
      // this.blue.getMesh().visible = true;
      // this.actorGirlBlack.getMesh().visible = false;
      this.actorGirlAtStart.getMesh().visible = true;
    }
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
        duration: STEP_DURATION * 26,
        videoStart: 79,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.addTween({
        delay: STEP_DURATION * 26,
        duration: STEP_DURATION * 22,
        videoStart: 112.7,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }

    // this.actorGirlBlack = await createActor(projectSettings, videos.main, {
    //   box: { w: to3d(450), h: to3d(780), d: 0.01 },
    //   imageRect: { w: 450, h: 780 },
    // });
    // this.actorGirlBlack.setStaticPosition(getMatrix4({ x: to3d(-960), y: to3d((1080 / 2) - 300), z: 0.01 }));
    // this.actorGirlBlack.addTween({
    //   delay: 0,
    //   duration: 1.9,
    //   videoStart: 46.5,
    //   fromMatrix4: getMatrix4({ x: to3d(-960 - 450), y: to3d((1080 / 2) - 300), z: 0.01 }),
    //   toMatrix4: getMatrix4({ x: to3d(-100), y: to3d((1080 / 2) - 300), z: 0.01 }),
    //   fromImagePosition: new THREE.Vector2(-400, 300),
    //   toImagePosition: new THREE.Vector2(1050, 300),
    // });

    this.actorGirlAtStart = await createActor(projectSettings, videos.main, {
      box: { w: to3d(650), h: to3d(800), d: 0.01 },
      imageRect: { w: 650, h: 800 },
    });
    this.actorGirlAtStart.addTween({
      delay: STEP_DURATION * 4,
      duration: 2,
      videoStart: 0.7,
      fromMatrix4: getMatrix4({ x: toVP3d(140), y: to3d(260), z: 0.01 }),
      toMatrix4: getMatrix4({ x: toVP3d(1920), y: to3d(260), z: 0.01 }),
      fromImagePosition: new THREE.Vector2(240, 280),
      toImagePosition: new THREE.Vector2(1720, 280),
    });

    // { // BLOKJE ROOD
    //   const actor = await createActor(projectSettings, undefined, {
    //     box: { w: 4, h: 4, d: 0.02 },
    //     imageRect: { w: 10, h: 10 },
    //   });
    //   actor.setColor('#ff0000');
    //   actor.setStaticPosition(getMatrix4({ x: -3, y: 2, z: 1 }));
    //   actor.addTween({
    //     delay: 0,
    //     duration: PATTERN_DURATION,
    //     fromMatrix4: getMatrix4({ x: -4, y: -1, z: -0.1 }),
    //     toMatrix4: getMatrix4({ x: 0, y: -1, z: -0.1 }),
    //   });
    //   // background.getMesh().add(actor.getMesh());
    //   this.red = actor;
    // }

    // { // BLOKJE BLAUW
    //   const actor = await createActor(projectSettings, undefined, {
    //     box: { w: 4, h: 4, d: 1 },
    //     imageRect: { w: 10, h: 10 },
    //   });
    //   actor.setColor('#0000ff');
    //   actor.setStaticPosition(getMatrix4({ z: 1 }));
    //   actor.addTween({
    //     delay: 0,
    //     duration: PATTERN_DURATION,
    //     fromMatrix4: getMatrix4({ x: 0, y: 0, z: -0.1 }),
    //     toMatrix4: getMatrix4({ x: 6, y: -1, z: -0.1 }),
    //   });
    //   // background.getMesh().add(actor.getMesh());
    //   // getMesh().add(actor.getMesh());
    //   this.blue = actor;
    // }
  }
}
