/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import Hanger from './Hanger';

/**
 * Setup
 */
// eslint-disable-next-line import/prefer-default-export
export async function setupPhysics(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { scene3d, width3d, width } = projectSettings;
  const SCALE = width3d / width;

  if (scene3d.physics.debug) {
    scene3d.physics.debug.enable();
  }

  // scene3d.physics.setGravity(0, 0, 0);

  const fix = scene3d.physics.add.box({
    width: 0.1, height: 0.1, depth: 0.1, mass: 0, collisionFlags: 4, // 4 = GHOST
  });

  const sky = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-3, 5, -5), // indicates object's left top
  });
  await sky.createSVGExtrudeHanger({
    img: { x: 0, y: 0, w: 679, h: 669 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.2,
    svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  });
  sky.createRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(100 * SCALE, 0, 0), length: 1 }, // left top relative
      // { pivot: new THREE.Vector3(500 * SCALE, 0, 0), length: 2 },
    ],
    fix,
  });

  // Een hanger aan een andere hanger
  const ropeLength = 1;
  const pointOnSky = new THREE.Vector3(523 * SCALE, 669 * SCALE, 0);
  const position = sky.getLocalToGlobalPoint(pointOnSky);
  position.y -= ropeLength;
  const trafficLight = new Hanger({
    projectSettings,
    position, // indicates object's left top
  });
  await trafficLight.createSVGExtrudeHanger({
    img: { x: 0, y: 540, w: 77, h: 540 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.0,
    svgUrl: '../assets/projects/haarlemmerplein/stoplicht20.svg',
  });
  trafficLight.createRopeToOtherHanger({
    length: ropeLength,
    otherHanger: sky,
    pivotOnOtherHanger: pointOnSky,
  });
}
