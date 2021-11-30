import { ExtendedObject3D } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 119;
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
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 15;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    // const isPreview = true && !this.scene.userData.isCapture;

    this.postCreate();
  }
}
