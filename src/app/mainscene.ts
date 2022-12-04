import { Scene3D, THREE } from 'enable3d';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { dataURIToBlob, defaultFileName } from '@app/utils';
import { pauseSound, playSound, setupAudio } from './audio';

const RAF_RATE = 60;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  fps: number;

  framesPerDraw: number;

  secondsPerFrame: number;

  width: number;

  height: number;

  width3d: number;

  height3d: number;

  captureFps: number;

  captureThrottle: number;

  captureDuration: number;

  captureLastFrame: number;

  protected pCamera: THREE.PerspectiveCamera;

  cameraTarget: THREE.Vector3;

  ambientLight: THREE.AmbientLight;

  directionalLight: THREE.DirectionalLight;

  orbitControls: OrbitControls;

  shadowSize = 6;

  count = 0;

  delta = 0;

  time = 0;

  captureCount = 0;

  frameCount = 0;

  nextFramePosition = 0;

  clearColor = 0xbbddff;

  isPaused = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    this.fps = this.scene.userData.isCapture ? this.captureFps : this.fps;
    this.captureLastFrame = Math.floor(this.captureDuration * this.captureFps);
    this.framesPerDraw = RAF_RATE / this.fps;
    this.secondsPerFrame = 1 / this.fps;

    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    const { orbitControls: oc } = await this.warpSpeed('orbitControls');
    this.orbitControls = oc as OrbitControls;

    // RENDERER
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    this.renderer.setClearColor(this.clearColor);

    // CAMERA
    this.pCamera = this.camera as THREE.PerspectiveCamera;
    this.pCamera.aspect = this.width / this.height;
    this.pCamera.position.set(0, 0, 9.6);
    this.pCamera.lookAt(this.cameraTarget);
    this.pCamera.updateProjectionMatrix();

    // AMBIENT LIGHT
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35); // color = 0xffffff, intensity = 1
    this.scene.add(this.ambientLight);

    // DIRECTIONAL LIGHT
    const SHADOW_MAP_SIZE = 2048;
    const SHADOW_FAR = 13500;
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.directionalLight.position.set(20, 5, 10);
    // this.directionalLight.position.multiplyScalar(100);
    this.directionalLight.color.setHSL(0.1, 1, 0.95);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
    this.directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
    this.directionalLight.shadow.camera.left = -this.shadowSize;
    this.directionalLight.shadow.camera.right = this.shadowSize;
    this.directionalLight.shadow.camera.top = this.shadowSize;
    this.directionalLight.shadow.camera.bottom = -this.shadowSize;
    this.directionalLight.shadow.camera.far = SHADOW_FAR;
    this.scene.add(this.directionalLight);

    // AUDIO
    setupAudio(this.pCamera);

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
    const gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0xff0000);
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
    this.orbitControls.target = this.cameraTarget;
    this.orbitControls.update();
    this.orbitControls.saveState();
    document.getElementById('reset-orbitcontrols')?.addEventListener('click', () => {
      this.orbitControls.reset();
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

    // PAUSE / CONTINUE PLAYBACK
    document.getElementById('pause-toggle')?.addEventListener('click', () => {
      const el: HTMLInputElement = document.getElementById('pause-toggle') as HTMLInputElement;
      this.isPaused = el.checked;
      this.togglePause();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isPaused = !this.isPaused;
        const el: HTMLInputElement = document.getElementById('pause-toggle') as HTMLInputElement;
        el.checked = this.isPaused;
        this.togglePause();
      }
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

  togglePause() {
    if (this.isPaused) {
      pauseSound();
    } else {
      this.run();
      playSound();
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

    this.time += this.delta;
    this.delta = this.secondsPerFrame;

    this.update.call(this, this.time, this.delta);
    await this.updateAsync.call(this, this.time, this.delta);
    this.physics?.update(this.delta * 1000 * 0.7); // TODO: What is 0.7 ????
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
    if (this.isPaused) {
      return;
    }

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

  to3d(size: number, isWidth = true) {
    return isWidth
      ? (size / this.width) * this.width3d
      : (size / this.height) * this.height3d * -1;
  }

  toVP3d(size: number, isWidth = true) {
    return this.to3d(size, isWidth) + (isWidth ? (this.width3d * -0.5) : (this.height3d * 0.5));
  }
}
