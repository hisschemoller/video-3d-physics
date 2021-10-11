import { PhysicsLoader, Project, Scene3D } from 'enable3d';

const IS_PUPPETEER = navigator.userAgent.indexOf('puppeteer') !== -1;
let project: Project;
let sceneClass: Scene3D;

export function setup(scene3d: Scene3D) {
  sceneClass = scene3d;
  if (IS_PUPPETEER) {
    start();
  } else {
    document.addEventListener('click', start);
  }
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
