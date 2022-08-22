/* eslint-disable no-lone-blocks */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { Material } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { CSG } from 'three-csg-ts';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

const PROJECT_PREVIEW_SCALE = 0.25;
const BPM = 108;
const SECONDS_PER_BEAT = 60 / BPM;
const MEASURES = 8;
const BEATS_PER_MEASURE = 4;
const STEPS_PER_BEAT = 4;
const STEPS = STEPS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const PATTERN_DURATION = SECONDS_PER_BEAT * BEATS_PER_MEASURE * MEASURES;
const STEP_DURATION = PATTERN_DURATION / STEPS;

console.log('PATTERN_DURATION', PATTERN_DURATION);
console.log('STEP_DURATION', STEP_DURATION);

// const GROUND_ROTATION_X = Math.PI / -3;

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

    // CAMERA
    // this.cameraTarget.y = 2;
    // this.pCamera.position.y = 2;
    // this.pCamera.lookAt(this.cameraTarget);

    // ORBIT CONTROLS
    // this.orbitControls.target = this.cameraTarget;
    // this.orbitControls.update();
    // this.orbitControls.saveState();

    // AMBIENT LIGHT
    this.ambientLight.intensity = 0.7;

    // DIRECTIONAL LIGHT
    // this.directionalLight.position.set(-7, 10, 1.5);
    this.directionalLight.intensity = 0.8;

    // TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    // BLENDER GLTF
    // const gltf = await this.load.gltf('../assets/projects/frederiksplein/frederiksplein.glb');

    // VIDEOS
    const videos = {
      main: {
        fps: 30,
        height: 1080,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1920,
        imgSrcPath: isPreview
          ? '../assets/projects/piazzamaggiore/frames_preview/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/piazzamaggiore/frames/&img=frame_#FRAME#.png',
      },
      greenscreen: {
        fps: 30,
        height: 720,
        scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
        width: 1280,
        imgSrcPath: isPreview
          ? '../assets/projects/piazzamaggiore/frames_preview_greenscreen/frame_#FRAME#.png'
          : 'fs-img?dir=/Volumes/Samsung_X5/piazzamaggiore_greenscreen/frames/&img=frame_#FRAME#.png',
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

    await this.createBologna(projectSettings, videos);
    await this.createMorandi();

    this.postCreate();
  }

  async updateAsync(time: number, delta: number) {
    await this.timeline.update(time, delta);
    super.updateAsync(time, delta);
  }

  /**
   * createBologna
   */
  async createBologna(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
  ) {
    { // BACKGROUND
      const scale = 1.415;
      const actor = await createActor(projectSettings, videos.main, {
        box: { w: this.width3d, h: this.height3d, d: 0.02 },
        imageRect: { w: this.width, h: this.height },
      });
      actor.setStaticPosition(getMatrix4({ x: -11.3, y: 6.4, z: -4, sx: scale, sy: scale }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        videoStart: 84.3,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }

    { // GREENSCREEN
      const { width: videoWidth, height: videoHeight } = videos.greenscreen;
      // const scale = 1600 / 1280;
      const actor = await createActor(projectSettings, videos.greenscreen, {
        box: {
          w: (1600 / projectSettings.width) * this.width3d,
          h: (900 / projectSettings.height) * this.height3d,
          d: 0.02,
        },
        imageRect: { w: videoWidth, h: videoHeight },
      });
      actor.setStaticPosition(getMatrix4({ x: -8, y: 3, z: -0.01, sx: 1, sy: 1 }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        videoStart: 0.3 + 0.02,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }
  }

  async createMorandi() {
    { // MORANDI
      new SVGLoader().load('../assets/projects/piazzamaggiore/morandi.svg', async (data) => {
        const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/wood_strip.jpg');
        const scale = 0.009;
        const points = data.paths[0].currentPath.getPoints(1);
        const geometry = new THREE.LatheGeometry(points);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 1.2, map: texture }); // 0x442900
        const lathe = new THREE.Mesh(geometry, material);
        lathe.rotation.z = Math.PI;
        lathe.scale.set(scale, scale, scale);
        lathe.position.set(-1.1, 3.7, -2);
        this.scene.add(lathe);
        this.timeline.add(createTween({
          delay: STEP_DURATION,
          duration: PATTERN_DURATION * 0.999,
          ease: 'linear',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            lathe.rotation.y = progress * Math.PI * -4;
          },
        }));
      });
    }

    { // MORANDI 2
      new SVGLoader().load('../assets/projects/piazzamaggiore/morandi2.svg', async (data) => {
        const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/wood_strip3.jpg');
        const scale = 0.01;
        const points = data.paths[0].currentPath.getPoints(16);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 1.2, map: texture }); // 0x442900
        const geometry = new THREE.LatheGeometry(points);
        const lathe = new THREE.Mesh(geometry, material);
        lathe.rotation.z = Math.PI;
        lathe.scale.set(scale, scale, scale);
        lathe.updateMatrix();

        const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.set(-0.3, 0, 0);
        box.rotation.z = Math.PI * 0.25;
        box.updateMatrix();

        const csgScale = 0.01 + 0.0015;
        const csg = CSG.subtract(lathe, box);
        csg.scale.set(csgScale, csgScale, csgScale);
        console.log(csg.scale);
        csg.position.set(-2.7, 3.9, -2);
        csg.updateMatrix();
        this.scene.add(csg);
        this.timeline.add(createTween({
          delay: STEP_DURATION,
          duration: PATTERN_DURATION * 0.999,
          ease: 'linear',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            csg.rotation.y = progress * Math.PI * -4;
          },
        }));
      });
    }
  }
}
