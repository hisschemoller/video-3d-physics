/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 107;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;

const S = STEP_DURATION;
const SCALE2 = 1.115;

const tweenData = {
  delay: 0,
  duration: PATTERN_DURATION,
  videoStart: 130.5,
  fromImagePosition: new THREE.Vector2(0, 0),
  toImagePosition: new THREE.Vector2(0, 0),
};

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
    this.fps = 25;
    this.captureFps = 25;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 2, 0);
    this.pCamera.position.set(0, 0, 8.3);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    const videos = {
      main: {
        fps: 25,
        height: this.height,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: this.width,
        imgSrcPath: isPreview
          ? '../assets/projects/prinshendrikkade/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/prinshendrikkade/frames/&img=frame_#FRAME#.png',
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

    const toVP3d = this.toVP3d.bind(this);
    const group = createTweenGroup(projectSettings); // GROUP
    group.setStaticPosition(getMatrix4({ x: toVP3d(-170), y: toVP3d(-265, false), rx: 0.23, sx: 1.1, sy: 1.1 }));

    await this.createBackgroundActors(projectSettings, videos, group.getMesh());
    await this.createBuildingActors(projectSettings, videos, group.getMesh());

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
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    { // BACKGROUND
      const actor = await createActor(projectSettings, {
        imgSrc: '../assets/projects/prinshendrikkade/prinshendrikkade_frame_00030_edited.png',
        height: 1080,
        width: 1920,
      }, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: 1.25, y: -0.05, z: 0, sx: 1.02 / SCALE2, sy: 1.02 / SCALE2 }));
      actor.setStaticImage(0, 0);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BG ENLARGED
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: -0.5, z: -0.001, sx: SCALE2, sy: SCALE2 }));
      actor.addTween(tweenData);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // ST NICOLAASKERK ROOF
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(500), h: to3d(400), d: 0.01 },
        imageRect: { w: 500, h: 400 },
      });
      actor.setStaticPosition(getMatrix4({ x: 0, y: -0.9, z: 0.008, sx: SCALE2, sy: SCALE2 }));
      actor.addTween(tweenData);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // GREENLIGHT PANCAKES ROOF
      const imagePos = new THREE.Vector2(1450, 0);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(360), h: to3d(400), d: 0.01 },
        imageRect: { w: 335, h: 380 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1565), y: -1.5, z: 0.008, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({ ...tweenData, fromImagePosition: imagePos, toImagePosition: imagePos });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // HIDE FOREGROUND PEOPLE
      const imagePos = new THREE.Vector2(757, 616);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(390), h: to3d(200), d: 0.01 },
        imageRect: { w: 390, h: 200 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(843), y: to3d(-746), z: 0.008, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({ ...tweenData, fromImagePosition: imagePos, toImagePosition: imagePos, videoStart: 124 });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }

  /**
   * createBuildingActors
   */
  async createBuildingActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    const ease = 'cubicInOut';

    const SVG_SCALE = this.width3d / this.width;

    { // LEFT BOTTOM BOTTOM
      const m1 = getMatrix4({ x: to3d(755), y: to3d(-438 - 120), z: 0.08, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(755 + 282), y: to3d(-438 - 120), z: 0.08, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(676, 449);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 324, h: 105 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-leftbottom-bottom.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m1, ...tween() });
      actor.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m1, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m1, ...tween() });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // LEFT BOTTOM TOP
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(110), z: -0.05 });
        const mm2 = getMatrix4({ x: to3d(0), y: to3d(5), z: -0.05 });
        const p2 = new THREE.Vector2(677, 342);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 324, h: 116 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-leftbottom-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    }

    { // LEFT TOP
      const m1 = getMatrix4({ x: to3d(744), y: to3d(-212), z: 0.1, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(744), y: to3d(-333), z: 0.1, sx: SCALE2, sy: SCALE2 });
      const m3 = getMatrix4({ x: to3d(744 + 278), y: to3d(-333 - 120), z: 0.1, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(665, 146);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 326, h: 205 },
        svg: { depth: 0.03, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-lefttop.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m1, ...tween(), ease });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // LEFT TOP RIGHT
        const mm1 = getMatrix4({ x: to3d(256 + 60), z: 0.05 });
        const mm2 = getMatrix4({ x: to3d(256), z: 0.05 });
        const p2 = new THREE.Vector2(927, 146);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 65, h: 204 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-lefttop-right.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    }

    { // MID BOTTOM
      const m1 = getMatrix4({ x: to3d(1160), y: to3d(-418), z: 0.2, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(1115), y: to3d(-418), z: 0.2, sx: SCALE2, sy: SCALE2 });
      const m3 = getMatrix4({ x: to3d(1235), y: to3d(-418), z: 0.2, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(1047, 325);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 116, h: 230 },
        svg: { depth: 0.03, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-mid-bottom.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m1, ...tween(), ease });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // MID TOP
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(179), z: 0.1 });
        const mm2 = getMatrix4({ x: to3d(0), y: to3d(179 - 105), z: 0.1 });
        const p2 = new THREE.Vector2(1047, 144);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 116, h: 187 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-mid-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm2, ...tween2() });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    }

    { // RIGHT BOTTOM
      const m1 = getMatrix4({ x: to3d(1275), y: to3d(-423), z: 0.15, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(1190), y: to3d(-423), z: 0.15, sx: SCALE2, sy: SCALE2 });
      const m3 = getMatrix4({ x: to3d(1275), y: to3d(-423), z: 0.15, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(1149, 329);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 128, h: 227 },
        svg: { depth: 0.03, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-right-bottom.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m1, ...tween(), ease });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // RIGHT TOP
        const mm1 = getMatrix4({ x: to3d(-4), y: to3d(184), z: 0.1 });
        const mm2 = getMatrix4({ x: to3d(-4), y: to3d(184 - 105), z: 0.1 });
        const p2 = new THREE.Vector2(1149, 146);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 138, h: 186 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-right-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm2, ...tween2() });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    }

    { // TOWER BOTTOM
      const m1 = getMatrix4({ x: to3d(1082), y: to3d(-415), z: 0.4, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(1082 + 120), y: to3d(-415), z: 0.5, sx: SCALE2, sy: SCALE2 });
      const m3 = getMatrix4({ x: to3d(1082 + 80), y: to3d(-415), z: 0.5, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(974, 325);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 85, h: 230 },
        svg: { depth: 0.04, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-tower-bottom.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m1, ...tween() });
      actor.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m1, ...tween(), ease });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // TOWER TOP
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(325), z: 0.2 });
        const mm2 = getMatrix4({ x: to3d(0), y: to3d(325 - 110), z: 0.1 });
        const p2 = new THREE.Vector2(975, 1);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 95, h: 328 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-tower-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm2, ...tween2() });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    }

    const addTower = async (x: number, isWallLeft = true) => {
      const m1 = getMatrix4({ x: to3d(1085 + x), y: to3d(-415), z: -0.2, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(1085 + 120), y: to3d(-415), z: 0.4, sx: SCALE2, sy: SCALE2 });
      const m3 = getMatrix4({ x: to3d(1085 + x), y: to3d(-415), z: 0.4, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(974, 325);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 85, h: 230 },
        svg: { depth: 0.04, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-tower-bottom.svg' },
      });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m1, ...tween(), ease });
      actor.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m3, ...tween(), ease });
      actor.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: m3, toMatrix4: m1, ...tween(), ease });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());

      { // TOWER TOP
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(325 - 250), z: 0.1 });
        const mm2 = getMatrix4({ x: to3d(0), y: to3d(325 - 110), z: 0.1 });
        const p2 = new THREE.Vector2(975, 1);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 95, h: 328 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-tower-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 4, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm2, ...tween2() });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }

      { // TOWER WALL BOTTOM
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(-20), z: -0.05 });
        const mm2 = getMatrix4({ x: to3d(isWallLeft ? -70 : 80), y: to3d(-20), z: -0.05 });
        const p2 = new THREE.Vector2(903, 342);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 88, h: 213 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-towerleft-bottom.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 8, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm1, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }

      { // TOWER WALL TOP
        const mm1 = getMatrix4({ x: to3d(0), y: to3d(75), z: 0.05 });
        const mm2 = getMatrix4({ x: to3d(isWallLeft ? -70 : 80), y: to3d(75), z: 0.05 });
        const mm3 = getMatrix4({ x: to3d(isWallLeft ? -70 : 80), y: to3d(175), z: 0.05 });
        const p2 = new THREE.Vector2(904, 146);
        const tween2 = () => ({ fromImagePosition: p2.clone(), toImagePosition: p2.clone() });
        const actor2 = await createActor(projectSettings, videos.main, {
          imageRect: { w: 88, h: 204 },
          svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-towerleft-top.svg' },
        });
        actor2.addTween({ delay: S * 0, duration: S * 8, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm1, ...tween2() });
        actor2.addTween({ delay: S * 8, duration: S * 4, videoStart: 130.5, fromMatrix4: mm1, toMatrix4: mm2, ...tween2(), ease });
        actor2.addTween({ delay: S * 12, duration: S * 4, videoStart: 130.5, fromMatrix4: mm2, toMatrix4: mm3, ...tween2(), ease });
        actor2.getMesh().castShadow = false;
        actor2.getMesh().receiveShadow = false;
        actor.getMesh().add(actor2.getMesh());
      }
    };

    addTower(-240, false);
    addTower(-80, false);
    addTower(225);
  }
}
