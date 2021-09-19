import { THREE } from 'enable3d';
import { renderBackground, setupBackground } from '@app/background';
import MainScene from '@app/mainscene';

export default class Scene extends MainScene {

  constructor() {
    super();
  }

  async create() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    setupBackground('../assets/projects/brugphkade/brugphkade1.mp4');

    super.create();
  }

  preRender() {
    renderBackground(this.renderer);
  }
};
