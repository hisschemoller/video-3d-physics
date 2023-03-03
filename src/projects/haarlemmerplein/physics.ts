import { ExtendedObject3D, THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { createSVG } from './actor-mesh';

async function createHanger(
  projectSettings: ProjectSettings,
  fix: ExtendedObject3D, {
    imgData,
    svgUrl,
  }: {
    imgData: ImageData,
    svgUrl: string,
  },
) {
  const { scene3d, width, width3d } = projectSettings;

  // create an extrude from a loaded SVG
  const SVG_SCALE = width3d / width;
  const svgMesh = await createSVG(
    svgUrl,
    SVG_SCALE,
    undefined,
    0.05,
  );
  const geometry = svgMesh.geometry.clone();

  // the canvas should exactly cover the SVG extrude front
  const sizeVector = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox?.getSize(sizeVector);
  const wRepeat = (1 / sizeVector.x) * SVG_SCALE;
  const hRepeat = (1 / sizeVector.y) * SVG_SCALE * -1;

  // an image as texture for now
  const texture = new THREE.TextureLoader().load(imgData.imgSrc);
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.BackSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const hanger = new ExtendedObject3D();
  hanger.add(mesh);
  scene3d.scene.add(hanger);

  // scene3d.physics.add.existing(hanger, {
  //   mass: 1,
  //   shape: 'mesh',
  // });
}

// eslint-disable-next-line import/prefer-default-export
export function setupPhysics(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene3d } = projectSettings;

  if (scene3d.physics.debug) {
    scene3d.physics.debug.enable();
  }

  const fix = scene3d.physics.add.box({
    y: 4, width: 0.1, height: 0.1, depth: 0.1, mass: 0,
  });

  createHanger(projectSettings, fix, {
    imgData: media?.frame20 as ImageData,
    svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  });
}
