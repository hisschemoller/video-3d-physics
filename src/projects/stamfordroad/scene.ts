import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 101;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
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
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: this.height,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/stamfordroad/stamfordroad-main_frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/stamfordroad/frames/&img=frame_#FRAME#.png',
      },
    };

    const projectSettings: ProjectSettings = {
      scene3d: this,
      scene: this.scene,
      timeline: this.timeline,
      width: this.width,
      height: this.height,
      width3d: this.width3d,
      height3d: this.height3d,
    };

    await this.createActors(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time);
    super.updateAsync(time, delta);
  }

  async createActors(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = (size: number, isWidth = true) => (isWidth
      ? (size / this.width) * this.width3d
      : (size / this.height) * this.height3d * -1);

    const toVP3d = (size: number, isWidth = true) => (
      to3d(size, isWidth) + (isWidth ? (this.width3d * -0.5) : (this.height3d * 0.5)));

    const SVG_SCALE = this.width3d / this.width;

    actors.push(await createActor(projectSettings, videos.main, { // ACHTERGROND
      box: { w: this.width, h: this.height },
      matrix4: getMatrix4({ x: toVP3d(0), y: toVP3d(0, false) }),
      video: { start: 59.5, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.main, { // HIDE CHILDREN
      box: { w: 570, h: 320 },
      matrix4: getMatrix4({ x: toVP3d(120), y: toVP3d(690, false), z: 0.001 }),
      video: { start: 54.5, duration: PATTERN_DURATION },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));
  }
}
