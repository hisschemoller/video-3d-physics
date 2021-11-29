import { Scene3D, THREE } from 'enable3d';
import { dataURIToBlob, defaultFileName } from '@app/utils';

const RAF_RATE = 60;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  fps: number;

  framesPerDraw: number;

  secondsPerFrame: number;

  width: number;

  height: number;

  captureFps: number;

  captureThrottle: number;

  captureDuration: number;

  captureLastFrame: number;

  protected pCamera: THREE.PerspectiveCamera;

  ambientLight: THREE.AmbientLight;

  directionalLight: THREE.DirectionalLight;

  count = 0;

  delta = 0;

  time = 0;

  captureCount = 0;

  frameCount = 0;

  nextFramePosition = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    this.fps = this.scene.userData.isCapture ? this.captureFps : this.fps;
    this.captureLastFrame = Math.floor(this.captureDuration * this.captureFps);
    this.framesPerDraw = RAF_RATE / this.fps;
    this.secondsPerFrame = 1 / this.fps;

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
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35); // color = 0xffffff, intensity = 1
    this.scene.add(this.ambientLight);

    // DIRECTIONAL LIGHT
    const SHADOW_MAP_SIZE = 2048;
    const SHADOW_SIZE = 6;
    const SHADOW_FAR = 13500;
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.directionalLight.position.set(20, 5, 10);
    // this.directionalLight.position.multiplyScalar(100);
    this.directionalLight.color.setHSL(0.1, 1, 0.95);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
    this.directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
    this.directionalLight.shadow.camera.left = -SHADOW_SIZE;
    this.directionalLight.shadow.camera.right = SHADOW_SIZE;
    this.directionalLight.shadow.camera.top = SHADOW_SIZE;
    this.directionalLight.shadow.camera.bottom = -SHADOW_SIZE;
    this.directionalLight.shadow.camera.far = SHADOW_FAR;
    this.scene.add(this.directionalLight);

    // CAMERA HELPER
    const cameraHelper = new THREE.CameraHelper(this.pCamera);
    document.getElementById('camera-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(cameraHelper);
      } else {
        this.scene.remove(cameraHelper);
      }
    });

    // DIRECTIONAL LIGHT HELPER
    const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
    document.getElementById('directional-light-helper')?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        this.scene.add(directionalLightHelper);
      } else {
        this.scene.remove(directionalLightHelper);
      }
    });

    // DIRECTIONAL LIGHT SHADOW CAM HELPER
    const shadowCamHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
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
      orbitControls.saveState();
    }
    document.getElementById('reset-orbitcontrols')?.addEventListener('click', () => {
      orbitControls?.reset();
    });

    // SAVE IMAGE
    document.getElementById('save-image')?.addEventListener('click', () => {
      const dataURI = this.renderer.domElement.toDataURL('image/png');
      const blob = dataURIToBlob(dataURI);

      // force download
      const link = document.createElement('a');
      link.download = defaultFileName('.png');
      link.href = window.URL.createObjectURL(blob);
      link.onclick = () => {
        window.setTimeout(() => {
          window.URL.revokeObjectURL(link.href);
          link.removeAttribute('href');
        }, 500);
      };
      link.click();
    });
  }

  postCreate() {
    if (this.scene.userData.isCapture) {
      this.postRender();
      this.capture();
    } else {
      this.run();
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  update(time: number, delta: number) {
    this.renderer.setAnimationLoop(null);
  }

  /* eslint-disable class-methods-use-this */
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  async updateAsync(time: number, delta: number) {}

  /**
   * Overwrite the private _update() method.
   */
  /* eslint-disable no-underscore-dangle */
  async _update(isValid = false) {
    if (!isValid) {
      return;
    }

    this.delta = this.secondsPerFrame;
    this.time += this.delta;

    this.update.call(this, parseFloat(this.time.toFixed(3)), parseInt(this.delta.toString(), 10));
    await this.updateAsync.call(
      this, parseFloat(this.time.toFixed(3)), parseInt(this.delta.toString(), 10),
    );
    this.physics?.update(this.delta * 1000 * 0.7);
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
  async run() {
    // wait for the next frame to render
    let isWaiting = true;
    if (this.count >= this.nextFramePosition) {
      isWaiting = false;
      this.nextFramePosition += this.framesPerDraw;
    }
    this.count += 1;
    requestAnimationFrame(this.run.bind(this));
    if (isWaiting) {
      return;
    }

    await this._update(true);
  }

  /**
   * Save the frames at a lower framerate.
   */
  async capture() {
    // throttle the rAF framerate
    this.captureCount += 1;
    if (this.captureCount % this.captureThrottle !== 0) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }

    // wait for the next frame to render
    let isWaiting = true;
    if (this.count >= this.nextFramePosition) {
      isWaiting = false;
      this.nextFramePosition += this.framesPerDraw;
    }
    this.count += 1;
    if (isWaiting) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }

    // stop when done
    if (this.frameCount < this.captureLastFrame) {
      requestAnimationFrame(this.capture.bind(this));
    }

    await this._update(true);

    // capture the image data here
    const img = this.renderer.domElement.toDataURL();
    const body = JSON.stringify({ img, frame: this.frameCount + 1 });
    await fetch(`http://localhost:${PORT}`, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => {});

    this.frameCount += 1;
  }
}
