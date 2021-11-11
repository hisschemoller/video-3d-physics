import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix } from '@app/utils';
import { Actor, createActor } from './actor';
import createSphere from './sphere';
import { ProjectSettings, VideoData } from './interfaces';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 109;
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
    this.height = 1080;
    this.width3d = 16;
    this.height3d = 9;
    this.fps = 15;
    this.captureThrottle = 15;
    this.captureLastFrame = Math.floor(PATTERN_DURATION * this.fps);
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA
    this.pCamera.position.set(0, 0, 9.6);

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(-20, 5, 10);

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
        ? '../assets/projects/kortjewantsbrughuisje/frames_preview/frame_#FRAME#.png'
        : 'fs-img?dir=/Volumes/Samsung_X5/kortjewantsbrughuisje/frames/&img=frame_#FRAME#.png',
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
      vStart: 129,
      duration: STEP_DURATION * STEPS,
    }));

    createSphere(projectSettings, {
      duration: STEP_DURATION * 15,
    });

    const actor = await createActor(projectSettings, videoData, { // FRONT
      xPx: 0,
      yPx: 0,
      wPx: this.width,
      hPx: this.height,
      z: 0.8,
      vStart: 129,
      duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/kortjewantsbrughuisje/front.svg',
      svgScale: 0.1,
    });
    actors.push(actor);
    const mesh = actor.getMesh();
    const scale = 0.915;
    mesh.applyMatrix4(getMatrix({ sx: scale, sy: scale }));
  }
}
