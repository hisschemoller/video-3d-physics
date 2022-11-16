import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 110;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 2;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

const SCALE_0008 = 1.00;
const SCALE_0010 = 1.00;

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
    this.captureDuration = PATTERN_DURATION * 2;
    this.clearColor = 0x7ba8dd;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 1.6, 0);
    this.pCamera.position.set(0, 0, 12);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(6, 9, 6);
    // this.directionalLight.intensity = 0.98;
    this.directionalLight.color.setHSL(0, 1, 0.95);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.40;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      main_0008: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/rembrandtplein/frames_preview_0008/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/rembrandtplein-0008/frames/&img=frame_#FRAME#.png',
      },
      main_0010: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/rembrandtplein/frames_preview_0010/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/rembrandtplein-0010/frames/&img=frame_#FRAME#.png',
      },
    };

    // PROJECT SETTINGS
    const projectSettings: ProjectSettings = {
      height: this.height,
      height3d: this.height3d,
      isPreview,
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
    group.setStaticPosition(getMatrix4({
      x: -8.05, y: 7.67, rx: 0.13, sx: 1.005, sy: 1.005,
    }));
    const axesHelper = new THREE.AxesHelper(25);
    group.getMesh().add(axesHelper);
    const gridHelper = new THREE.GridHelper(20, 20, 0x0000ff, 0xff0000);
    gridHelper.position.set(0, 0, 0);
    group.getMesh().add(gridHelper);

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
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ): Promise<void> {
    const SVG_SCALE = this.width3d / this.width;
    const to3d = this.to3d.bind(this);

    { // BACKGROUND EXAMPLE IMAGE
      const actor = await createActor(projectSettings, {
        imgSrc: '../assets/projects/rembrandtplein/rembrandtplein-collage.jpg',
        height: this.height,
        width: this.width,
      }, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
        depth: 0.02,
      });
      actor.setStaticPosition(getMatrix4({}));
      actor.setStaticImage(0, 0);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND LEFT
      const scale = 438 / 602; // 0.74;
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 602 * scale, h: 1057 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-left.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(-74), z: 0.1 }));
      actor.addTween({
        delay: 0.01,
        duration: PATTERN_DURATION,
        videoStart: 30,
        fromImagePosition: new THREE.Vector2(960 + 21, 0 - 6),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND LEFT MID
      const scale = 0.91;
      const actor = await createActor(projectSettings, videos.main_0008, {
        imageRect: { w: 911 * scale, h: 1133 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-leftmid.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(602), y: to3d(-34), z: 0.05 }));
      actor.addTween({
        delay: 0.01,
        duration: PATTERN_DURATION,
        videoStart: 30,
        fromImagePosition: new THREE.Vector2(602 - 100, 34 - 18),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND RIGHT MID
      const scale = 0.67;
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 313 * scale, h: 1125 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-rightmid.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1196), y: to3d(-74), z: 0.1 }));
      actor.addTween({
        delay: 0.01,
        duration: PATTERN_DURATION,
        videoStart: 10,
        fromImagePosition: new THREE.Vector2(1667, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }
}
