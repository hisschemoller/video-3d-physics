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
const STEPS = 16 * 2;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 2;
const STEP_DURATION = PATTERN_DURATION / STEPS;

const L_SCALE = 1.55;
const R_SCALE = 1.55;
const ease = 'sineInOut';

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

    await this.createFrontActors(projectSettings, videos, group.getMesh());
    await this.createSecondRowActors(projectSettings, videos, group.getMesh());

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createFrontActors
   */
  async createFrontActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);
    const SVG_SCALE = this.width3d / this.width;

    { // ROOF LEFT 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 506, h: 77 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/roof-left-1615.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(160), z: -0.001, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(0, 0),
        toImagePosition: new THREE.Vector2(0, 0),
      });
      group.add(actor.getMesh());
    }

    { // LEFT 1613
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 395, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/left-1613.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: to3d(-80), z: 0.001, sx: L_SCALE, sy: L_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 62,
        fromImagePosition: new THREE.Vector2(332, 0),
        toImagePosition: new THREE.Vector2(332, 0),
      });
      group.add(actor.getMesh());
    }

    { // CORNER RIGHT 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 298, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/corner-right-1615.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1475), z: 0, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 46.5,
        fromImagePosition: new THREE.Vector2(1275, 0),
        toImagePosition: new THREE.Vector2(1275, 0),
      });
      group.add(actor.getMesh());
    }

    { // FRON RIGHT MID 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 359, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/front-right-mid-1615.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(920), z: 0, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(513, 0),
        toImagePosition: new THREE.Vector2(513, 0),
      });
      group.add(actor.getMesh());
    }

    { // FRONT LEFT 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 406, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/front-left-1615.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(460), z: 0, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(0, 0),
        toImagePosition: new THREE.Vector2(0, 0),
      });
      group.add(actor.getMesh());
    }
  }

  /**
   * createSecondRowActors
   */
  async createSecondRowActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);
    const SVG_SCALE = this.width3d / this.width;

    { // PILLAR 4 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 343, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-4-1815.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1100), z: -0.5, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(617, 0),
        toImagePosition: new THREE.Vector2(617, 0),
      });
      group.add(actor.getMesh());
    }

    { // PILLAR 2 3 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 618, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-2-3-1815.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(250), z: -0.5, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(65, 0),
        toImagePosition: new THREE.Vector2(65, 0),
      });
      group.add(actor.getMesh());
    }

    { // PILLAR 8 9 1613
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 502, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-8-9-1813.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(720), y: to3d(-70), z: -1, sx: L_SCALE, sy: L_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(1418, 0),
        toImagePosition: new THREE.Vector2(1418, 0),
      });
      group.add(actor.getMesh());
    }

    { // PILLAR 5 6 1613
      const p = new THREE.Vector2(873, 0);
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 621, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-5-6-1813.svg' },
      });
      // actor.setStaticPosition(getMatrix4({ x: to3d(100), y: to3d(-70), z: -1.5, sx: L_SCALE, sy: L_SCALE }));
      actor.addTween({
        delay: 0,
        duration: STEP_DURATION * 16,
        videoStart: 50,
        fromImagePosition: p.clone(),
        toImagePosition: p.clone(),
        fromMatrix4: getMatrix4({ x: to3d(100), y: to3d(-70), z: -1.5, sx: L_SCALE, sy: L_SCALE }),
        toMatrix4: getMatrix4({ x: to3d(200), y: to3d(-70), z: -1.5, sx: L_SCALE, sy: L_SCALE }),
        ease,
      });
      actor.addTween({
        delay: STEP_DURATION * 16,
        duration: STEP_DURATION * 16,
        videoStart: 50,
        fromImagePosition: p.clone(),
        toImagePosition: p.clone(),
        fromMatrix4: getMatrix4({ x: to3d(200), y: to3d(-70), z: -1.5, sx: L_SCALE, sy: L_SCALE }),
        toMatrix4: getMatrix4({ x: to3d(100), y: to3d(-70), z: -1.5, sx: L_SCALE, sy: L_SCALE }),
        ease,
      });
      group.add(actor.getMesh());
    }
  }
}
