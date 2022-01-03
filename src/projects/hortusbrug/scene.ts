import { THREE } from 'enable3d';
import MainScene from '@app/mainscene';
import createTimeline, { Timeline } from '@app/timeline';
import { Actor, createActor } from './actor';

export const PROJECT_WIDTH = 2560;
export const PROJECT_HEIGHT = 1920;
export const VIEWPORT_3D_WIDTH = 4;
export const VIEWPORT_3D_HEIGHT = 3;
const PROJECT_PREVIEW_SCALE = 0.2;
const BPM = 112;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const PROJECT_SETTINGS = {
  vp3dWidth: VIEWPORT_3D_WIDTH,
  vp3dHeight: VIEWPORT_3D_HEIGHT,
  projectPxWidth: PROJECT_WIDTH,
  projectPxHeight: PROJECT_HEIGHT,
};

const actors: Actor[] = [];

export default class Scene extends MainScene {
  declare protected pCamera: THREE.PerspectiveCamera;

  timeline: Timeline;

  async create() {
    this.captureLastFrame = Math.floor(PATTERN_DURATION * this.fps);
    this.width = PROJECT_WIDTH;
    this.height = PROJECT_HEIGHT;

    const isPreview = true && !this.scene.userData.isCapture;
    const videoData = {
      fps: 30,
      scale: isPreview ? PROJECT_PREVIEW_SCALE : 1,
      height: isPreview ? PROJECT_HEIGHT * PROJECT_PREVIEW_SCALE : PROJECT_HEIGHT,
      width: isPreview ? PROJECT_WIDTH * PROJECT_PREVIEW_SCALE : PROJECT_WIDTH,
      imgSrcPrefix: isPreview
        ? '../assets/projects/hortusbrug/frames_preview/frame_'
        : 'fs-img?dir=/Volumes/Samsung_X5/frames_hortusbrug/frames/&img=frame_',
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

    actors.push(await createActor(this.scene, this.timeline, videoData, { // ACHTERGROND
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      z: 0,
      vStart: 1,
      duration: PATTERN_DURATION,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // SECOND
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      z: 0.1,
      vStart: 25,
      duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/hortusbrug/second.svg',
      svgScale: 0.1,
      svgYPx: 310,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // FIRST
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 0,
      wPx: PROJECT_WIDTH,
      hPx: PROJECT_HEIGHT,
      z: 0.2,
      vStart: 50,
      duration: PATTERN_DURATION,
      svgUrl: '../assets/projects/hortusbrug/first.svg',
      svgScale: 0.1,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // MAN FIETS
      ...PROJECT_SETTINGS,
      xPx: 0,
      yPx: 716,
      wPx: 1000,
      hPx: 1205,
      z: 0.25,
      vStart: 24.3,
      xDist: -1000,
      position: STEP_DURATION * 0,
      duration: STEP_DURATION * 8,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // VROUW FIETS
      ...PROJECT_SETTINGS,
      xPx: 1300,
      yPx: 716,
      wPx: 600,
      hPx: 1205,
      z: 0.25,
      vStart: 34.9,
      xDist: -1800,
      position: STEP_DURATION * 2,
      duration: STEP_DURATION * 8,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // TRAM NAAR RECHTS
      ...PROJECT_SETTINGS,
      xPx: 50,
      yPx: 960,
      wPx: 800,
      hPx: 900,
      z: 0.15,
      vStart: 36.6,
      xDist: 500,
      position: STEP_DURATION * 2,
      duration: STEP_DURATION * 10,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // TRAM NAAR LINKS
      ...PROJECT_SETTINGS,
      xPx: 450,
      yPx: 1000,
      wPx: 450,
      hPx: 900,
      z: 0.05,
      vStart: 173.1,
      xDist: -440,
      position: STEP_DURATION * 4,
      duration: STEP_DURATION * 8,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // PAAR WANDELEND
      ...PROJECT_SETTINGS,
      xPx: 2076,
      yPx: 1140,
      wPx: 520,
      hPx: 780,
      z: 0.3,
      vStart: 10.8,
      xDist: -250,
      position: STEP_DURATION * 8,
      duration: STEP_DURATION * 8,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // VROUW FIETS
      ...PROJECT_SETTINGS,
      xPx: 1448,
      yPx: 1294,
      wPx: 330,
      hPx: 620,
      z: 0.15,
      vStart: 346.7,
      xDist: 320,
      position: STEP_DURATION * 8,
      duration: STEP_DURATION * 8,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // OVERSTEKERS VER WEG
      ...PROJECT_SETTINGS,
      xPx: 1410,
      yPx: 1420,
      wPx: 130,
      hPx: 400,
      z: 0.03,
      vStart: 29.2,
      xDist: -40,
      position: STEP_DURATION * 10,
      duration: STEP_DURATION * 6,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // SCOOTER NAAR LINKS
      ...PROJECT_SETTINGS,
      xPx: 380,
      yPx: 1330,
      wPx: 260,
      hPx: 580,
      z: 0.05,
      vStart: 151,
      xDist: -300,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));
    actors.push(await createActor(this.scene, this.timeline, videoData, { // FIETS NAAR RECHTS
      ...PROJECT_SETTINGS,
      xPx: 550,
      yPx: 1240,
      wPx: 550,
      hPx: 670,
      z: 0.15,
      vStart: 5.9,
      xDist: 500,
      position: STEP_DURATION * 12,
      duration: STEP_DURATION * 4,
    }));

    super.create();
  }

  update(time: number, delta: number) {
    this.timeline.update(time, delta);
    super.update(time, delta);
  }

  postRender() {
    actors.forEach((actor) => actor.loadImage());
    super.postRender();
  }
}
