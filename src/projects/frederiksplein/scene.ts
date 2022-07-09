/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import { createActor, createTweenGroup } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 115;
const MEASURES = 1;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
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
    this.clearColor = 0x8abaf4;
  }

  async create() {
    await super.create();

    const isPreview = true && !this.scene.userData.isCapture;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    }); 

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

    // PROJECT SETTINGS
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
    group.setStaticPosition(getMatrix4({}));
    const axesHelper = new THREE.AxesHelper(25);
    group.getMesh().add(axesHelper);

    this.createShadowMaterialTest();
    await this.createActors(projectSettings, videos, group.getMesh());

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
  }

  createShadowMaterialTest() {
    const cylinder = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.2, 0.2, 2),
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    );
    cylinder.position.y = 1;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    this.scene.add(cylinder);

    const ground = new THREE.Mesh(
      new THREE.BoxBufferGeometry(10, 0.2, 10),
      new THREE.ShadowMaterial({ opacity: 0.5 }),
    );
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
}
