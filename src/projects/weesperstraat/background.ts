/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

export async function createGround(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene3d } = projectSettings;

  const texture = new THREE.TextureLoader().load('../assets/projects/test/testimage3d.jpg');
  scene3d.physics.add.ground(
    { y: -2, width: 30, height: 10, depth: 0.2 }, { lambert: { map: texture } },
  );
}

export async function createSky() {

}

async function createVoorgevel(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
  svgScale: number,
) {
  const { patternDuration, stepDuration } = projectSettings;
  const scale = 1;
  const actor = await createActor(projectSettings, media.video3, {
    svg: { scale: svgScale, url: '../assets/projects/weesperstraat/voorgevel.svg' },
    imageRect: { w: 342, h: 866 },
    depth: 0.1,
    color: 0xdec5a9,
  });
  actor.setStaticPosition(getMatrix4({
    x: 6.5, y: (svgScale * 866) - 2, z: -5, sx: scale, sy: scale }));
  actor.addTween({
    delay: stepDuration * 1,
    duration: patternDuration * 0.99,
    videoStart: 17,
    fromImagePosition: new THREE.Vector2(1578, 0),
  });
  actor.getMesh().castShadow = true;
  actor.getMesh().receiveShadow = true;
  group.add(actor.getMesh());
  return actor.getMesh();
}

export default async function createWalls(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  group: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;

  const voorgevel = await createVoorgevel(projectSettings, media, group, svgScale);
}
