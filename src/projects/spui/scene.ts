/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
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
    const SVG_SCALE = this.width3d / this.width;

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

    { // STRAAT 1
      const actor = await createActor(projectSettings, videos.main, {
        svg: { depth: 0.001, scale: SVG_SCALE, url: '../assets/projects/spui/straat1.svg' },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({
        x: toVP3d(0),
        y: -2,
        rx: Math.PI * -0.5,
        ry: -0.0188,
      }));
    }

    { // STRAAT 2
      const actor = await createActor(projectSettings, videos.main, {
        svg: { depth: 0.001, scale: SVG_SCALE, url: '../assets/projects/spui/straat2.svg' },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({
        x: toVP3d(0),
        y: -2,
        z: 2.6,
        rx: Math.PI * -0.5,
        ry: -0.0188,
      }));
    }

    { // STRAAT 3
      const actor = await createActor(projectSettings, videos.main, {
        svg: { depth: 0.001, scale: SVG_SCALE, url: '../assets/projects/spui/straat3.svg' },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({
        x: toVP3d(0),
        y: -2,
        z: 3.58,
        rx: Math.PI * -0.5,
        ry: -0.0188,
      }));
    }

    { // STRAAT 4
      const actor = await createActor(projectSettings, videos.main, {
        svg: { depth: 0.001, scale: SVG_SCALE, url: '../assets/projects/spui/straat4.svg' },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({
        x: toVP3d(0),
        y: -2,
        z: 4.55,
        rx: Math.PI * -0.5,
        ry: -0.0188,
      }));
    }
  }
}
