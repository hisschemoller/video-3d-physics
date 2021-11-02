import { PhysicsLoader, Project, Scene3D } from 'enable3d';
import MainScene from './mainscene';

let project: Project;
let sceneClass: MainScene;

export function setup(scene3d: MainScene) {
  sceneClass = scene3d;
  document.addEventListener('click', start);
}

function start() {
  document.removeEventListener('click', start);
  PhysicsLoader('./lib', () => {
    project = new Project(
      // @ts-ignore
      { scenes: [sceneClass], anisotropy: 4, antialias: true }
    )
    document.getElementById('canvas-container')?.appendChild(project.renderer.domElement);
    document.getElementById('overlay')?.remove();
    console.log('project', project);
  });
}
