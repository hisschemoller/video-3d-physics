import { Scene3D } from 'enable3d';

export const FPS = 30;
const RAF_RATE = 60;
const FRAMES_PER_DRAW = RAF_RATE / FPS;
const SECONDS_PER_FRAME = 1 / FPS;
const MAX_FRAMES = 50 * 3;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  isCapture = true;
  width = this.isCapture ? 1280 : 960;
  height = this.isCapture ? 720 : 540;
  frame = 0;
  delta = 0;
  time = 0;
  captureCounter = 0;
  captureThrottle = 15;
  captureLastFrame = MAX_FRAMES;
  frameCounter = 0;

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

  run() {
    this.frame++;
    if (this.frame % FRAMES_PER_DRAW !== 0) {
      requestAnimationFrame(this.run.bind(this));
      return;
    }
    requestAnimationFrame(this.run.bind(this));

    this._update();
  }

  async capture() {
    this.frame++;
    if (this.frame % FRAMES_PER_DRAW !== 0) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }

    this.captureCounter++;
    if (this.captureCounter % this.captureThrottle !== 0) {
      requestAnimationFrame(this.capture.bind(this));
      return;
    }
    
    // stop when done
    if (this.frameCounter < this.captureLastFrame) {
      requestAnimationFrame(this.capture.bind(this));
    }

    this._update();

    // capture the image data here
    const img = this.renderer.domElement.toDataURL();
    const body = JSON.stringify({ img, frame: this.frameCounter });
    await fetch(`http://localhost:${PORT}`, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {});
    this.frameCounter++;
  }
}
