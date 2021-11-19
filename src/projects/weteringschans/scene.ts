import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { ProjectSettings, VideoData } from './interfaces';
import { Actor, createActor } from './actor';
import { Scenery, createScenery } from './scenery';
import { createWalls } from './walls';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 119;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: (Actor | Scenery)[] = [];

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
    this.captureThrottle = 15;
    this.captureLastFrame = Math.floor(PATTERN_DURATION * this.fps) * 2; // 2 maten
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 9.6);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.6;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(-20, 5, 10);
    this.directionalLight.intensity = 1;

    // PHYSICS
    this.physics.setGravity(0, -4, 0);

    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videoData: VideoData = {
      fps: 30,
      scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
      height: isPreview ? this.height * PROJECT_PREVIEW_SCALE : this.height,
      width: isPreview ? this.width * PROJECT_PREVIEW_SCALE : this.width,
      imgSrcPath: isPreview
        ? '../assets/projects/weteringschans/frames_preview/frame_#FRAME#.png'
        : 'fs-img?dir=/Volumes/Samsung_X5/weteringschans/frames/&img=frame_#FRAME#.png',
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

    this.createActors(projectSettings, videoData);

    this.postCreate();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.forEach((actor) => actor.loadImage());
    super.postRender();
  }

  async createActors(projectSettings: ProjectSettings, videoData: VideoData) {
    actors.push(await createActor(projectSettings, videoData, { // ACHTERGROND
      xPx: 0,
      yPx: 0,
      wPx: this.width,
      hPx: this.height,
      z: 0,
      vStart: 7.5,
      duration: STEP_DURATION * STEPS,
    }));

    // actors.push(await createActor(projectSettings, videoData, { // WALL0
    //   xPx: 0,
    //   yPx: 0,
    //   wPx: this.width,
    //   hPx: this.height,
    //   z: 0,
    //   vStart: 7.5,
    //   duration: STEP_DURATION * STEPS,
    //   svgUrl: '../assets/projects/weteringschans/wall0.svg',
    //   svgScale: this.width3d / this.width,
    // }));

    // actors.push(await createScenery(projectSettings, videoData, {
    //   box: {
    //     x: 0, y: 0, w: 200, h: 1000, d: 0.1,
    //   },
    //   matrix4: getMatrix4({
    //     x: 0, y: 0, z: 1, ry: 1,
    //   }),
    //   video: { start: 1, duration: PATTERN_DURATION },
    // }));

    actors.push(...await createWalls(projectSettings, videoData, {
      start: 1, duration: PATTERN_DURATION,
    }));
  }
}
