import { ExtendedObject3D, PhysicsLoader, Project, Scene3D, THREE } from 'enable3d';

const CANVAS_HEIGHT = 1080;
const CANVAS_WIDTH = 1920;

class MainScene extends Scene3D {
  private box!: ExtendedObject3D;
  private rootEl: HTMLDivElement;

  constructor() {
    super({ key: 'MainScene' });
    this.rootEl = document.getElementById('canvas-container') as HTMLDivElement;
  }

  init() {
    this.renderer.setPixelRatio(1); // window.devicePixelRatio);
    this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, true);
    this.rootEl.appendChild(this.renderer.domElement);
  }

  preload() {
    console.log('preload');
  }

  create() {
    console.log('create');

    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed();

    // enable physics debug
    this.physics.debug?.enable(); 

    // position camera
    this.camera.position.set(10, 10, 20);
    this.camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    this.camera.updateProjectionMatrix();

    // blue box
    this.box = this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } });

    // pink box
    this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } });

    // green sphere
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0.2, 3, 0);
    this.scene.add(sphere);
    // add physics to an existing object
    this.physics.add.existing(sphere);

    // @ts-ignore
    setInterval(() => this._update(), 500);
  }

  update() {
    this.renderer.setAnimationLoop(null);
    // this.box.rotation.x += 0.01;
    // this.box.rotation.y += 0.01;
  }
}

/**
 * General setup of the module.
 */
export default function setup(): void {
  // PhysicsLoader('/lib/kripken', () => new Project({
  //   scenes: [MainScene],
  //   antialias: true,
  // }));
  let project: Project;
  PhysicsLoader('/lib/kripken', () => {
    project = new Project({
      scenes: [MainScene],
      antialias: true,
    });
    return project;
  });
}
