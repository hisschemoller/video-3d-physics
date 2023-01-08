import { THREE } from 'enable3d';
import { ProjectSettings, ImageData, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
// import { playSound } from '@app/audio';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 109;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 4;
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
    this.height = 1440;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 15;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 4 * 2;
    this.clearColor = 0x7ba8dd;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 0, 0);
    this.pCamera.position.set(0, 0, 12.88);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(6, 9, 6);
    this.directionalLight.color.setHSL(0, 1, 0.97);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.3;

    // AUDIO
    if (!this.scene.userData.isCapture) {
      // playSound('../assets/projects/rembrandtplein/rembrandtplein-16-maten-test.wav');
    }

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      frame1266: {
        imgSrc: '../assets/projects/hausderstatistik/Berlijn 2019 Haus der Statistik 1266.png',
        height: 480,
        width: 640,
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

    const group = createTweenGroup(projectSettings); // GROUP
    // group.setStaticPosition(getMatrix4({
    //   x: -8.20, y: 8.23, rx: 0.1623, sx: 1., sy: 1.03,
    // }));
    group.setStaticPosition(getMatrix4({ x: -8, y: 6 }));

    await this.createBackground(projectSettings, videos, group.getMesh());

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createBackground
   */
  async createBackground(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData | ImageData },
    group: THREE.Group,
  ): Promise<void> {
    const { height3d, width, width3d } = projectSettings;
    const SVG_SCALE = width3d / width;
    const to3d = this.to3d.bind(this);

    { // BACKGROUND EXAMPLE IMAGE
      const actor = await createActor(projectSettings, videos.frame1266, {
        box: { w: width3d, h: height3d, d: 0.02 },
        imageRect: { w: videos.frame1266.width, h: videos.frame1266.height },
        depth: 0.02,
      });
      actor.setStaticPosition(getMatrix4({}));
      actor.setStaticImage(0, 0);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }
}
