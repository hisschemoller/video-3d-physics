import { THREE } from 'enable3d';
import MainScene from '@app/mainscene';
import { getMatrix, MatrixConfig } from '@app/utils';

const VIDEO_SRC = '../assets/projects/droogbak8/droogbak8-slice.mov';
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const PLANE_WIDTH = 16;
const PLANE_HEIGHT = 9;

export default class Scene extends MainScene {
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

    const background = createBackground();
    this.scene.add(background);
    background.add(createActor(200, 600, 700, 200));

    super.create();
  }

  preRender() {}
};

function createActor(xPx = 0, yPx = 0, wPx = 100, hPx = 100) {
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
  video.src = VIDEO_SRC;
  video.loop = true;
  video.load();
  video.play();

  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.offset = new THREE.Vector2(xOffset, yOffset);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  const geometry = new THREE.PlaneGeometry(w3d, h3d);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(getMatrix({ x: xVP, y: yVP, }));
  return mesh;
}

function createBackground() {
  const video = document.createElement('video');
  video.src = VIDEO_SRC;
  video.loop = true;
  video.load();
  video.play();

  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
