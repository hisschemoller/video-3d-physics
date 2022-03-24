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
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * 3;
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

    // DIRECTIONAL LIGHT
    const SHADOW_SIZE = 8;
    this.directionalLight.position.set(20, 8, 10);
    this.directionalLight.shadow.camera.left = -SHADOW_SIZE;
    this.directionalLight.shadow.camera.right = SHADOW_SIZE;
    this.directionalLight.shadow.camera.top = SHADOW_SIZE;
    this.directionalLight.shadow.camera.bottom = -SHADOW_SIZE;
    this.directionalLight.target.position.set(0, 4, -4);
    this.scene.add(this.directionalLight.target);

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
    await this.createFurtherStageActors(projectSettings, videos, group.getMesh());
    await this.createSecondRowActors(projectSettings, videos, group.getMesh());
    await this.createThirdRowActors(projectSettings, videos, group.getMesh());

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
        videoStart: 52,
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
   * createFrontActors
   */
  async createFurtherStageActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const SVG_SCALE = this.width3d / this.width;
    const to3d = this.to3d.bind(this);

    { // ROOF
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: 14, h: 8, d: 0.01 },
        imageRect: { w: 1, h: 1 },
      });
      actor.setStaticPosition(getMatrix4({ x: 1, y: to3d(0), rx: Math.PI * 0.5 }));
      group.add(actor.getMesh());
    }

    { // WALL RIGHT
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: 9, h: 8, d: 0.01 },
        imageRect: { w: 1, h: 1 },
      });
      actor.setStaticPosition(getMatrix4({ x: 15, rx: Math.PI * 0.5, ry: Math.PI * -0.5 }));
      group.add(actor.getMesh());
    }

    { // BACK
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: 14, h: 9, d: 0.01 },
        imageRect: { w: 955, h: 614 },
      });
      actor.setStaticPosition(getMatrix4({ x: 1, z: -8 }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(74, 0),
        toImagePosition: new THREE.Vector2(74, 0),
      });
      group.add(actor.getMesh());
    }

    { // WALL LEFT
      const actor = await createActor(projectSettings, videos.right, {
        box: { w: 8, h: 9, d: 0.01 },
        imageRect: { w: 546, h: 614 },
      });
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(74, 0),
        toImagePosition: new THREE.Vector2(74, 0),
      });
      actor.setStaticPosition(getMatrix4({ x: 1, ry: Math.PI * 0.5 }));
      group.add(actor.getMesh());
    }

    { // CLOCK
      const actor = await createActor(projectSettings, {
        imgSrc: '../assets/projects/placesaintsulpice/klok.png',
        height: 387,
        width: 388,
      }, {
        imageRect: { w: 372, h: 373 },
        svg: { depth: 0.02, scale: SVG_SCALE * 0.3, url: '../assets/projects/placesaintsulpice/klok.svg' },
      });
      actor.setStaticImage(6, 8);
      actor.setStaticPosition(getMatrix4({ x: 7.9, y: -0.4, z: 0.01 }));
      group.add(actor.getMesh());
    }

    { // CLOCK HAND
      const actor = await createActor(projectSettings, {
        imgSrc: '../assets/projects/placesaintsulpice/klok-wijzer.png',
        height: 197,
        width: 27,
      }, {
        imageRect: { w: 23, h: 193 },
        svg: { depth: 0.02, scale: SVG_SCALE * 0.25, url: '../assets/projects/placesaintsulpice/klok-wijzer.svg' },
      });
      actor.setStaticImage(2, 1);
      // actor.setStaticPosition(getMatrix4({ x: 8, y: -0.5, z: 0.05 }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.5,
        videoStart: 50,
        fromMatrix4: getMatrix4({ x: 8.35, y: -0.85, z: 0.05, rz: 0 }),
        toMatrix4: getMatrix4({ x: 8.35, y: -0.85, z: 0.05, rz: Math.PI * -0.999 }),
        fromImagePosition: new THREE.Vector2(0, 0),
        toImagePosition: new THREE.Vector2(0, 0),
      });
      actor.addTween({
        delay: PATTERN_DURATION * 0.5,
        duration: PATTERN_DURATION * 0.5,
        videoStart: 50,
        fromMatrix4: getMatrix4({ x: 8.35, y: -0.85, z: 0.05, rz: Math.PI * 1 }),
        toMatrix4: getMatrix4({ x: 8.35, y: -0.85, z: 0.05, rz: Math.PI * 0.01 }),
        fromImagePosition: new THREE.Vector2(0, 0),
        toImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
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

    const addPillarTweens = (
      actor: Actor,
      videoStart: number,
      p: THREE.Vector2,
      x1: number,
      x2: number,
      y: number,
      z: number,
      scale: number,
      times: number[],
    ) => {
      actor.addTween({
        delay: STEP_DURATION * times[0],
        duration: STEP_DURATION * times[1],
        videoStart,
        fromImagePosition: p.clone(),
        toImagePosition: p.clone(),
        fromMatrix4: getMatrix4({ x: to3d(x1), y: to3d(y), z, sx: scale, sy: scale }),
        toMatrix4: getMatrix4({ x: to3d(x2), y: to3d(y), z, sx: scale, sy: scale }),
        ease,
      });
      actor.addTween({
        delay: STEP_DURATION * (times[0] + times[1]),
        duration: STEP_DURATION * times[2],
        videoStart: videoStart + STEP_DURATION * times[1],
        fromImagePosition: p.clone(),
        toImagePosition: p.clone(),
        fromMatrix4: getMatrix4({ x: to3d(x2), y: to3d(y), z, sx: scale, sy: scale }),
        toMatrix4: getMatrix4({ x: to3d(x1), y: to3d(y), z, sx: scale, sy: scale }),
        ease,
      });
    };

    { // PILLAR 4 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 343, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-4-1815.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1100), z: -1, sx: R_SCALE, sy: R_SCALE }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION,
        videoStart: 50,
        fromImagePosition: new THREE.Vector2(617, 0),
        toImagePosition: new THREE.Vector2(617, 0),
      });
      // addPillarTweens(
      //   actor,
      //   50,
      //   new THREE.Vector2(617, 0),
      //   1100,
      //   1100 - 40,
      //   0,
      //   -1,
      //   R_SCALE,
      //   [15, 22, 22],
      // );
      group.add(actor.getMesh());
    }

    { // PILLAR 2 3 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 618, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-2-3-1815.svg' },
      });
      addPillarTweens(
        actor,
        50,
        new THREE.Vector2(65, 0),
        250,
        250 + 50,
        0,
        -1,
        R_SCALE,
        [4, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 8 9 1613
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 502, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-8-9-1813.svg' },
      });
      addPillarTweens(
        actor,
        50,
        new THREE.Vector2(1418, 0),
        720,
        720 + 70,
        -80,
        -2,
        L_SCALE,
        [14, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 5 6 1613
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 621, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-5-6-1813.svg' },
      });
      addPillarTweens(
        actor,
        50,
        new THREE.Vector2(873, 0),
        100,
        100 + 100,
        -80,
        -3,
        L_SCALE,
        [0, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 6 7 1613
      const actor = await createActor(projectSettings, videos.left, {
        imageRect: { w: 721, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-6-7-1813.svg' },
      });
      addPillarTweens(
        actor,
        50,
        new THREE.Vector2(1108, 0),
        300,
        300 + 150,
        -90,
        -3.6,
        L_SCALE,
        [8, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 2 3 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 618, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-2-3-1815.svg' },
      });
      addPillarTweens(
        actor,
        30,
        new THREE.Vector2(65, 0),
        1050,
        1050 + 150,
        -20,
        -3.8,
        R_SCALE,
        [17, 20, 20],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 5 6 1615
      const actor = await createActor(projectSettings, videos.right, {
        imageRect: { w: 375, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-5-6-1815.svg' },
      });
      addPillarTweens(
        actor,
        40,
        new THREE.Vector2(697, 0),
        800,
        800 + 100,
        -30,
        -4.2,
        R_SCALE,
        [12, 16, 16],
      );
      group.add(actor.getMesh());
    }
  }

  /**
   * createSecondRowActors
   */
  async createThirdRowActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);
    const SVG_SCALE = this.width3d / this.width;

    const addPillarTweens = (
      actor: Actor,
      videoStart: number,
      p: THREE.Vector2,
      x1: number,
      x2: number,
      y: number,
      z: number,
      scale: number,
      times: number[],
    ) => {
      actor.setStaticImage(p.x, p.y);
      actor.addTween({
        delay: STEP_DURATION * times[0],
        duration: STEP_DURATION * times[1],
        videoStart,
        fromMatrix4: getMatrix4({ x: to3d(x1), y: to3d(y), z, sx: scale, sy: scale }),
        toMatrix4: getMatrix4({ x: to3d(x2), y: to3d(y), z, sx: scale, sy: scale }),
        ease,
      });
      actor.addTween({
        delay: STEP_DURATION * (times[0] + times[1]),
        duration: STEP_DURATION * times[2],
        videoStart: videoStart + STEP_DURATION * times[1],
        fromMatrix4: getMatrix4({ x: to3d(x2), y: to3d(y), z, sx: scale, sy: scale }),
        toMatrix4: getMatrix4({ x: to3d(x1), y: to3d(y), z, sx: scale, sy: scale }),
        ease,
      });
    };

    { // PILLAR 8 9 1613
      const actor = await createActor(projectSettings, {
        height: 700,
        width: 1920,
        imgSrc: '../assets/projects/placesaintsulpice/placestsulpice-1613-d_frame_299.png',
      }, {
        imageRect: { w: 502, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-8-9-1813.svg' },
      });
      addPillarTweens(
        actor,
        50,
        new THREE.Vector2(1418, 0),
        500,
        500 + 120,
        -120,
        -5,
        L_SCALE,
        [20, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 5 6 1613
      const actor = await createActor(projectSettings, {
        height: 700,
        width: 1920,
        imgSrc: '../assets/projects/placesaintsulpice/placestsulpice-1613-d_frame_299.png',
      }, {
        imageRect: { w: 621, h: 700 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-5-6-1813.svg' },
      });
      addPillarTweens(
        actor,
        55,
        new THREE.Vector2(873, 0),
        1300,
        1300 - 120,
        -120,
        -5.6,
        L_SCALE,
        [16, 24, 24],
      );
      group.add(actor.getMesh());
    }

    { // PILLAR 5 6 1613
      const actor = await createActor(projectSettings, {
        height: 730,
        width: 1920,
        imgSrc: '../assets/projects/placesaintsulpice/placestsulpice-1615-d_frame_299.png',
      }, {
        imageRect: { w: 618, h: 730 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/placesaintsulpice/pillar-2-3-1815.svg' },
      });
      addPillarTweens(
        actor,
        45,
        new THREE.Vector2(66, 0),
        0,
        0 - 120,
        -30,
        -6,
        R_SCALE,
        [5, 22, 22],
      );
      group.add(actor.getMesh());
    }
  }
}
