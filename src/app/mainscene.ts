import { Scene3D, THREE } from 'enable3d';

export const FPS = 15;
const RAF_RATE = 60;
const FRAMES_PER_DRAW = RAF_RATE / FPS;
const SECONDS_PER_FRAME = 1 / FPS;
const MAX_FRAMES = 50 * 3;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  pCamera: THREE.PerspectiveCamera;
  isCapture = false;
  width = this.isCapture ? 1280 : 960;
  height = this.isCapture ? 720 : 540;
  count = 0;
  delta = 0;
  time = 0;
  captureCount = 0;
  captureThrottle = 15;
  captureLastFrame = MAX_FRAMES;
  frameCount = 0;
  nextFramePosition = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    const { orbitControls } = await this.warpSpeed('orbitControls');

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    this.renderer.setClearColor(0xbbddff);

    // CAMERA
    this.pCamera = this.camera as THREE.PerspectiveCamera;
    this.pCamera.aspect = this.width / this.height;
    this.pCamera.position.set(0, 0, 9.6);
    this.pCamera.lookAt(cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // AMBIENT LIGHT
    const ambient = new THREE.AmbientLight(0xffffff, 0.35); // color = 0xffffff, intensity = 1
    this.scene.add(ambient);

    // DIRECTIONAL LIGHT
    const SHADOW_MAP_SIZE = 2048;
    const SHADOW_SIZE = 6;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    directionalLight.position.set(20, 5, 10);
    // directionalLight.position.multiplyScalar(100);
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
    
    // DIRECTIONAL LIGHT SHADOW CAM HELPER
    const cameraHelper = new THREE.CameraHelper(this.pCamera);
    document.getElementById('camera-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(cameraHelper);
      } else {
        this.scene.remove(cameraHelper);
      }
    });

    // DIRECTIONAL LIGHT HELPER
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    document.getElementById('directional-light-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(directionalLightHelper);
      } else {
        this.scene.remove(directionalLightHelper);
      }
    });
    
    // DIRECTIONAL LIGHT SHADOW CAM HELPER
    const shadowCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    document.getElementById('shadow-camera-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(shadowCamHelper);
      } else {
        this.scene.remove(shadowCamHelper);
      }
    });

    // GRID HELPER
    const gridHelper = new THREE.GridHelper(20, 20, 20);
    gridHelper.position.set(0, 0, 0);
    document.getElementById('grid-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(gridHelper);
      } else {
        this.scene.remove(gridHelper);
      }
    });
    
    // AXES HELPER
    const axesHelper = new THREE.AxesHelper(25);
    document.getElementById('axes-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(axesHelper);
      } else {
        this.scene.remove(axesHelper);
      }
    });

    // ORBIT CONTROLS
    if (orbitControls) {
      orbitControls.target = cameraTarget;
      orbitControls.update();
    }

    if (this.isCapture) {
      this.capture();
    } else {
      this.run();
    }
  }

  update(time: number, delta: number) {
    this.renderer.setAnimationLoop(null);
  }

  /**
   * Overwrite the private _update() method.
   */
  _update() {
    this.delta = SECONDS_PER_FRAME;
    this.time += this.delta;

    this.update.call(this, parseFloat(this.time.toFixed(3)), parseInt(this.delta.toString()));
    this.physics?.update(this.delta);
    this.physics?.updateDebugger();

    this.animationMixers.update(this.delta);

    this.preRender.call(this);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    this.postRender.call(this);
  }

  /**
   * Play the scene.
   */
  run() {
    // wait for the next frame to render
    let isWaiting = true;
    if (this.count >= this.nextFramePosition) {
      isWaiting = false;
      this.nextFramePosition += FRAMES_PER_DRAW;
    }
    this.count++;
    requestAnimationFrame(this.run.bind(this));
    if (isWaiting) {
      return;
    }

    this._update();
  }

  /**
   * Save the frames at a lower framerate.
   */
  async capture() {
    // throttle the rAF framerate
    this.captureCount++;
    if (this.captureCount % this.captureThrottle !== 0) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }

    // wait for the next frame to render
    let isWaiting = true;
    if (this.count >= this.nextFramePosition) {
      isWaiting = false;
      this.nextFramePosition += FRAMES_PER_DRAW;
    }
    this.count++;
    if (isWaiting) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }
    
    // stop when done
    if (this.frameCount < this.captureLastFrame) {
      requestAnimationFrame(this.capture.bind(this));
    }

    this._update();

    // capture the image data here
    const img = this.renderer.domElement.toDataURL();
    const body = JSON.stringify({ img, frame: this.frameCount + 1 });
    await fetch(`http://localhost:${PORT}`, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {});

    this.frameCount++;
  }
}
