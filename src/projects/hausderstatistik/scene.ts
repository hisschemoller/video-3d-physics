import { ProjectSettings } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { playSound } from '@app/audio';
import { createTweenGroup } from './actor';
import createBackgrounds from './background';
import {
  createRotatingGroup1, createRotatingGroup2, createRotatingGroup3, createRotatingGroup4,
} from './rotatingGroup';

const PROJECT_PREVIEW_SCALE = 0.5;
const BPM = 105;
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
    this.height = 1440;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 30;
    this.captureFps = 30;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0xa69288;
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
    this.directionalLight.color.setRGB(1, 1, 1);
    this.directionalLight.position.set(0.5, 9, 6 + 9.5);
    this.directionalLight.intensity = 1.4;
    this.directionalLight.target.position.set(0, 0, 9.5);
    this.scene.add(this.directionalLight.target);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.23;

    // AUDIO
    if (!this.scene.userData.isCapture) {
      playSound('../assets/projects/hausderstatistik/hausderstatistik.wav');
    }

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      frame1267: {
        imgSrc: '../assets/projects/hausderstatistik/Berlijn 2019 Haus der Statistik 1267.png',
        height: 480,
        width: 640,
      },
      frame1268: {
        imgSrc: '../assets/projects/hausderstatistik/Berlijn 2019 Haus der Statistik 1268.png',
        height: 480,
        width: 640,
      },
      frame1271: {
        imgSrc: '../assets/projects/hausderstatistik/Berlijn 2019 Haus der Statistik 1271.png',
        height: 480,
        width: 640,
      },
      frame1273: {
        imgSrc: '../assets/projects/hausderstatistik/Berlijn 2019 Haus der Statistik 1273.png',
        height: 480,
        width: 640,
      },
      video1267: {
        fps: 30,
        height: 480,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 640,
        imgSrcPath: isPreview
          ? '../assets/projects/hausderstatistik/hausderstatistik-1267_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hausderstatistik-1267/frames/&img=frame_#FRAME#.png',
      },
      video1268: {
        fps: 30,
        height: 480,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 640,
        imgSrcPath: isPreview
          ? '../assets/projects/hausderstatistik/hausderstatistik-1268_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hausderstatistik-1268/frames/&img=frame_#FRAME#.png',
      },
      video1271: {
        fps: 30,
        height: 480,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 640,
        imgSrcPath: isPreview
          ? '../assets/projects/hausderstatistik/hausderstatistik-1271_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hausderstatistik-1271/frames/&img=frame_#FRAME#.png',
      },
      video1273: {
        fps: 30,
        height: 480,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 640,
        imgSrcPath: isPreview
          ? '../assets/projects/hausderstatistik/hausderstatistik-1273_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hausderstatistik-1273/frames/&img=frame_#FRAME#.png',
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
    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4({ x: this.width3d * -0.5, y: this.height3d * 0.5 }));

    await createBackgrounds(projectSettings, videos, group.getGroup(), this.to3d.bind(this));
    await createRotatingGroup1(projectSettings, group.getGroup());
    await createRotatingGroup2(projectSettings, group.getGroup());
    await createRotatingGroup3(projectSettings, group.getGroup());
    await createRotatingGroup4(projectSettings, group.getGroup());

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }
}
