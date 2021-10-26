import { Scene3D } from 'enable3d';

export const FPS = 15;
const RAF_RATE = 60;
const FRAMES_PER_DRAW = RAF_RATE / FPS;
const SECONDS_PER_FRAME = 1 / FPS;
const MAX_FRAMES = 50 * 3;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
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
