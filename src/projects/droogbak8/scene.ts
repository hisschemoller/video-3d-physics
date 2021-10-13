import { THREE } from 'enable3d';
import MainScene, { FPS }  from '@app/mainscene';
import { getMatrix } from '@app/utils';
import createTimeline, { Timeline } from '@app/timeline';
import createTween from '@app/tween';

const AUDIO_SRC = '../assets/projects/droogbak8/digitakt1-loop.wav';
const IMG_NR_LAST = 3255;
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_FPS = 25;
const VIDEO_PREVIEW_SCALE = 0.2;
const PLANE_WIDTH = 16;
const PLANE_HEIGHT = 9;
const BPM = 112;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;
const actors: Actor[] = [];

interface Actor {
  loadImage: Function;
};

interface VideoData {
  scale: number;
  height: number;
  width: number;
  imgSrcPrefix: string;
  imgSrcSuffix: string;
};

export default class Scene extends MainScene {
  timeline: Timeline;

  constructor() {
    super();
  }

  async create() {
    this.captureLastFrame = Math.floor(PATTERN_DURATION * FPS);
    console.log('PATTERN_DURATION', PATTERN_DURATION);
    console.log('captureLastFrame', this.captureLastFrame);
    this.width = VIDEO_WIDTH;
    this.height = VIDEO_HEIGHT;

    const isPreview = true && !this.isCapture;
    const video = {
      scale: isPreview ? VIDEO_PREVIEW_SCALE : 1,
      height: isPreview ? VIDEO_HEIGHT * VIDEO_PREVIEW_SCALE : VIDEO_HEIGHT,
      width: isPreview ? VIDEO_WIDTH * VIDEO_PREVIEW_SCALE : VIDEO_WIDTH,
      imgSrcPrefix: `../assets/projects/droogbak8/frames${isPreview ? '_preview' : ''}/frame_`,
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
    this.camera.aspect = this.width / this.height;
    this.camera.position.set(0, 0, 9.6);
    this.camera.lookAt(cameraTarget);
    this.camera.updateProjectionMatrix();

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
    orbitControls.target = cameraTarget;
    orbitControls.update();

    // AUDIO
    const audio = document.createElement('audio');
    audio.src = AUDIO_SRC;
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    }, false);
    audio.load();
    if (!this.isCapture) {
      // audio.play();
    }
    
    // MESHES AND TWEENS
    this.timeline = createTimeline({
      duration: PATTERN_DURATION,
    });

