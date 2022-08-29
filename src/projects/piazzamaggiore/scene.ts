/* eslint-disable no-lone-blocks */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
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
    this.ambientLight.intensity = 1.1;

    // DIRECTIONAL LIGHT
    this.directionalLight.position.set(10, 7, 0);
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
      wallright: {
        height: 1080,
        imgSrc: '../assets/projects/piazzamaggiore/muur_rechts_gat.jpg',
        width: 240,
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
    await this.createWallRight(projectSettings, videos);
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
        videoStart: 0.3 + 0.05,
        fromImagePosition: new THREE.Vector2(0, 0),
      });
      actor.getMesh().castShadow = false;
      actor.getMesh().receiveShadow = false;
    }
  }

  async createWallRight(
    projectSettings: ProjectSettings,
    videos: { [key: string]: VideoData },
  ) {
    {
      const SVG_SCALE = this.width3d / this.width;
      const scale = 0.79;
      const actor = await createActor(projectSettings, videos.main, {
        imageRect: { w: 179, h: 1080 },
        svg: { depth: 0.003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/muur_rechts.svg' },
      });
      actor.setStaticPosition(getMatrix4({ x: 5.15, y: 3.53, z: 2, sx: scale, sy: scale }));
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        fromImagePosition: new THREE.Vector2(1741, 0),
        videoStart: 84.3,
      });
    }

    {
      const scale = 0.84;
      const actor = await createActor(projectSettings, videos.wallright, {
        imageRect: { w: 240, h: 1080 },
        box: { w: this.to3d(240), h: this.to3d(1080), d: 0.003 },
      });
      actor.setStaticPosition(getMatrix4({ x: 5.05, y: 3.78, z: 1.5, sx: scale, sy: scale }));
      actor.setStaticImage(0, 0);
      actor.addTween({
        delay: 0,
        duration: PATTERN_DURATION * 0.999,
        fromImagePosition: new THREE.Vector2(1920 - 240, 0),
      });
    }
  }

  async createMorandi() {
    // GROUND
    const planeGeometry = new THREE.PlaneGeometry(20, 4);
    planeGeometry.rotateX(Math.PI / -2);
    const ground = new THREE.Mesh(
      planeGeometry,
      new THREE.ShadowMaterial({ opacity: 0.4, transparent: true, side: THREE.FrontSide }),
      // new THREE.MeshPhongMaterial({ color: 0x999999 }),
    );
    ground.position.set(0, -3.8, -2);
    ground.receiveShadow = true;
    this.scene.add(ground);

    { // MORANDI TAFELPOOT
      const scale = 0.01;
      const y = 4.7 - 0.5;
      new SVGLoader().load('../assets/projects/piazzamaggiore/morandi.svg', async (data) => {
        const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/wood_strip.jpg');
        const points = data.paths[0].currentPath.getPoints(1);
        const geometry = new THREE.LatheGeometry(points);
        const material = new THREE.MeshPhongMaterial({ color: 0xd2d0cb, shininess: 1.2, map: texture });
        const lathe = new THREE.Mesh(geometry, material);
        lathe.rotation.z = Math.PI;
        lathe.scale.set(scale, scale, scale);
        lathe.position.set(-1.1, y, -2.1);
        lathe.castShadow = true;
        lathe.receiveShadow = true;
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
        this.timeline.add(createTween({
          delay: STEP_DURATION,
          duration: PATTERN_DURATION * 0.499,
          ease: 'sineInOut',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            lathe.position.setY(y + progress);
          },
        }));
        this.timeline.add(createTween({
          delay: STEP_DURATION + (PATTERN_DURATION * 0.5),
          duration: PATTERN_DURATION * 0.499,
          ease: 'sineInOut',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            lathe.position.setY(y + (1 - progress));
          },
        }));
      });
    }

    { // MORANDI 2
      const scale = 0.01;
      const y = 4.8;
      new SVGLoader().load('../assets/projects/piazzamaggiore/morandi2.svg', async (data) => {
        const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/stone_strip_brown.jpg');
        const points = data.paths[0].currentPath.getPoints(16);
        const material = new THREE.MeshPhongMaterial({ color: 0x978776, shininess: 1.2, map: texture, flatShading: false });
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

        const csgScale = 0.01 + 0.0028;
        const csg = CSG.subtract(lathe, box);
        csg.scale.set(csgScale, csgScale, csgScale);
        csg.position.set(-3.2, y, -2);
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
        this.timeline.add(createTween({
          delay: STEP_DURATION,
          duration: PATTERN_DURATION * 0.499,
          ease: 'sineInOut',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            csg.position.setY(y + ((1 - progress) * 0.4));
          },
        }));
        this.timeline.add(createTween({
          delay: STEP_DURATION + (PATTERN_DURATION * 0.5),
          duration: PATTERN_DURATION * 0.499,
          ease: 'sineInOut',
          onComplete: () => {},
          onStart: () => {},
          onUpdate: (progress: number) => {
            csg.position.setY(y + (progress * 0.4));
          },
        }));
      });
    }

    { // SPHERE
      const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/texture-grey.jpg');
      const geometry = new THREE.SphereBufferGeometry(0.7);
      const material = new THREE.MeshPhongMaterial({ color: 0xb6a385, shininess: 0.4, map: texture, flatShading: false });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(1.5, 4.1, -2.1);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      this.scene.add(sphere);
      this.timeline.add(createTween({
        delay: STEP_DURATION,
        duration: PATTERN_DURATION * 0.999,
        ease: 'linear',
        onComplete: () => {},
        onStart: () => {},
        onUpdate: (progress: number) => {
          sphere.rotation.y = progress * Math.PI * -4;
        },
      }));
    }

    { // SPHERE SMALL
      const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/texture-grey.jpg');
      const geometry = new THREE.SphereBufferGeometry(0.4);
      const material = new THREE.MeshPhongMaterial({ color: 0xb4b1aa, shininess: 0.4, map: texture, flatShading: false });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(-1.1, -3.1, -2.1);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      this.scene.add(sphere);
      this.timeline.add(createTween({
        delay: STEP_DURATION,
        duration: PATTERN_DURATION * 0.999,
        ease: 'linear',
        onComplete: () => {},
        onStart: () => {},
        onUpdate: (progress: number) => {
          sphere.rotation.y = progress * Math.PI * -4;
        },
      }));
    }
  }
}
