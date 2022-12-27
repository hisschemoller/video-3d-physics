import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { playSound } from '@app/audio';
import { createActor, createTweenGroup } from './actor';
import createSequence, { createSequence2 } from './sequence';
import createPlanes from './planes';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 112;
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

  timeline2: Timeline;

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
    this.captureDuration = PATTERN_DURATION * 4;
    this.clearColor = 0x7ba8dd;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 2, 0);
    this.pCamera.position.set(0, 0, 12);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(6, 9, 6);
    // this.directionalLight.intensity = 0.98;
    this.directionalLight.color.setHSL(0, 1, 0.98);

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.55; // 0.40;

    // AUDIO
    playSound('../assets/projects/rembrandtplein/rembrandtplein-16-maten-test.wav');

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });
    this.timeline2 = createTimeline({
      duration: PATTERN_DURATION * 4,
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
    const projectSettings2 = { ...projectSettings, timeline: this.timeline2 };

    const group = createTweenGroup(projectSettings); // GROUP
    group.setStaticPosition(getMatrix4({
      x: -8.20, y: 8.23, rx: 0.1623, sx: 1.03, sy: 1.03,
    }));

    // await this.createBackground(projectSettings, videos, group.getMesh());
    await this.createSimpleBackground(projectSettings, group.getMesh());
    createPlanes(projectSettings2, group.getMesh(), this.to3d.bind(this));
    createSequence(projectSettings, group.getMesh(), this.to3d.bind(this));
    createSequence2(projectSettings2, group.getMesh(), this.to3d.bind(this));

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    await this.timeline2.update(time, delta);
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
    const { width, width3d } = projectSettings;
    const SVG_SCALE = width3d / width;
    const to3d = this.to3d.bind(this);

    { // BACKGROUND LEFT
      const scale = 438 / 616; // 0.74;
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 604 * scale, h: 1120 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-left.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(-74), z: 0.1 }));
      actor.addTween({
        delay: 0.01,
        duration: PATTERN_DURATION,
        videoStart: 30,
        fromImagePosition: new THREE.Vector2(960 + 26, 0),
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
        delay: STEP_DURATION * 6,
        duration: PATTERN_DURATION,
        videoStart: 22, // 25,
        fromImagePosition: new THREE.Vector2(602 - 100, 34 - 18),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND RIGHT MID
      const scale = 0.67;
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 353 * scale, h: 1125 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-rightmid.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1196), y: to3d(-74), z: 0.15 }));
      actor.addTween({
        delay: STEP_DURATION * 24,
        duration: PATTERN_DURATION,
        videoStart: 10,
        fromImagePosition: new THREE.Vector2(1667, 34),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND RIGHT
      const scale = 0.91;
      const actor = await createActor(projectSettings, videos.main_0008, {
        imageRect: { w: 436 * scale, h: 1199 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-right.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1483), y: 0, z: 0.2 }));
      actor.addTween({
        delay: STEP_DURATION * 12,
        duration: PATTERN_DURATION,
        videoStart: 67, // 46,
        fromImagePosition: new THREE.Vector2(1146, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND TREE
      const scale = 0.7;
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 488 * scale, h: 460 * scale },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/bg-tree.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(900), y: 0, z: 0.1 }));
      actor.addTween({
        delay: STEP_DURATION * 18,
        duration: PATTERN_DURATION,
        videoStart: 18,
        fromImagePosition: new THREE.Vector2(1511 - 10, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // GRAS
      const actor = await createActor(projectSettings, videos.main_0010, {
        imageRect: { w: 1920, h: 476 },
        svg: { scale: SVG_SCALE, url: '../assets/projects/rembrandtplein/gras.svg' },
        depth: 0.005,
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: -to3d(1440 - 476), z: 0.25 }));
      actor.addTween({
        delay: STEP_DURATION * 27,
        duration: PATTERN_DURATION,
        videoStart: 10,
        fromImagePosition: new THREE.Vector2(0, 604),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // SHADOW GROUND
      const planeGeometry = new THREE.PlaneGeometry(width3d, 6);
      planeGeometry.rotateX(Math.PI / -2);
      const ground = new THREE.Mesh(
        planeGeometry,
        new THREE.ShadowMaterial({ opacity: 0.4, transparent: true, side: THREE.FrontSide }),
        // new THREE.MeshPhongMaterial({ color: 0x999999 }),
      );
      ground.position.set(8, -9.2, 3);
      ground.receiveShadow = true;
      group.add(ground);
    }
  }

  /**
   * createSimpleBackground
   */
  async createSimpleBackground(
    projectSettings: ProjectSettings,
    group: THREE.Group,
  ): Promise<void> {
    const { width3d } = projectSettings;

    { // BACKGROUND EXAMPLE IMAGE
      const actor = await createActor(projectSettings, {
        imgSrc: '../assets/projects/rembrandtplein/frame_00005_rendered_2022-11-18.png',
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

    { // SHADOW GROUND
      const planeGeometry = new THREE.PlaneGeometry(width3d, 6);
      planeGeometry.rotateX(Math.PI / -2);
      const ground = new THREE.Mesh(
        planeGeometry,
        new THREE.ShadowMaterial({ opacity: 0.4, transparent: true, side: THREE.FrontSide }),
        // new THREE.MeshPhongMaterial({ color: 0x999999 }),
      );
      ground.position.set(8, -9.2, 3);
      ground.receiveShadow = true;
      group.add(ground);
    }
  }
}
