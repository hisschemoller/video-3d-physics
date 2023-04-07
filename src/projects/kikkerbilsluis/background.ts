/* eslint-disable import/prefer-default-export */
/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { ImageData, ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';

async function createSky2Mid(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 793, h: 513 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht2-mid.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -7, y: 7, z: -10, sx: 2, sy: 2 }));
  actor.setStaticImage(215, 0);
}

async function createSky3Left(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { patternDuration, width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.video3, {
    imageRect: { w: 209, h: 343 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht3-links.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -12, y: 9, z: -10.5, ry: 0.1, sx: 3.5, sy: 3.5 }));
  actor.addTween({
    delay: 0,
    duration: 6.5,
    videoStart: 10,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
  actor.setStaticPosition(getMatrix4({ x: -12, y: 9, z: -10.5, ry: 0.1, sx: 3.5, sy: 3.5 }));
  actor.addTween({
    delay: patternDuration / 2,
    duration: 6.5,
    videoStart: 10,
    fromImagePosition: new THREE.Vector2(0, 0),
  });
}

async function createSky1MidRight(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame1, {
    imageRect: { w: 485, h: 686 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/lucht1-midrechts.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 2, y: 9, z: -10.5, ry: -0.1, sx: 1.5, sy: 1.5 }));
  actor.setStaticImage(978, 0);
}

// async function createBooking(
//   projectSettings: ProjectSettings,
//   media: { [key: string]: VideoData | ImageData | undefined },
// ) {
//   const { width, width3d } = projectSettings;
//   const svgScale = width3d / width;
//   const actor = await createActor(projectSettings, media.frame3, {
//     imageRect: { w: 243, h: 447 },
//     svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/booking.svg' },
//     depth: 0.02,
//   });
//   actor.setStaticPosition(getMatrix4({ x: -10, y: 5, z: -9.7, ry: 0.1, sx: 1.8, sy: 1.8 }));
//   actor.setStaticImage(281, 19);
// }

async function createMuziekgebouw(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  buildings: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 544, h: 202 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/muziekgebouw2.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: -8 - 2, y: 1, z: -9.0, ry: -0, sx: 1.7, sy: 1.7 }));
  actor.setStaticImage(351, 373);
  buildings.add(actor.getMesh());
}

async function createUp(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  buildings: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame3, {
    imageRect: { w: 410, h: 226 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/up.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 0 - 2, y: 1.5, z: -9.6, ry: -0, sx: 1.8, sy: 1.8 }));
  actor.setStaticImage(1004, 402);
  buildings.add(actor.getMesh());
}

async function createNemo(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
  buildings: THREE.Group,
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const s = 1.2;

  const actor1 = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 359, h: 159 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/nemo1.svg' },
    depth: 0.01,
  });
  actor1.setStaticPosition(getMatrix4({ x: 5 - 2, y: -0.5, z: -11.8, ry: -0.0, sx: s, sy: s }));
  actor1.setStaticImage(1032, 409);
  buildings.add(actor1.getMesh());

  const actor2 = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 236, h: 130 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/nemo2.svg' },
    depth: 0.01,
  });
  actor2.setStaticPosition(getMatrix4({ x: 8.8 - 2, y: -0.7, z: -12, ry: -0.0, sx: s, sy: s }));
  actor2.setStaticImage(1404, 420);
  buildings.add(actor2.getMesh());

  const actor3 = await createActor(projectSettings, media.frame2, {
    imageRect: { w: 267, h: 186 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/nemo3.svg' },
    depth: 0.01,
  });
  actor3.setStaticPosition(getMatrix4({ x: 11.3 - 2, y: -0.7, z: -11.8, ry: -0.0, sx: s, sy: s }));
  actor3.setStaticImage(1653, 425);
  buildings.add(actor3.getMesh());
}

async function createWhiteCar(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { patternDuration, width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame3witteauto, {
    imageRect: { w: 843, h: 177 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/witte-auto.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 0, y: 1.5, z: 0, sx: 0.7, sy: 0.7 }));
  actor.setStaticImage(553, 664);
  // wheel.position.x = -6 + (progress * 12);
  actor.addTween({
    delay: 1,
    duration: patternDuration,
    fromMatrix4: getMatrix4({ x: -8, y: -1, z: 0, sx: 0.7, sy: 0.7 }),
    toMatrix4: getMatrix4({ x: 4, y: -1, z: 0, sx: 0.7, sy: 0.7 }),
  });
}

async function createPilon(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame3paalinzon, {
    imageRect: { w: 183, h: 762 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/hefpijler3.svg' },
    depth: 0.02,
  });
  actor.setStaticPosition(getMatrix4({ x: 4.3, y: 3.0, z: -6, ry: -0, sx: 0.9, sy: 0.9 }));
  actor.setStaticImage(1411, 106);
}

async function createBarrierPole(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  const { width, width3d } = projectSettings;
  const svgScale = width3d / width;
  const actor = await createActor(projectSettings, media.frame1, {
    imageRect: { w: 31, h: 879 },
    svg: { scale: svgScale, url: '../assets/projects/kikkerbilsluis/slagboom.svg' },
    depth: 0.01,
  });
  actor.setStaticPosition(getMatrix4({ x: 7.5, y: 7.0, z: -6, ry: -0, sx: 1.5, sy: 1.5 }));
  actor.setStaticImage(1462, 0);
}

export async function createSky(
  projectSettings: ProjectSettings,
  media: { [key: string]: VideoData | ImageData | undefined },
) {
  await createSky2Mid(projectSettings, media);
  await createSky3Left(projectSettings, media);
  await createSky1MidRight(projectSettings, media);
  // await createBooking(projectSettings, media);

  const buildings = new THREE.Group();
  projectSettings.scene.add(buildings);
  await createMuziekgebouw(projectSettings, media, buildings);
  await createNemo(projectSettings, media, buildings);
  await createUp(projectSettings, media, buildings);

  await createWhiteCar(projectSettings, media);
  await createPilon(projectSettings, media);
  await createBarrierPole(projectSettings, media);
}
