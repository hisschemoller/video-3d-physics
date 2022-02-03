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
    // group.setStaticPosition(getMatrix4({ x: toVP3d(0), y: toVP3d(-255, false), rx: 0.23 }));
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

    const SVG_SCALE = this.width3d / this.width;

    { // LEFT BOTTOM
      const p = new THREE.Vector2(676, 342);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 314, h: 214 },
        svg: { depth: 0.02, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-leftbottom.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(755), y: to3d(-436), z: 0.1, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({ ...tweenData, fromImagePosition: p, toImagePosition: p });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // LEFT TOP
      const p = new THREE.Vector2(665, 146);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 326, h: 212 },
        svg: { depth: 0.03, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-lefttop.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(744), y: to3d(-212), z: 0.1, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({ ...tweenData, fromImagePosition: p, toImagePosition: p });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MIDDLE
      const p = new THREE.Vector2(974, 1);
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 189, h: 554 },
        svg: { depth: 0.04, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-middle.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1090), y: to3d(-57), z: 0.1, sx: SCALE2, sy: SCALE2 }));
      actor.addTween({ ...tweenData, fromImagePosition: p, toImagePosition: p });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // RIGHT
      const m1 = getMatrix4({ x: to3d(1275), y: to3d(-220), z: 0.1, sx: SCALE2, sy: SCALE2 });
      const m2 = getMatrix4({ x: to3d(1190), y: to3d(-220), z: 0.1, sx: SCALE2, sy: SCALE2 });
      const p = new THREE.Vector2(1149, 147);
      const tween = () => ({ fromImagePosition: p.clone(), toImagePosition: p.clone() });
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 138, h: 409 },
        svg: { depth: 0.03, scale: SVG_SCALE, url: '../assets/projects/prinshendrikkade/building-right.svg' },
      });
      // actor.setStaticPosition(getMatrix4({ x: to3d(1275), y: to3d(-220), z: 0.1, sx: SCALE2, sy: SCALE2 }));
      // actor.addTween({ ...tweenData, fromImagePosition: p, toImagePosition: p });
      actor.addTween({ delay: S * 0, duration: S * 4, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m1, ...tween(), ease: 'sineInOut' });
      actor.addTween({ delay: S * 4, duration: S * 1, videoStart: 130.5, fromMatrix4: m1, toMatrix4: m2, ...tween(), ease: 'sineInOut' });
      actor.addTween({ delay: S * 5, duration: S * 9, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m2, ...tween(), ease: 'sineInOut' });
      actor.addTween({ delay: S * 14, duration: S * 1.9, videoStart: 130.5, fromMatrix4: m2, toMatrix4: m1, ...tween(), ease: 'sineInOut' });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }
}
