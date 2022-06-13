/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';
import createWheel, { addNewspaper } from './wheel';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 117;
const MEASURES = 7;
const STEPS = 16 * MEASURES;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

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
    this.clearColor = 0x9ed3ff;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // CAMERA & ORBIT_CONTROLS
    this.cameraTarget.set(0, -2.9 * 4, 0);
    this.pCamera.position.set(0, 0, 10.5 * 4);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(10, 15, 10);
    this.directionalLight.intensity = 0.98;

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.35;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // BLENDER GLTF
    const gltf = await this.load.gltf('../assets/projects/hazumiryokuchi/hazumiryokuchi.glb');

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/hazumiryokuchi/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/hazumiryokuchi/frames/&img=frame_#FRAME#.png',
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
    const group = createTweenGroup(projectSettings);
    group.setStaticPosition(getMatrix4({
      x: -32,
      y: 7.1,
      rx: -0.11,
      sx: 4,
      sy: 4,
    }));
    const axesHelper = new THREE.AxesHelper(25);
    group.getMesh().add(axesHelper);

    await this.createActors(projectSettings, videos, group.getMesh());
    await this.createPhysics(gltf);

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createActors
   */
  async createActors(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
    group: THREE.Group,
  ) {
    const to3d = this.to3d.bind(this);

    { // BACKGROUND
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.01 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        videoStart: 5.633333333333334,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }

    { // BACKGROUND 2
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: to3d(436), h: to3d(164), d: 0.01 },
        imageRect: { w: 436, h: 164 },
      });
      actor.setStaticPosition(getMatrix4({ x: to3d(730), y: to3d(-350), z: 0.01 }));
      actor.addTween({
        delay: STEP_DURATION * 16 * 4,
        duration: PATTERN_DURATION * 0.999,
        videoExtraTime: 1.6,
        videoStart: 4,
        fromImagePosition: new THREE.Vector2(730, 350),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
      group.add(actor.getMesh());
    }
  }

  /**
   * createPhysics
   */
  async createPhysics(gltf: GLTF) {
    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    const wheel1 = await createWheel(this, this.timeline, PATTERN_DURATION, 19);
    addNewspaper({
      scene3d: this,
      timeline: this.timeline,
      wheel: wheel1,
      cylinderHeight: 3,
      distanceFromCenter: 3.5,
      rotation: Math.PI * -0.5,
      patternDuration: PATTERN_DURATION,
    });

    const wheel2 = await createWheel(this, this.timeline, PATTERN_DURATION, 30);
    addNewspaper({
      scene3d: this,
      timeline: this.timeline,
      wheel: wheel2,
      distanceFromCenter: 3.5,
      rotation: Math.PI * 0.5,
      patternDuration: PATTERN_DURATION,
      paperObject: gltf.scene.getObjectByName('paper1') as THREE.Mesh,
      paperImagePath: '../assets/projects/hazumiryokuchi/krant1.jpg',
    });
  }
}
