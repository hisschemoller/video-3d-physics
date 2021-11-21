import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { ProjectSettings, VideoData } from './interfaces';
import { Actor, createActor } from './actor';
import { Scenery, createScenery } from './scenery';
import createSphere from './sphere';

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
    this.ambientLight.intensity = 0.4;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(15, 5, 10);
    this.directionalLight.intensity = 0.9;

    // PHYSICS
    this.physics.setGravity(0, 4, 0);

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
    const to3d = (size: number, isWidth = true) => (isWidth
      ? (size / this.width) * this.width3d
      : (size / this.height) * this.height3d);

    const BG_SCALE = 1.097;

    actors.push(await createScenery(projectSettings, videoData, { // ACHTERGROND
      box: { w: this.width, h: this.height },
      matrix4: getMatrix4({
        x: 0, y: 0, z: -1, sx: BG_SCALE, sy: BG_SCALE, sz: BG_SCALE,
      }),
      video: { start: 23, duration: PATTERN_DURATION },
    }));

    {
      const wall = await createScenery(projectSettings, videoData, { // GEVEL
        box: { x: 117, w: this.width, h: this.height },
        matrix4: getMatrix4({ x: to3d(117), y: 0 }),
        video: { start: 23, duration: PATTERN_DURATION },
        svg: {
          scale: this.width3d / this.width,
          url: '../assets/projects/weteringschans/wallwindows.svg',
          alignWithViewport: true,
        },
      });
      // const mesh = wall.getMesh();
      // mesh.body.setGravity(0, 0, 0);
      // this.add.existing(mesh as unknown as ExtendedObject3D);
      actors.push(wall);
    }

    createSphere(projectSettings, {
      x: to3d(386),
      y: to3d(78),
      z: 0,
      radius: 0.2,
      duration: STEP_DURATION * 15,
    });

    createSphere(projectSettings, {
      x: to3d(1701),
      y: to3d(247),
      z: 0,
      radius: 0.3,
      duration: STEP_DURATION * 15,
    });
  }
}
