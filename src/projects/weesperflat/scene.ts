import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 115;
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

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.5;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(15, 5, 10);
    this.directionalLight.intensity = 0.9;

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
        x: 0,
        y: 160,
        imgSrcPath: isPreview
          ? '../assets/projects/weesperflat/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/weesperflat/frames/&img=frame_#FRAME#.png',
      },
      video2: {
        fps: 30,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        height: 664,
        width: this.width,
        x: 0,
        y: 231,
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
      : (size / this.height) * this.height3d * -1);

    const toVP3d = (size: number, isWidth = true) => (
      to3d(size, isWidth) + (isWidth ? (this.width3d * -0.5) : (this.height3d * 0.5)));

    const SVG_SCALE = this.width3d / this.width;

    {
      const actor = await createActor(projectSettings, videos.video2, { // BOMEN ACHTER
        video: {
          start: 25.7,
          duration: PATTERN_DURATION,
          alignWithViewport: false,
          x: 1236,
          y: 0,
        },
        svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/bomen.svg' },
        matrix4: getMatrix4({
          x: toVP3d(0) - 1.65,
          y: toVP3d(0, false) + 1,
          z: -2,
          sx: 1.2,
          sy: 1.2,
        }),
        tween: { position: 0, duration: PATTERN_DURATION },
      });
      const mesh = actor.getMesh();
      const material = (mesh.material as THREE.Material[])[1];
      material.transparent = true;
      material.opacity = 0.8;
      actors.push(actor);
    }

    actors.push(await createActor(projectSettings, videos.video2, { // NIEUWE KEIZERSGRACHT
      video: { start: 25.7, duration: PATTERN_DURATION },
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/nieuwekeizersgracht.svg' },
      matrix4: getMatrix4({
        x: toVP3d(1003),
        y: toVP3d(231, false),
        z: -1,
        sx: 1.1,
        sy: 1.1,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    actors.push(await createActor(projectSettings, videos.video1, { // DE FLAT
      svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/flat.svg' },
      video: { start: 25.7, duration: PATTERN_DURATION },
      matrix4: getMatrix4({
        x: toVP3d(0),
        y: toVP3d(this.height - videos.video1.height, false),
        z: 0,
      }),
      tween: { position: 0, duration: PATTERN_DURATION },
    }));

    // actors.push(await createActor(projectSettings, videos.video1, { // BOX TEST
    //   box: { w: 500, h: 270 },
    //   video: { start: 25.7, duration: STEP_DURATION * 14 },
    //   matrix4: getMatrix4({
    //     x: toVP3d(0),
    //     y: toVP3d(810, false), // 1080 - 270 = 810
    //     z: 0.2,
    //   }),
    //   tween: {
    //     position: 0,
    //     duration: STEP_DURATION * 15,
    //     matrix4End: getMatrix4({
    //       x: toVP3d(this.width - 500),
    //       y: toVP3d(videos.video1.y, false),
    //       z: 0.2,
    //     }),
    //   },
    // }));

    // actors.push(await createActor(projectSettings, videos.video1, { // SVG TEST
    //   svg: { scale: SVG_SCALE, url: '../assets/projects/weesperflat/test7.svg' },
    //   video: { start: 25.7, duration: STEP_DURATION * 14 },
    //   matrix4: getMatrix4({
    //     x: toVP3d(videos.video1.x),
    //     y: toVP3d(videos.video1.y, false),
    //     z: 0.1,
    //   }),
    //   tween: {
    //     position: 0,
    //     duration: STEP_DURATION * 15,
    //     matrix4End: getMatrix4({
    //       x: toVP3d(this.width - 637),
    //       y: toVP3d(810, false),
    //       z: 0.1,
    //     }),
    //   },
    // }));
  }
}
