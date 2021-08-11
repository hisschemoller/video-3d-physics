import MainScene from '../../app/mainscene';

export default class Scene extends MainScene {

  constructor() {
    super();
  }

  async create() {
    this.warpSpeed();

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    const x = () => (Math.random() - 0.5) * 2;
    const bounciness = 0.6;

    this.physics.add.sphere({ x: x(), y: 5 }, { lambert: { color: 'red' } }).body.setBounciness(bounciness);
    this.physics.add.box({ x: x(), y: 10 }, { lambert: { color: 'blue' } }).body.setBounciness(bounciness);
    this.physics.add.torus({ x: x(), y: 12 }, { lambert: { color: 'orange' } }).body.setBounciness(bounciness);
    this.physics.add.cone({ x: x(), y: 14 }, { lambert: { color: 'green' } }).body.setBounciness(bounciness);
    this.physics.add.cylinder({ x: x(), y: 16 }, { lambert: { color: 'yellow' } }).body.setBounciness(bounciness);

    super.create()
  }
};
