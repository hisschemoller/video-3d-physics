/* eslint-disable object-curly-newline */
import { ExtendedObject3D, THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import Hanger from './Hanger';

/**
 * Create SVG extrude hanging on ropes.
 */
async function createHanger(
  projectSettings: ProjectSettings,
  fix: ExtendedObject3D, {
    img,
    mediaData,
    position,
    ropes,
    svgScale,
    svgUrl,
  }: {
    img: { x: number, y: number, w: number, h: number },
    mediaData: ImageData | VideoData,
    position: THREE.Vector3, // indicates object's left top
    ropes: { pivot: THREE.Vector3, length: number }[],
    svgScale: number,
    svgUrl: string,
  },
) {
  const {
    patternDuration, scene3d, width, width3d,
  } = projectSettings;
  const DEPTH = 0.05;
  const ROPE_RADIUS = 0.05;
  const SCALE = width3d / width;
  const boundingBox = new THREE.Vector3(img.w * SCALE * svgScale, img.h * SCALE * svgScale, DEPTH);

  // SVG EXTRUDE ACTOR
  const actor = await createActor(projectSettings, mediaData, {
    imageRect: { w: img.w, h: img.h },
    svg: { scale: SCALE * svgScale, url: svgUrl },
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
    fromImagePosition: new THREE.Vector2(img.x, img.y),
    toImagePosition: new THREE.Vector2(img.x, img.y),
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

  ropes.forEach((ropeConfig) => {
    // ROPE
    const rope = scene3d.physics.add.cylinder({
      height: ropeConfig.length,
      radiusBottom: ROPE_RADIUS,
      radiusTop: ROPE_RADIUS,
      x: position.x + ropeConfig.pivot.x,
      y: position.y + ropeConfig.pivot.y + (ropeConfig.length / 2),
      z: position.z,
    }, {
      phong: {
        color: 0x222222,
      },
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
  const SCALE = width3d / width;

  if (scene3d.physics.debug) {
    scene3d.physics.debug.enable();
  }

  // scene3d.physics.setGravity(0, 0, 0);

  const fix = scene3d.physics.add.box({
    width: 0.1, height: 0.1, depth: 0.1, mass: 0, collisionFlags: 4, // 4 = GHOST
  });

  // createHanger(projectSettings, fix, {
  //   img: { x: 0, y: 0, w: 679, h: 669 },
  //   mediaData: media?.video20 as VideoData,
  //   position: new THREE.Vector3(-3, 3, -7), // indicates object's left top
  //   ropes: [
  //     { pivot: new THREE.Vector3(100 * SCALE, 0, 0), length: 1 }, // left top relative
  //     { pivot: new THREE.Vector3(500 * SCALE, 0, 0), length: 2 },
  //   ],
  //   svgScale: 1.2,
  //   svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  // });

  const sky = new Hanger({
    projectSettings,
    position: new THREE.Vector3(-3, 3, -7), // indicates object's left top
  });
  await sky.createSVGExtrudeHanger({
    img: { x: 0, y: 0, w: 679, h: 669 },
    mediaData: media?.video20 as VideoData,
    svgScale: 1.2,
    svgUrl: '../assets/projects/haarlemmerplein/lucht20.svg',
  });
  sky.addRopesToFix({
    ropes: [
      { pivot: new THREE.Vector3(100 * SCALE, 0, 0), length: 1 }, // left top relative
      { pivot: new THREE.Vector3(500 * SCALE, 0, 0), length: 2 },
    ],
    fix,
  });

  // Een hanger aan een andere hanger
  //
}
