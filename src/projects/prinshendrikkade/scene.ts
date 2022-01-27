/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 107;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
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
    this.height3d = 9;
    this.fps = 25;
    this.captureFps = 25;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 2, 0);
    this.pCamera.position.set(0, 0, 8.3);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

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
          ? '../assets/projects/prinshendrikkade/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/prinshendrikkade/frames/&img=frame_#FRAME#.png',
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

    await this.createBackgroundActors(projectSettings, videos);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createActors
   */
  async createBackgroundActors(projectSettings: ProjectSettings, videos: { [key: string]: VideoData }) {
    const to3d = this.to3d.bind(this);
    const toVP3d = this.toVP3d.bind(this);

    const tweenData = {
      delay: 0,
      duration: PATTERN_DURATION,
      videoStart: 130.5,
      fromImagePosition: new THREE.Vector2(0, 0),
      toImagePosition: new THREE.Vector2(0, 0),
    };

    const SCALE2 = 1.115;

    const group = createTweenGroup(projectSettings); // GROUP
    // group.setStaticPosition(getMatrix4({ x: toVP3d(0), y: toVP3d(-255, false), rx: 0.23 }));
    group.setStaticPosition(getMatrix4({ x: toVP3d(-170), y: toVP3d(-265, false), rx: 0.23, sx: 1.1, sy: 1.1 }));

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.addTween(tweenData);
      group.getMesh().add(actor.getMesh());
    }

    { // BG ENLARGED
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: -0.5, z: 0.001, sx: SCALE2, sy: SCALE2 }));
      actor.addTween(tweenData);
      group.getMesh().add(actor.getMesh());
    }

    { // ST NICOLAASKERK ROOF
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(500), h: to3d(400), d: 0.01 },
        imageRect: { w: 500, h: 400 },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: -0.9, z: 0.008, sx: SCALE2, sy: SCALE2 }));
      actor.addTween(tweenData);
      group.getMesh().add(actor.getMesh());
    }

    { // GREENLIGHT PANCAKES ROOF
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(360), h: to3d(400), d: 0.01 },
        imageRect: { w: 335, h: 380 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1565), y: -1.5, z: 0.008, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({
        ...tweenData,
        fromImagePosition: new THREE.Vector2(1450, 0),
        toImagePosition: new THREE.Vector2(1450, 0),
      });
      group.getMesh().add(actor.getMesh());
    }
  }
}
