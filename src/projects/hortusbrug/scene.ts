import { THREE } from 'enable3d';
import MainScene, { FPS }  from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { Actor, createActor } from './actor';

export const PROJECT_WIDTH = 2560;
export const PROJECT_HEIGHT = 1920;
export const PROJECT_FPS = 30;
export const PLANE_WIDTH = 4;
export const PLANE_HEIGHT = 3;
const PROJECT_PREVIEW_SCALE = 0.2;
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
    this.width = PROJECT_WIDTH;
    this.height = PROJECT_HEIGHT;

    const isPreview = true && !this.isCapture;
    const video = {
      scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
      height: isPreview ? PROJECT_HEIGHT * PROJECT_PREVIEW_SCALE : PROJECT_HEIGHT,
      width: isPreview ? PROJECT_WIDTH * PROJECT_PREVIEW_SCALE : PROJECT_WIDTH,
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

    // AMBIENT
    const ambient = new THREE.AmbientLight(0xffffff, 0.35); // color = 0xffffff, intensity = 1
    this.scene.add(ambient);

    // HEMI LIGHT
    // const hemiLight = new THREE.HemisphereLight();
    // hemiLight.color.setHSL(0.55, 0.1, 0.3);
    // hemiLight.groundColor.setHSL(0.1, 0.1, 0.3);
    // hemiLight.position.set(0, 50, 0);
    // this.scene.add(hemiLight);

    // DIRECTIONAL LIGHT
    const SHADOW_MAP_SIZE = 1024;
    const SHADOW_SIZE = 2;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    directionalLight.position.set(10, 17.5, 10);
    directionalLight.position.multiplyScalar(100);
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
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
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, vStart: 1,
      duration: PATTERN_DURATION, z: 0,
    }));
    actors.push(await createActor(this.scene, this.timeline, video, { // SECOND
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, vStart: 25,
      duration: PATTERN_DURATION, z: 0.1,
      svgUrl: '../assets/projects/hortusbrug/second.svg', svgScale: 0.1, svgYPx: 310,
    }));
    actors.push(await createActor(this.scene, this.timeline, video, { // FIRST
      xPx: 0, yPx: 0, wPx: PROJECT_WIDTH, hPx: PROJECT_HEIGHT, vStart: 50,
      duration: PATTERN_DURATION, z: 0.2,
      svgUrl: '../assets/projects/hortusbrug/first.svg', svgScale: 0.1,
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
