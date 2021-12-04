import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 119;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: (Actor)[] = [];

export default class Scene extends MainScene {
  timeline: Timeline;

  width3d: number;

  height3d: number;

  constructor() {
    super();

    this.width = 1920;
    this.height = 1080;
    this.width3d = 16;
    this.height3d = 9;
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 15;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // RENDERER
    this.renderer.setClearColor(0x749ecc);

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videos = {
      video1: {
        fps: 30,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: 920,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/weesperflat/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/weesperflat/frames/&img=frame_#FRAME#.png',
      },
      video2: {
        fps: 30,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: 664,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/weesperflat/frames2_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/weesperflat2/frames/&img=frame_#FRAME#.png',
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
      : (size / this.height) * this.height3d);

    actors.push(await createActor(projectSettings, videos.video2, { // NIEUWE KEIZERSGRACHT
      box: { x: 1003, y: 0 },
      matrix4: getMatrix4({
        x: to3d(1003) + 1,
        y: to3d(-231, false) - 0.2,
        z: -1,
        sx: 1.1,
        sy: 1.1,
      }),
      video: { start: 25.7, duration: PATTERN_DURATION },
      svg: {
        scale: this.width3d / this.width,
        url: '../assets/projects/weesperflat/nieuwekeizersgracht.svg',
      },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // DE FLAT
      box: { x: 0, y: 0 },
      matrix4: getMatrix4({ x: 0, y: to3d(-160, false), z: 0 }),
      video: { start: 25.7, duration: PATTERN_DURATION },
      svg: {
        scale: this.width3d / this.width,
        url: '../assets/projects/weesperflat/flat.svg',
      },
      tween: { position: 0, duration: PATTERN_DURATION },
    }));
  }
}
