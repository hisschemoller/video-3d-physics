/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { GridHelper } from 'three';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import Hanger from './Hanger';

async function createBuilding(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const building = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-2, 6.5, -4.5), // indicates object's left top
  });
  await building.createSVGExtrudeHanger({
    img: { x: 720, y: 0, w: 508, h: 878 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.4,
    svgUrl: '../assets/projects/haarlemmerplein/gebouw20.svg',
    color: 0x777777,
  });
  building.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(150 * pxTo3d, 0, 0), length: 6 }, // left top relative
      { pivot: new THREE.Vector3(600 * pxTo3d, 0 * pxTo3d, 0), length: 6 },
    ],
    fix,
  });
}

async function createFloor20(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const floor = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-7, -3.5, 1), // indicates object's left top
  });
  await floor.createSVGExtrudeFloor({
    img: { x: 67, y: 887, w: 1853, h: 193 },
    mediaData: media?.frame20 as ImageData,
    svgScale: 0.9,
    svgUrl: '../assets/projects/haarlemmerplein/grond20.svg',
  });
  floor.createRopesFromFloorToFix({
    ropes: [
      { pivot: new THREE.Vector3(0, 0, 0), length: 10 }, // left back relative
      { pivot: new THREE.Vector3(1853 * pxTo3d, 0, 0), length: 10 },
      { pivot: new THREE.Vector3(0, 0, 193 * pxTo3d), length: 10 },
    ],
    fix,
  });
}

async function createGate(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const gate = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-8.5, 2, -1), // indicates object's left top
  });
  await gate.createSVGExtrudeHanger({
    img: { x: 0, y: 269, w: 469, h: 456 },
    mediaData: media?.video19 as VideoData,
    svgScale: 1.1,
    svgUrl: '../assets/projects/haarlemmerplein/poort19.svg',
    color: 0x777777,
  });
  gate.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(100 * pxTo3d, 0, 0), length: 5 }, // left top relative
      { pivot: new THREE.Vector3(300 * pxTo3d, 0 * pxTo3d, 0), length: 7 },
    ],
    fix,
  });
}

async function createSky(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const sky = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-11, 6.5, -5), // indicates object's left top
  });
  await sky.createSVGExtrudeHanger({
    img: { x: 0, y: 200, w: 679, h: 669 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.8,
    svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  });
  sky.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(100 * pxTo3d, 0, 0), length: 1 }, // left top relative
      { pivot: new THREE.Vector3(1000 * pxTo3d, 0, 0), length: 2 },
    ],
    fix,
  });
}

async function createTree19(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const tree = new Hanger({
    projectSettings,
    position: new THREE.Vector3(1.5, 3.5, 1.5), // indicates object's left top
  });
  await tree.createSVGExtrudeHanger({
    img: { x: 1177, y: 0, w: 743, h: 940 },
    mediaData: media?.video19 as VideoData,
    svgScale: 0.9,
    svgUrl: '../assets/projects/haarlemmerplein/boom19.svg',
    color: 0x33aa33,
  });
  tree.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(150 * pxTo3d, 0, 0), length: 10 }, // left top relative
      { pivot: new THREE.Vector3(600 * pxTo3d, 0 * pxTo3d, 0), length: 10 },
    ],
    fix,
  });
}

async function createTree20(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const tree = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-0.5, 6.0, -1), // indicates object's left top
  });
  await tree.createSVGExtrudeHanger({
    img: { x: 960, y: 0, w: 720, h: 876 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.2,
    svgUrl: '../assets/projects/haarlemmerplein/boom20.svg',
    color: 0x33aa33,
  });
  tree.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(500 * pxTo3d, 0, 0), length: 10 }, // left top relative
      { pivot: new THREE.Vector3(600 * pxTo3d, 0 * pxTo3d, 0), length: 10 },
    ],
    fix,
  });
}

/**
 * Setup
 */
// eslint-disable-next-line import/prefer-default-export
export async function setupPhysics(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene3d, width3d, width } = projectSettings;
  const pxTo3d = width3d / width;

  if (scene3d.physics.debug) {
    // scene3d.physics.debug.enable();
  }

  // scene3d.physics.setGravity(0, 0, 0);

  const fix = scene3d.physics.add.box({
    width: 0.1, height: 0.1, depth: 0.1, mass: 0, collisionFlags: 4, // 4 = GHOST
  });

  await createSky(projectSettings, media, fix, pxTo3d);
  await createFloor20(projectSettings, media, fix, pxTo3d);
  await createGate(projectSettings, media, fix, pxTo3d);
  await createBuilding(projectSettings, media, fix, pxTo3d);
  await createTree19(projectSettings, media, fix, pxTo3d);
  await createTree20(projectSettings, media, fix, pxTo3d);

  const grid = new GridHelper(30, 10, 0x333333, 0x333333);
  grid.position.set(0, -4, 0);
  scene3d.scene.add(grid);
}
