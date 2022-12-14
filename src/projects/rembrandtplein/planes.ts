/* eslint-disable no-param-reassign */
import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { createActor } from './actor';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';

async function createPlane1SvgActor(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const { width, width3d } = p;
  const circleSize = (194 / width) * width3d;
  const svgScale = width3d / width;
  const imageWidth = 128;
  const imageHeight = 128;

  const actor = await createActor(p, {
    height: imageHeight,
    imgSrc: '../assets/projects/rembrandtplein/yellow.jpg',
    width: imageWidth,
  }, {
    imageRect: { w: imageWidth, h: imageHeight },
    svg: { scale: svgScale, url: '../assets/projects/rembrandtplein/plane1.svg' },
    depth: 0.005,
  });
  actor.setStaticPosition(getMatrix4({ x: to3d(596, true), y: to3d(108, false), z: 0.1 }));
  actor.setStaticImage(0, 0);
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
  mesh.visible = false;
  const fadeDuration = 4;

  const fadeInTween = createTween({
    delay: delay * s,
    duration: fadeDuration * s,
    onStart: () => {
      mesh.visible = true;
    },
    onUpdate: async (progress: number) => {
      setOpacity(mesh.material as THREE.MeshPhongMaterial, progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeInTween);

  const fadeOutTween = createTween({
    delay: (delay + duration - fadeDuration) * s,
    duration: fadeDuration * s,
    onStart: () => {},
    onUpdate: async (progress: number) => {
      setOpacity(mesh.material as THREE.MeshPhongMaterial, 1 - progress);
    },
    onComplete: () => {},
  });
  timeline.add(fadeOutTween);
}

async function createPlane1(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  const actor = await createPlane1SvgActor(p, group, to3d);
  createFadeInOut(p, actor.getMesh(), 2, 12);
}

export default function createPlanes(
  p: ProjectSettings,
  group: THREE.Group,
  to3d: (size: number, isWidth: boolean) => number,
) {
  createPlane1(p, group, to3d);
}
