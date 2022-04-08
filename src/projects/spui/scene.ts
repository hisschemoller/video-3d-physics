/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { Actor, createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 98;
const STEPS = 16 * 3;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 2;
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
    this.cameraTarget = new THREE.Vector3(0, 1.8, 0);
    this.pCamera.position.set(0, 1.8, 10);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {};

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

    // GROUP
    // const toVP3d = this.toVP3d.bind(this);
    // const group = createTweenGroup(projectSettings);
    // group.setStaticPosition(getMatrix4({ x: toVP3d(0), y: toVP3d(0, false) }));
    // const axesHelper = new THREE.AxesHelper(25);
    // group.getMesh().add(axesHelper);

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
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
  ) {
    const to3d = this.to3d.bind(this);
    const SVG_SCALE = this.width3d / this.width;

    { // CAMERA ACTOR
      const actor = await createActor(projectSettings, undefined, {
        box: { w: 1, h: 1, d: 1 },
        imageRect: { w: 10, h: 10 },
      });
      actor.setStaticPosition(getMatrix4({ }));
      actor.setColor('#ff0000');
    }
  }
}
