import { ExtendedObject3D, THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

/**
 * Create SVG extrude hanging on ropes.
 */
async function createHanger(
  projectSettings: ProjectSettings,
  fix: ExtendedObject3D, {
    imgH,
    imgW,
    mediaData,
    position,
    ropeConfig,
    svgUrl,
  }: {
    imgH: number,
    imgW: number,
    mediaData: ImageData | VideoData,
    position: THREE.Vector3, // indicates object's left top
    ropeConfig: { pivot: THREE.Vector3, length: number },
    svgUrl: string,
  },
) {
  const {
    patternDuration, scene3d, width, width3d,
  } = projectSettings;
  const DEPTH = 0.05;
  const ROPE_RADIUS = 0.1;
  const SVG_SCALE = width3d / width;
  const boundingBox = new THREE.Vector3(imgW * SVG_SCALE, imgH * SVG_SCALE, DEPTH);

  // SVG EXTRUDE ACTOR
  const actor = await createActor(projectSettings, mediaData, {
    imageRect: { w: imgW, h: imgH },
    svg: { scale: SVG_SCALE, url: svgUrl },
    depth: DEPTH,
  });
  actor.setStaticPosition(getMatrix4({
    x: boundingBox.x / -2,
    y: boundingBox.y / 2,
    z: boundingBox.z / -2,
  }));
  actor.addTween({
    delay: 0.1,
    duration: patternDuration,
    videoStart: 50,
    fromImagePosition: new THREE.Vector2(0, 0),
    toImagePosition: new THREE.Vector2(0, 0),
  });

  // HANGER
  const hanger = new ExtendedObject3D();
  hanger.add(actor.getMesh());
  hanger.position.set(
    position.x + (boundingBox.x / 2),
    position.y - (boundingBox.y / 2),
    position.z,
  );
  scene3d.add.existing(hanger);
  scene3d.physics.add.existing(hanger, {
    mass: 1,
    shape: 'mesh',
  });

  // ROPE
  const rope = scene3d.physics.add.cylinder({
    height: ropeConfig.length,
    radiusBottom: ROPE_RADIUS,
    radiusTop: ROPE_RADIUS,
    x: position.x + ropeConfig.pivot.x,
    y: position.y + ropeConfig.pivot.y + (ropeConfig.length / 2),
    z: position.z,
  });

  // ROPE TO FIX
  scene3d.physics.add.constraints.pointToPoint(rope.body, fix.body, {
    // the offset from the center of each object
    pivotA: { x: 0, y: ropeConfig.length / 2, z: 0 },
    pivotB: {
      x: position.x + ropeConfig.pivot.x,
      y: position.y + ropeConfig.length,
      z: position.z,
    },
  });

  // ROPE TO HANGER
  scene3d.physics.add.constraints.pointToPoint(rope.body, hanger.body, {
    // the offset from the center of each object
    pivotA: { x: 0, y: ropeConfig.length / -2, z: 0 },
    pivotB: {
      x: (boundingBox.x / -2) + ropeConfig.pivot.x,
      y: (boundingBox.y / 2),
      z: 0,
    },
  });
}

/**
 * Setup
 */
// eslint-disable-next-line import/prefer-default-export
export function setupPhysics(
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
    width: 0.1, height: 0.1, depth: 0.1, mass: 0, collisionFlags: 4, // GHOST
  });

  createHanger(projectSettings, fix, {
    imgH: 669, // image and svg height in pixels
    imgW: 679, // image and svg width in pixels
    mediaData: media?.video20 as VideoData,
    position: new THREE.Vector3(-3, 2, -1), // indicates object's left top
    ropeConfig: { pivot: new THREE.Vector3(100 * SCALE, 0, 0), length: 1 }, // left top relative
    svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  });
}
