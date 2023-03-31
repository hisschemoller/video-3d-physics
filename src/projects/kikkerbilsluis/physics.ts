/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { GridHelper } from 'three';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import { createSVG } from './actor-mesh';

async function createSvgWheel(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  fix: ExtendedObject3D,
  pxTo3d: number,
) {
  const { scene3d } = projectSettings;

  // const actor = await createActor(projectSettings, media.frame1, {
  //   imageRect: { w: 100, h: 100 },
  //   svg: { scale: pxTo3d, url: '../assets/projects/kikkerbilsluis/wheel2.svg' },
  //   depth: 1,
  // });
  // actor.setStaticPosition(getMatrix4({}));
  // actor.setStaticImage(0, 0);

  const svgMesh = await createSVG(
    '../assets/projects/kikkerbilsluis/wheel2.svg',
    pxTo3d,
    undefined,
    1,
  );
  const geometry = svgMesh.geometry.clone();
  const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const wheel = new ExtendedObject3D();
  wheel.add(mesh);
  wheel.position.set(-4, 4, 0);
  scene3d.add.existing(wheel);
  scene3d.physics.add.existing(wheel, {
    mass: 1,
    shape: 'mesh',
  });
}

async function createEnable3dExampleWheel(
  projectSettings: ProjectSettings,
) {
  const { scene3d } = projectSettings;
  const extrudeSettings = {
    depth: 2,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 8,
  };

  const arcShape = new THREE.Shape();
  arcShape.absarc(0, 0, 2, 0, Math.PI * 2, false);

  const holePath = new THREE.Path();
  holePath.absarc(0, 0, 1.5, 0, Math.PI * 2, true);
  arcShape.holes.push(holePath);

  const geo = new THREE.ExtrudeBufferGeometry(arcShape, extrudeSettings);
  const mat = new THREE.MeshPhongMaterial({ color: 'khaki', opacity: 0, transparent: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  geo.translate(0, 0, -1); // somehow this has an offset as well :/

  const wireframeGeo = new THREE.WireframeGeometry(geo);
  const wireframeMat = new THREE.MeshPhongMaterial({ color: 'black' });
  const line = new THREE.LineSegments(wireframeGeo, wireframeMat);

  const wheel = new ExtendedObject3D();
  wheel.add(mesh);
  wheel.add(line);
  wheel.position.y = 0;
  scene3d.scene.add(wheel);
  scene3d.physics.add.existing(wheel, { shape: 'mesh' }); // 'hacd'
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

  // await createSvgWheel(projectSettings, media, fix, pxTo3d);
  await createEnable3dExampleWheel(projectSettings, media, fix, pxTo3d);

  const grid = new GridHelper(30, 10, 0x333333, 0x333333);
  grid.position.set(0, -4, 0);
  scene3d.scene.add(grid);
}
