import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { playSound } from '@app/audio';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 102;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 8;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

// eslint-disable-next-line no-console
console.log('PATTERN_DURATION', PATTERN_DURATION);
// eslint-disable-next-line no-console
console.log('STEP_DURATION', STEP_DURATION);

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
    this.fps = 30;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0x939393;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 1.92, 0);
    this.pCamera.position.set(0, 0, 8.4);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // ORBIT CONTROLS
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    // this.directionalLight.color.setRGB(1, 1, 1);
    // this.directionalLight.position.set(0.5, 9, 6 + 9.5);
    // this.directionalLight.intensity = 1.4;
    // this.directionalLight.target.position.set(0, 0, 9.5);
    // this.scene.add(this.directionalLight.target);

    // AMBIENT LIGHT
    // this.ambientLight.intensity = 0.23;

    // AUDIO
    if (!this.scene.userData.isCapture) {
      // playSound('../assets/projects/hausderstatistik/hausderstatistik.wav');
    }

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      frame19: {
        imgSrc: '../assets/projects/haarlemmerplein/haarlemmerplein-19-perspective_frame_500.png',
        height: 1080,
        width: 1920,
      },
      frame20: {
        imgSrc: '../assets/projects/haarlemmerplein/haarlemmerplein-20-perspective_frame_500.png',
        height: 1080,
        width: 1920,
      },
      video19: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/haarlemmerplein/frames_preview-19/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/haarlemmerplein-19/frames/&img=frame_#FRAME#.png',
      },
      video20: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/hausderstatistik/hausderstatistik-1271_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hausderstatistik-1271/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
      measures: MEASURES,
      patternDuration: PATTERN_DURATION,
      previewScale: PROJECT_PREVIEW_SCALE,
      scene: this.scene,
      scene3d: this,
      stepDuration: STEP_DURATION,
      timeline: this.timeline,
      width: this.width,
      width3d: this.width3d,
    };

    // GROUP
    // const group = createTweenGroup(projectSettings);
    // group.setStaticPosition(getMatrix4({ x: this.width3d * -0.5, y: this.height3d * 0.5 }));

    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4(
      { x: this.toVP3d(0), y: this.toVP3d(-245, false), rx: 0.22 },
    ));
    const axesHelper = new THREE.AxesHelper(25);
    group.getGroup().add(axesHelper);

    this.createBackgroundActors(projectSettings, videos, group);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createBackgroundActors
   */
  async createBackgroundActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData | ImageData },
    group: THREE.Group,
  ) {
    // const to3d = this.to3d.bind(this);

    const actor = await createActor(projectSettings, videos.frame19, {
      box: { w: this.width3d, h: this.height3d, d: 0.02 },
      depth: 0.02,
      imageRect: { w: this.width, h: this.height },
    });
    actor.setStaticPosition(getMatrix4({
      x: -8, y: 6, z: 0,
    }));
    actor.setStaticImage(0, 0);
    actor.getMesh().castShadow = false;
    actor.getMesh().receiveShadow = false;
    group.add(actor.getMesh());
  }
}
