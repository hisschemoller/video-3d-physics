/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 103;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;

const tweenData = {
  delay: 0,
  duration: PATTERN_DURATION,
  videoStart: 0,
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
    this.height = 1484;
    this.width3d = 16;
    this.height3d = (this.height / this.width) * this.width3d;
    this.fps = 25;
    this.captureFps = 25;
    this.captureThrottle = 10;
    this.captureDuration = PATTERN_DURATION * 2;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, 0, 0);
    this.pCamera.position.set(0, 0, 13.3);
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
          ? '../assets/projects/robertmosesplaza/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/robertmosesplaza/frames/&img=frame_#FRAME#.png',
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
    group.setStaticPosition(getMatrix4({ x: toVP3d(0), y: toVP3d(0, false), rx: 0, sx: 1, sy: 1 }));

    await this.createBackgroundActors(projectSettings, videos, group.getMesh());

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
    const toVP3d = this.toVP3d.bind(this);

    const S = STEP_DURATION;
    const y = to3d(-860);

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ }));
      actor.addTween(tweenData);
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // RIGHT
      const imagePos = new THREE.Vector2(1426, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(480), h: to3d(320), d: 0.02 },
        imageRect: { w: 480, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(1426), y, z: 0.01 }));
      actor.addTween({ delay: S * 0, duration: S * 8, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 2 });
      actor.addTween({ delay: S * 8, duration: S * 8, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 2 });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MID RIGHT
      const imagePos = new THREE.Vector2(940, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(520), h: to3d(320), d: 0.02 },
        imageRect: { w: 520, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(940), y, z: 0.02 }));
      actor.addTween({ delay: S * 0, duration: S * 8, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 30 });
      actor.addTween({ delay: S * 8, duration: S * 8, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 30 });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MID LEFT
      const imagePos = new THREE.Vector2(330, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(630), h: to3d(320), d: 0.02 },
        imageRect: { w: 630, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(330), y, z: 0.01 }));
      actor.addTween({ delay: S * 0, duration: S * 16, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 18 });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // MID LEFT
      const imagePos = new THREE.Vector2(0, 860);
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(340), h: to3d(320), d: 0.02 },
        imageRect: { w: 340, h: 320 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(0), y, z: 0.02 }));
      actor.addTween({ delay: S * 0, duration: S * 16, fromImagePosition: imagePos.clone(), toImagePosition: imagePos.clone(), videoStart: 30 });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }
}
