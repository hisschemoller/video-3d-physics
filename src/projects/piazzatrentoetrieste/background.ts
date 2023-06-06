/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export default async function createBackground(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const {
    height, height3d, width, width3d,
  } = projectSettings;
  const scale = 1.8;

  const actor = await createActor(projectSettings, media.frame500, {
    box: { w: width3d, h: height3d, d: 0.02 },
    imageRect: { w: width, h: height },
    depth: 0,
  });
  actor.setStaticPosition(getMatrix4({ x: -6.35, y: 3.6, z: -10, sx: scale, sy: scale }));
  actor.setStaticImage(0, 0);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  group.add(actor.getMesh());

  if (Array.isArray(actor.getMesh().material)) {
    (actor.getMesh().material as Array<THREE.Material>)[1].opacity = 0.5;
  }
}

export async function createGround(projectSettings: ProjectSettings) {
  const { scene } = projectSettings;

  const gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0xffffff);
  gridHelper.position.set(10, -2, -11.5);
  gridHelper.rotation.x = 0.02 + 0.14;
  scene.add(gridHelper);

  const planeGeometry = new THREE.PlaneGeometry(40, 20);
  planeGeometry.rotateX(Math.PI / -2);
  const ground = new THREE.Mesh(
    planeGeometry,
    // new THREE.ShadowMaterial({ opacity: 0.4, transparent: true, side: THREE.FrontSide }),
    new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.FrontSide }),
  );
  ground.position.set(0, -2, -11.5);
  ground.rotation.x = 0.02 + 0.14;
  ground.receiveShadow = true;
  scene.add(ground);
}
