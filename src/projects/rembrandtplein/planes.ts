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
  vlakNr: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { width, width3d } = p;
  const svgScale = width3d / width;

  const actor = await createActor(p, {
    height: 1080,
    imgSrc: '../assets/projects/rembrandtplein/rembrandtplein-vlakken-serie-1.png',
    width: 1920,
  }, {
    imageRect: { w, h },
    svg: { scale: svgScale, url: `../assets/projects/rembrandtplein/vlak${vlakNr}.svg` },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: to3d(x, true), y: to3d(y, false), z: 0.1 }));
  actor.setStaticImage(x, y);
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
) {
  const { stepDuration: s, timeline } = p;
  const fadeDuration = 8;
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
    delay: (delay + duration - fadeDuration) * s,
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
  const actor1 = await createSvgActor(p, group, to3d, 1, 595, 103, 239, 272);
  createFadeInOut(p, actor1.getMesh(), 2, 24);

  const actor2 = await createSvgActor(p, group, to3d, 2, 598, 597, 390, 264);
  createFadeInOut(p, actor2.getMesh(), 2, 24);
}