    actors.push(createActor(this.scene, this.timeline, video, { // ACHTERGROND
      xPx: 0, yPx: 0, wPx: VIDEO_WIDTH, hPx: VIDEO_HEIGHT, vStart: 74,
      duration: PATTERN_DURATION,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // TREIN BEGIN
      xPx: 1433, yPx: 484, wPx: 384, hPx: 82, vStart: 82.5, xDist: -150, 
      duration: STEP_DURATION * 12, position: STEP_DURATION * 0,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // RODE AUTO LINKS
      xPx: 500, yPx: 700, wPx: 200, hPx: 330, vStart: 6.9, xDist: -500, 
      duration: STEP_DURATION * 4, position: STEP_DURATION * 0,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // GROEPJE VAN DRIE
      xPx: 860, yPx: 614, wPx: 210, hPx: 300, vStart: 35, xDist: 0, 
      duration: STEP_DURATION * 5, position: STEP_DURATION * 1,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // AUTO LINKS
      xPx: 580, yPx: 690, wPx: 380, hPx: 300, vStart: 15.1, xDist: (-580-380), 
      duration: STEP_DURATION * 5, position: STEP_DURATION * 4,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // MOTORFIETS
      xPx: 1150, yPx: 676, wPx: 300, hPx: 260, vStart: 71.6, xDist: -300, 
      duration: STEP_DURATION * 4, position: STEP_DURATION * 12,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // WIT BUSJE RECHTS
      xPx: 1545, yPx: 650, wPx: 320, hPx: 210, vStart: 80, xDist: 50, 
      duration: STEP_DURATION * 7, position: STEP_DURATION * 9,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // BUS VERDER WEG
      xPx: 1284, yPx: 624, wPx: 300, hPx: 174, vStart: 106, xDist: 0, 
      duration: STEP_DURATION * 11, position: STEP_DURATION * 5,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // MAN IN ROLSTOEL
      xPx: 910, yPx: 720, wPx: 380, hPx: 1080-720, vStart: 10, xDist: -400, 
      duration: STEP_DURATION * 6, position: STEP_DURATION * 6,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // BUS 22
      xPx: 1170, yPx: 380, wPx: 250, hPx: 1080-380, vStart: 118.5, xDist: -600, 
      duration: STEP_DURATION * 7, position: STEP_DURATION * 9,
    }));
    actors.push(createActor(this.scene, this.timeline, video, { // MAN WANDELEND
      xPx: 320, yPx: 634, wPx: 370, hPx: 1080-634, vStart: 45.8, xDist: -400, 
      duration: STEP_DURATION * 4, position: STEP_DURATION * 12,
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
};

function createActor(
  scene: THREE.scene,
  timeline: Timeline,
  video: VideoData,
  {
    xPx = 0,
    yPx = 0,
    wPx = 100,
    hPx = 100,
    xDist = 0,
    yDist = 0,
    vStart = 0,
    duration = 0,
    position = 0,
  }): Actor {
  const x3d = xPx * (PLANE_WIDTH / VIDEO_WIDTH);
  const y3d = yPx * (PLANE_HEIGHT / VIDEO_HEIGHT);
  const w3d = (wPx / VIDEO_WIDTH) * PLANE_WIDTH;
  const h3d = (hPx / VIDEO_HEIGHT) * PLANE_HEIGHT;
  const xOffset = x3d / PLANE_WIDTH;
  const yOffset = 1 - ((y3d + h3d) / PLANE_HEIGHT);
  const wRepeat = w3d / PLANE_WIDTH;
  const hRepeat = h3d / PLANE_HEIGHT;
  const xVP = x3d + (w3d / 2) - (PLANE_WIDTH / 2);
  const yVP = (y3d + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
  const IMG_NR_FIRST = vStart * VIDEO_FPS;
  const IMG_NR_LAST = (vStart + duration) * VIDEO_FPS;
  
  let imgNr = IMG_NR_FIRST;
  let tweenActive = false;
  let tweenProgress = 0;
  
  const canvasEl = document.createElement('canvas');
  canvasEl.width = video.width;
  canvasEl.height = video.height;

  const canvasCtx = canvasEl.getContext('2d');
  if (canvasCtx) {
    canvasCtx.fillStyle = '#6c645f';
    canvasCtx.fillRect(0, 0, video.width, video.height);
  }

  const img = new Image();
  img.onload = () => {
    if (canvasCtx) {
      canvasCtx.drawImage(img, 0, 0, video.width, video.height);
      texture.needsUpdate = true;
    }
  };
  const loadImage = (ignoreTweenActive = false) => {
    if (tweenActive || ignoreTweenActive) {
      imgNr = IMG_NR_FIRST + Math.round((IMG_NR_LAST - IMG_NR_FIRST) * tweenProgress);
      img.src = video.imgSrcPrefix
        + ((imgNr <= 99999) ? ('0000' + Math.round(imgNr)).slice(-5) : '99999')
        + video.imgSrcSuffix;
    }
  };
  loadImage(true);

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const geometry = new THREE.PlaneGeometry(w3d, h3d);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, }));
  scene.add(mesh);

  if (duration > 0) {
    const coords = {
      ...mesh.position.clone(),
      xOffset,
      yOffset,
    };
    const x3dEnd = (xPx + xDist) * (PLANE_WIDTH / VIDEO_WIDTH);
    const xVpEnd = x3dEnd + (w3d / 2) - (PLANE_WIDTH / 2);
    const y3dEnd = (yPx + yDist) * (PLANE_HEIGHT / VIDEO_HEIGHT);
    const yVpEnd = (y3dEnd + (h3d / 2) - (PLANE_HEIGHT / 2)) * -1;
    const xOffsetEnd = x3dEnd / PLANE_WIDTH;
    const yOffsetEnd = 1 - ((y3dEnd + h3d) / PLANE_HEIGHT);
    const tween = createTween({
      delay: position,
      duration,
      onStart: () => {
        mesh.visible = true;
        tweenActive = true;
      },
      onUpdate: (progress: number) => {
        tweenProgress = progress;
        mesh.position.set(
          coords.x + ((xVpEnd - coords.x) * progress),
          coords.y + ((yVpEnd - coords.y) * progress),
          coords.z,
        );
        mesh.material.map.offset = new THREE.Vector2(
          coords.xOffset + ((xOffsetEnd - coords.xOffset) * progress),
          coords.yOffset + ((yOffsetEnd - coords.yOffset) * progress),
        );
        if (mesh.body) {
          mesh.body.needUpdate = true;
        }
      },
      onComplete: () => {
        imgNr = IMG_NR_FIRST;
        tweenProgress = 0;
        loadImage();
        mesh.visible = false;
        tweenActive = false;
      },
    });
    timeline.add(tween);
  }

  return { loadImage };
}
