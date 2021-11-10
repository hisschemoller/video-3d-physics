import { PhysicsLoader, Project } from 'enable3d';
import MainScene from './mainscene';

let startButton: HTMLButtonElement;
let project: Project;
let sceneClass: MainScene;

function start() {
  startButton.removeEventListener('click', start);
  PhysicsLoader('./lib', () => {
    project = new Project(
      // @ts-ignore
      { scenes: [sceneClass], anisotropy: 4, antialias: true },
    );
    const renderCheckbox = document.getElementById('play-render-toggle') as HTMLInputElement;
    project.scene.userData.isCapture = renderCheckbox.checked;
    document.getElementById('canvas-container')?.appendChild(project.renderer.domElement);
    document.getElementById('overlay')?.remove();
  });
}

export default function setup(scene3d: MainScene) {
  sceneClass = scene3d;
  startButton = document.getElementById('overlay__start') as HTMLButtonElement;
  startButton.addEventListener('click', start);
}
