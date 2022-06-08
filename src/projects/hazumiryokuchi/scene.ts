/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor, createTweenGroup } from './actor';
import { createSVG } from './actor-mesh';

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

    // // DIRECTIONAL LIGHT
    // this.directionalLight.position.set(10, 15, 10);
    // this.directionalLight.intensity = 0.98;

    // // AMBIENT LIGHT
    // this.ambientLight.intensity = 0.62;

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
    await this.createPhysics();

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
  async createPhysics() {
    if (this.physics.debug) {
      this.physics.debug.enable();
    }

    const DOUBLE_PI = Math.PI * 2;
    const SVG_WHEEL_SIZE = 1000;
    const DEPTH = 0.05;
    const radius = 2;
    const mass = 1;
    const x = 0;
    const y = -0.5;
    const z = 36;
    const textureUrl = '../assets/projects/spui/texture-rust4.jpg';
    const svgPath = '../assets/projects/hazumiryokuchi/wheel1.svg';
    const svgScale = (radius * 2) / SVG_WHEEL_SIZE;
    const svgMesh = await createSVG(
      svgPath,
      svgScale,
      undefined,
      DEPTH,
    );
    const geometry = svgMesh.geometry.clone();

    // the canvas should exactly cover the SVG extrude front
    const sizeVector = new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox?.getSize(sizeVector);
    const wRepeat = (1 / sizeVector.x) * svgScale;
    const hRepeat = (1 / sizeVector.y) * svgScale * -1;

    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.offset = new THREE.Vector2(0, 1);
    texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(-radius, radius, DEPTH * -0.5);
    const wheel = new ExtendedObject3D();
    wheel.add(mesh);
    wheel.position.set(x, y, z);
    wheel.rotation.x = Math.PI / 2;
    this.scene.add(wheel);
    this.physics.add.existing(wheel, {
      mass,
      shape: 'mesh',
    });
    wheel.body.setCollisionFlags(2); // make it kinematic

    // MOTOR HINGE TWEEN
    const tween = createTween({
      delay: 0,
      duration: PATTERN_DURATION * 0.999,
      onStart: () => {},
      onUpdate: (progress: number) => {
        wheel.rotation.z = progress * DOUBLE_PI;
        wheel.body.needUpdate = true;
      },
    });
    this.timeline.add(tween);
  }
}
