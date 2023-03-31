import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';
// import { playSound } from '@app/audio';
import { createBridge } from './bridge';
import { createSky } from './background';
import { setupPhysics } from './physics';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 117;
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
    this.clearColor = 0x557799;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // DIRECTIONAL LIGHT
    this.directionalLight.color.setRGB(1, 1, 1);
    this.directionalLight.position.set(20, 10, 10);
    this.directionalLight.intensity = 0.8;

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.7;

    // AUDIO
    if (!this.scene.userData.isCapture) {
      // playSound('../assets/projects/kikkerbilsluis/kikkerbilsluis.wav');
    }

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // BLENDER GLTF
    const gltf = await this.load.gltf('../assets/projects/kikkerbilsluis/kikkerbilsluis.glb');

    // MEDIA
    const media = {
      frame1: {
        imgSrc: '../assets/projects/kikkerbilsluis/kikkerbilsluis-1_frame_01380.png',
        height: 1080,
        width: 1920,
      },
      frame2: {
        imgSrc: '../assets/projects/kikkerbilsluis/kikkerbilsluis-2_frame_00540.png',
        height: 1080,
        width: 1920,
      },
      frame3: {
        imgSrc: '../assets/projects/kikkerbilsluis/,kikkerbilsluis-3_frame_02820.png',
        height: 1080,
        width: 1920,
      },
      video1: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/kikkerbilsluis/frames_preview-1/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/kikkerbilsluis-1/frames/&img=frame_#FRAME#.png',
      },
      video2: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/kikkerbilsluis/frames_preview-2/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/kikkerbilsluis-2/frames/&img=frame_#FRAME#.png',
      },
      video3: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/kikkerbilsluis/frames_preview-3/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/kikkerbilsluis-3/frames/&img=frame_#FRAME#.png',
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

    await setupPhysics(projectSettings);
    await createSky(projectSettings, media);
    await createBridge(projectSettings, media, gltf);
    this.animateCamera();

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  animateCamera() {
    const group = new THREE.Group();
    group.add(this.pCamera);
    this.scene.add(group);

    const tween = createTween({
      delay: 1,
      duration: PATTERN_DURATION,
      onStart: () => {},
      onUpdate: (progress) => {
        group.rotation.x = 0.07 + Math.cos(progress * Math.PI * 4) * 0.02;
        group.position.z = -0.2 + Math.cos(progress * Math.PI * 2) * -0.4;
      },
      onComplete: () => {},
    });
    this.timeline.add(tween);
  }
}
