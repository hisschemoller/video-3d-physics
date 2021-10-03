import { Scene3D } from 'enable3d';

const IS_PUPPETEER = navigator.userAgent.indexOf('puppeteer') !== -1;
const MAX_FRAMES = 10;
const FPS = 30;
const PORT = 3020;

// @ts-ignore
export default class MainScene extends Scene3D {
  width = IS_PUPPETEER ? 1280 : 960;
  height = IS_PUPPETEER ? 720 : 540;
  frame = 0;
  delta = 1 / FPS;
  time = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    if (IS_PUPPETEER) {
      this.saveFrame();
    }
  }

  update(time: number, delta: number) {
    if (IS_PUPPETEER) this.renderer.setAnimationLoop(null);
  }

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
    this.saveFrame();
  }

  // overwrite the private _update() method
  _update() {
    let delta = this.clock.getDelta() * 1000;
    let time = this.clock.getElapsedTime();

    // modify time
    if (IS_PUPPETEER) {
      delta = this.delta * 1000;
      time = this.time += this.delta;
    }

    this.update.call(this, parseFloat(time.toFixed(3)), parseInt(delta.toString()));
    this.physics?.update(delta);
    this.physics?.updateDebugger();

    this.animationMixers.update(delta);

    this.preRender.call(this);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    this.postRender.call(this);
  }
}
