import { THREE } from 'enable3d';
import gsap from 'gsap';
import MainScene, { FPS }  from '@app/mainscene';
import { getMatrix } from '@app/utils';

const VIDEO_FULL_SRC = '../assets/projects/droogbak8/droogbak8.mov';
const RAF_PER_SECOND = 60;
const FRAMES_PER_RAF = RAF_PER_SECOND / FPS;
const AUDIO_SRC = '../assets/projects/droogbak8/digitakt1.wav';
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_FPS = 50;
const IMG_NR_LAST = 6509;
const PLANE_WIDTH = 16;
const PLANE_HEIGHT = 9;
const BPM = 113;
const STEPS = 16;
const STEPS_PER_BEAT = 4;
const SECONDS_PER_BEAT = 60 / BPM;
const PATTERN_DURATION = SECONDS_PER_BEAT * STEPS_PER_BEAT;
const STEP_DURATION = PATTERN_DURATION / STEPS;

export default class Scene extends MainScene {
  frameCounter = 0;

  constructor() {
    super();
  }

  async create() {
    const { orbitControls } = await this.warpSpeed('orbitControls');

    const cameraTarget = new THREE.Vector3(0, 0, 0);

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
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
    audio.load();
    
    // MESHES AND TWEENS
    gsap.ticker.remove(gsap.updateRoot);
    const timeline = gsap.timeline({
      repeat: -1,
      onStart: () => {
        audio.currentTime = 0;
        audio.play();
      },
      onRepeat: () => {
        audio.currentTime = 0;
      },
    });

    createActor(this.scene, timeline, {
      xPx: 0, yPx: 0, wPx: VIDEO_WIDTH, hPx: VIDEO_HEIGHT, vStart: 74, duration: PATTERN_DURATION,
    });
    createActor(this.scene, timeline, {
      xPx: 960, yPx: 690, wPx: 475, hPx: 300, vStart: 14, xDist: -480, yDist: -300, duration: 1,
      position: 1,
    });
    
    super.create();
  }

  update(time: number, delta: number) {
    gsap.updateRoot(time);
    super.update(time, delta);
  }

  postRender() {
    super.postRender();
    if (this.frameCounter % FRAMES_PER_RAF === 0) {
      actors.map((actor) => actor.loadImage());
    }
    this.frameCounter++;
  }
};

function createActor(
  scene: THREE.scene,
  timeline: gsap.core.Timeline,
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
  }) {
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

  const video = document.createElement('video');
  video.src = VIDEO_FULL_SRC;
  video.currentTime = vStart;
  video.load();

  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const geometry = new THREE.PlaneGeometry(w3d, h3d);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
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
    const tween = gsap.to(coords, {
      x: xVpEnd,
      y: yVpEnd,
      xOffset: xOffsetEnd,
      yOffset: yOffsetEnd,
      delay: 0,
      duration,
      ease: 'power2.out',
      onStart: () => {
        video.currentTime = vStart;
        video.play();
      },
      onUpdate: () => {
        mesh.position.set(coords.x, coords.y, coords.z);
        texture.offset = new THREE.Vector2(coords.xOffset, coords.yOffset);
        if (mesh.body) {
          mesh.body.needUpdate = true;
        }
      },
    });
    timeline.add(tween, position);
  }
}
