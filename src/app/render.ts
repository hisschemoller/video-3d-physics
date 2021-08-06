import { PhysicsLoader, Project, Scene3D } from 'enable3d';

const IS_PUPPETEER = navigator.userAgent.indexOf('puppeteer') !== -1;
const MAX_FRAMES = 10;
const FPS = 30;
const WIDTH = IS_PUPPETEER ? 1280 : 960;
const HEIGHT = IS_PUPPETEER ? 720 : 540;
const PORT = 3020;

// @ts-ignore
class MainScene extends Scene3D {
  frame = 0;
  delta = 1 / FPS;
  time = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  async create() {
    this.warpSpeed();

    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();

    const x = () => (Math.random() - 0.5) * 2;
    const bounciness = 0.6;

    this.physics.add.sphere({ x: x(), y: 5 }, { lambert: { color: 'red' } }).body.setBounciness(bounciness);
    this.physics.add.box({ x: x(), y: 10 }, { lambert: { color: 'blue' } }).body.setBounciness(bounciness);
    this.physics.add.torus({ x: x(), y: 12 }, { lambert: { color: 'orange' } }).body.setBounciness(bounciness);
    this.physics.add.cone({ x: x(), y: 14 }, { lambert: { color: 'green' } }).body.setBounciness(bounciness);
    this.physics.add.cylinder({ x: x(), y: 16 }, { lambert: { color: 'yellow' } }).body.setBounciness(bounciness);

    if (IS_PUPPETEER) this.saveFrame();
  }

  update() {
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

    this.frame ++;

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

    super.update?.(parseFloat(time.toFixed(3)), parseInt(delta.toString()));
    this.physics?.update(delta);
    this.physics?.updateDebugger();

    this.animationMixers.update(delta);

    this.preRender();
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    this.postRender();
  }
}

export default function render() {
  PhysicsLoader('./lib', () => new Project(
    // @ts-ignore
    { scenes: [MainScene], anisotropy: 4, antialias: true }
  ));
}
