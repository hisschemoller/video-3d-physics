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
  const grass = await scene3d.load.texture('../assets/projects/weesperstraat/grass.jpg');
  const grassGround = grass.clone();
  grassGround.needsUpdate = true;
  grassGround.wrapT = 1000;
  grassGround.wrapS = 1000; // RepeatWrapping
  grassGround.offset.set(0, 0);
  grassGround.repeat.set(10, 10);

  scene3d.physics.add.ground(
    { y: -2 /* -1 */, width: 100, height: 100 }, { lambert: { map: grassGround } },
  );
}

export async function createSky() {

}
