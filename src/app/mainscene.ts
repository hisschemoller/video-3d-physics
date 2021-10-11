import { Scene3D } from 'enable3d';

export const FPS = 5;
export const RAF_RATE = 60;
const FRAMES_PER_DRAW = RAF_RATE / FPS;
const IS_PUPPETEER = navigator.userAgent.indexOf('puppeteer') !== -1;
const MAX_FRAMES = 50 * 3;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  width = IS_PUPPETEER ? 1280 : 960;
  height = IS_PUPPETEER ? 720 : 540;
  frame = 0;
  delta = 0;
  time = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    if (IS_PUPPETEER) {
      this.saveFrame();
    }
    this.run();
  }

  update(time: number, delta: number) {
    // if (IS_PUPPETEER) {
      this.renderer.setAnimationLoop(null);
    // }
  }

  /**
   * Overwrite the private _update() method.
   */
  _update() {
    // let delta = this.clock.getDelta() * 1000;
    // let time = this.clock.getElapsedTime();
    this.delta = this.clock.getDelta() * 1000;
    this.time = this.clock.getElapsedTime();
    // console.log('delta', delta, 'time', time, 'frame', this.frame);

    // modify time
    if (IS_PUPPETEER) {
      this.delta = this.delta * 1000;
      this.time += this.delta;
    }

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

  /**
   * Send the image to the server.
   */
  async saveFrame() {
    this._update();
    const img = this.renderer.domElement.toDataURL();

    const body = JSON.stringify({ img, frame: this.frame });

    await fetch(`http://localhost:${PORT}`, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {});

    this.frame++;

    if (this.frame > MAX_FRAMES) console.log('DONE');
    setTimeout(() => {
      this.saveFrame();
    }, 200);
  }
}
