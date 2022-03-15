/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 98;
// const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
// const STEP_DURATION = PATTERN_DURATION / STEPS;

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
    this.clearColor = 0x6ea3df;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 1.92, 0);
    this.pCamera.position.set(0, 0, 8.4);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // this.ambientLight.intensity = 0.55;

    // this.directionalLight.position.set(12, 12, 12);
    // this.directionalLight.intensity = 1.2;
    // this.directionalLight.color.setHSL(0.1, 0.5, 0.95);

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // VIDEOS
    const videos = {
      left: {
        fps: 30,
        height: 700,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/placesaintsulpice/frames_1613_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/placesaintsulpice-1613/frames/&img=frame_#FRAME#.png',
      },
      right: {
        fps: 30,
        height: 730,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/placesaintsulpice/frames_1615_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/placesaintsulpice-1615/frames/&img=frame_#FRAME#.png',
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

    // GROUP
    const toVP3d = this.toVP3d.bind(this);
    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4({ x: toVP3d(0), y: toVP3d(-245, false), rx: 0.22 }));
    const axesHelper = new THREE.AxesHelper(25);
    group.getMesh().add(axesHelper);

    await this.createActors(projectSettings, videos, group.getMesh());

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createBackgroundActors
   */
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    const L_SCALE = 1.55;
    const R_SCALE = 1.55;

    { // ROOF LEFT
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: to3d(620), h: to3d(110), d: 0.02 },
        imageRect: { w: 620, h: 110 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(160), y: 0, z: -0.01, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 45,
        fromImagePosition: new THREE.Vector2(0, 0),
        toImagePosition: new THREE.Vector2(0, 0),
      });
      group.add(actor.getMesh());
    }

    { // BG LEFT
      const actor = await createActor(projectSettings, videos.left, {
        box: { w: to3d(400), h: to3d(700), d: 0.02 },
        imageRect: { w: 400, h: 700 },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(-80), z: 0, sx: L_SCALE, sy: L_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 45,
        fromImagePosition: new THREE.Vector2(340, 0),
        toImagePosition: new THREE.Vector2(340, 0),
      });
      group.add(actor.getMesh());
    }

    { // BG LEFT MID
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: to3d(255), h: to3d(690), d: 0.02 },
        imageRect: { w: 255, h: 690 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(500), y: to3d(-65), z: 0.01, sx: L_SCALE, sy: L_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(0, 40),
        toImagePosition: new THREE.Vector2(0, 40),
      });
      group.add(actor.getMesh());
    }

    { // BG RIGHT MID
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: to3d(416), h: to3d(730), d: 0.02 },
        imageRect: { w: 416, h: 730 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(830), y: 0, z: 0, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(458, 0),
        toImagePosition: new THREE.Vector2(458, 0),
      });
      group.add(actor.getMesh());
    }

    { // BG RIGHT
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: to3d(286), h: to3d(730), d: 0.02 },
        imageRect: { w: 286, h: 730 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1475), y: 0, z: 0, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(1288, 0),
        toImagePosition: new THREE.Vector2(1288, 0),
      });
      group.add(actor.getMesh());
    }
  }
}
