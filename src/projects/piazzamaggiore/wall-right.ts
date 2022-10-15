import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import { createActor } from './actor';
import { createShape } from './shapes';

const Z = 1.75;

async function createShape4(projectSettings: ProjectSettings) {
  const {
    scene,
  } = projectSettings;

  const mesh = await createShape(
    projectSettings,
    1.6 / 1024,
    '../assets/projects/piazzamaggiore/shape4.svg',
    '../assets/projects/piazzamaggiore/shape4.jpg',
    0x7d7f00,
  );
  mesh.position.set(-0.7, 0.5, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(5.7, 0, Z);
  scene.add(group);
}

export default async function createWallRight(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
) {
  createShape4(projectSettings);
  const {
    patternDuration,
    width,
    width3d,
  } = projectSettings;
  const SVG_SCALE = width3d / width;

  { // WALL RIGHT  FRONT
    const scale = 0.79;
    const actor = await createActor(projectSettings, videos.main, {
      imageRect: { w: 179, h: 1080 },
      svg: { depth: 0.0003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/muur_rechts.svg' },
    });
    actor.setStaticPosition(getMatrix4({
      x: 5.15, y: 3.53, z: 2, sx: scale, sy: scale,
    }));
    actor.addTween({
      delay: 0,
      duration: patternDuration * 0.999,
      fromImagePosition: new THREE.Vector2(1741, 0),
      videoStart: 84.3,
    });
  }

  { // WALL RIGHT BACK
    const scale = 0.84;
    const actor = await createActor(projectSettings, {
      height: 1080,
      imgSrc: '../assets/projects/piazzamaggiore/muur_rechts_gat2.jpg',
      width: 334,
    }, {
      imageRect: { w: 334, h: 1080 },
      svg: { depth: 0.0003, scale: SVG_SCALE, url: '../assets/projects/piazzamaggiore/muur_rechts2.svg' },
    });
    actor.setStaticPosition(getMatrix4({
      x: 4.4, y: 3.78, z: 1.5, sx: scale, sy: scale,
    }));
    actor.setStaticImage(0, 0);
    actor.addTween({
      delay: 0,
      duration: patternDuration * 0.999,
      fromImagePosition: new THREE.Vector2(1920 - 334, 0),
    });
  }
}
