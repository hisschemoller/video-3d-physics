import { THREE } from 'enable3d';
import MainScene, { FPS }  from '@app/mainscene';
import { getMatrix } from '@app/utils';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { Actor, createActor } from './actor';

export const VIDEO_WIDTH = 2560;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
export const PLANE_WIDTH = 4;
export const PLANE_HEIGHT = 3;
const VIDEO_PREVIEW_SCALE = 0.2;
const BPM = 112;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

export default class Scene extends MainScene {
  pCamera: THREE.PerspectiveCamera;
  timeline: Timeline;

  constructor() {
    super();
  }

  async create() {
    this.captureLastFrame = Math.floor(PATTERN_DURATION * FPS);
    this.width = VIDEO_WIDTH;
    this.height = VIDEO_HEIGHT;

    const isPreview = true && !this.isCapture;
    const video = {
      scale: isPreview ? VIDEO_PREVIEW_SCALE : 1,
      height: isPreview ? VIDEO_HEIGHT * VIDEO_PREVIEW_SCALE : VIDEO_HEIGHT,
      width: isPreview ? VIDEO_WIDTH * VIDEO_PREVIEW_SCALE : VIDEO_WIDTH,
      imgSrcPrefix: isPreview
        ? '../assets/projects/hortusbrug/frames_preview/frame_'
        : '/Volumes/Samsung_X5/frames_hortusbrug/frames/frame_',
      imgSrcSuffix: '.png',
    };

    const { orbitControls } = await this.warpSpeed('orbitControls');

    const cameraTarget = new THREE.Vector3(0, 0, 0);

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    this.renderer.setClearColor(0xbbddff);

    // CAMERA
    this.pCamera = this.camera as THREE.PerspectiveCamera;
    this.pCamera.aspect = this.width / this.height;
    this.pCamera.position.set(0, 0, 3.21);
    this.pCamera.lookAt(cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // HEMI LIGHT
    const hemiLight = new THREE.HemisphereLight();
    hemiLight.color.setHSL(0.55, 0.1, 0.3);
    hemiLight.groundColor.setHSL(0.1, 0.1, 0.3);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // DIRECTIONAL LIGHT
    const SHADOW_SIZE = 10;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 17.5, 10);
    directionalLight.position.multiplyScalar(100);
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -SHADOW_SIZE;
    directionalLight.shadow.camera.right = SHADOW_SIZE;
    directionalLight.shadow.camera.top = SHADOW_SIZE;
    directionalLight.shadow.camera.bottom = -SHADOW_SIZE;
    directionalLight.shadow.camera.far = SHADOW_FAR;
    this.scene.add(directionalLight);
  
    // ORBIT CONTROLS
    if (orbitControls) {
      orbitControls.target = cameraTarget;
      orbitControls.update();
    }

    // AUDIO
    // const audio = document.createElement('audio');
    // audio.src = AUDIO_SRC;
    // audio.addEventListener('ended', () => {
    //   audio.currentTime = 0;
    //   audio.play();
    // }, false);
    // audio.load();
    // if (!this.isCapture) {
    //   // audio.play();
    // }

    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    actors.push(await createActor(this.scene, this.timeline, video, { // ACHTERGROND
      xPx: 0, yPx: 0, wPx: VIDEO_WIDTH, hPx: VIDEO_HEIGHT, vStart: 1,
      duration: PATTERN_DURATION,
    }));
    actors.push(await createActor(this.scene, this.timeline, video, { // FRONT
      xPx: 0, yPx: 0, wPx: VIDEO_WIDTH, hPx: VIDEO_HEIGHT, vStart: 25,
      duration: PATTERN_DURATION,
      svgPath: '../assets/projects/hortusbrug/front.svg',
    }));

    super.create();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.map((actor) => actor.loadImage());
    super.postRender();
  }
}
