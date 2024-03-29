/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor } from './actor';

async function createSvgActor(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
  serieNr: number,
  vlakNr: number,
  x: number,
  y: number,
  w: number,
  h: number,
  xPosAdjust = 0,
  yPosAdjust = 0,
) {
  const { width, width3d } = p;
  const svgScale = width3d / width;
  const z = serieNr === 1 ? 0.1 : 0.2;

  const actor = await createActor(p, {
    height: 1080,
    imgSrc: `../assets/projects/rembrandtplein/rembrandtplein-vlakken-serie-${serieNr}.png`,
    width: 1920,
  }, {
    imageRect: { w, h },
    svg: { scale: svgScale, url: `../assets/projects/rembrandtplein/vlak${vlakNr}.svg` },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({
    x: to3d(x + xPosAdjust, true), y: to3d(y + yPosAdjust, false), z,
  }));
  actor.setStaticImage(x, y);
  actor.getMesh().castShadow = false;
  actor.getMesh().receiveShadow = false;
  group.add(actor.getMesh());
  return actor;
}

function setOpacity(
  material: THREE.MeshPhongMaterial | THREE.MeshPhongMaterial[],
  opacity: number,
) {
  if (Array.isArray(material)) {
    material.forEach((mat) => { mat.opacity = opacity; });
  } else {
    material.opacity = opacity;
  }
}

function createFadeInOut(
  p: ProjectSettings,
  mesh: THREE.Mesh,
  delay: number,
  duration: number,
  fadeDuration: number,
) {
  const { stepDuration: s, timeline } = p;
  setOpacity(mesh.material as THREE.MeshPhongMaterial, 0);

  const fadeInTween = createTween({
    delay: delay * s,
    duration: fadeDuration * s,
    onStart: () => {},
    onUpdate: (progress: number) => {
      setOpacity(mesh.material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeInTween);

  const fadeOutTween = createTween({
    delay: ((delay + duration - fadeDuration) * s) % timeline.getDuration(),
    duration: fadeDuration * s,
    onStart: () => {},
    onUpdate: (progress: number) => {
      setOpacity(mesh.material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeOutTween);
}

export default async function createPlanes(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const m = 16;
  { // WIT SCHEEF
    const actor = await createSvgActor(p, group, to3d, 1, 1, 595, 103, 239, 272, 10);
    createFadeInOut(p, actor.getMesh(), m * 1, m * 6, m * 2);
  }
  { // BLAUW VOOR HOTEL
    const actor = await createSvgActor(p, group, to3d, 1, 2, 598, 597, 390, 264);
    createFadeInOut(p, actor.getMesh(), m * 10, m * 6, m * 2);
  }
  { // GRIJS MET ZWARTE DEUREN
    const actor = await createSvgActor(p, group, to3d, 1, 3, 183, 740, 405, 203, 10);
    createFadeInOut(p, actor.getMesh(), m * 1, m * 7, m * 2);
  }
  { // BLAUW-GROEN VOOR HOTEL SCHUIN
    const actor = await createSvgActor(p, group, to3d, 1, 4, 238, 335, 356, 284, 10);
    createFadeInOut(p, actor.getMesh(), m * 15, m * 6, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 1, 5, 1443, 365, 477, 292);
    createFadeInOut(p, actor.getMesh(), m * 10, m * 4.5, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 1, 6, 1601, 777, 319, 196);
    createFadeInOut(p, actor.getMesh(), m * 14, m * 8, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 1, 7, 1301, 0, 619, 310);
    createFadeInOut(p, actor.getMesh(), m * 5.5, m * 8, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 1, 8, 1199, 549, 240, 340);
    createFadeInOut(p, actor.getMesh(), m * 7.5, m * 6, m * 2);
  }
  { // DAK LINKSBOVEN
    const actor = await createSvgActor(p, group, to3d, 2, 9, 0, 0, 264, 264);
    createFadeInOut(p, actor.getMesh(), m * 11, m * 8, m * 2);
  }
  { // STROOK RAMEN IN HOTEL
    const actor = await createSvgActor(p, group, to3d, 2, 10, 0, 385, 434, 129, 5, -10);
    createFadeInOut(p, actor.getMesh(), m * 5, m * 8, m * 2);
  }
  { // DONKERE ZIJMUUR
    const actor = await createSvgActor(p, group, to3d, 2, 11, 443, 263, 159, 604, 10);
    createFadeInOut(p, actor.getMesh(), m * 7.5, m * 8, m * 2);
  }
  { // HUIS
    const actor = await createSvgActor(p, group, to3d, 2, 12, 604, 99, 402, 411);
    createFadeInOut(p, actor.getMesh(), m * 6.5, m * 8, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 2, 13, 1002, 600, 252, 326);
    createFadeInOut(p, actor.getMesh(), m * 3.5, m * 8, m * 2);
  }
  {
    const actor = await createSvgActor(p, group, to3d, 2, 14, 1592, 0, 328, 453);
    createFadeInOut(p, actor.getMesh(), m * 12, m * 8, m * 2);
  }
}
