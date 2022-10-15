import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor } from './actor';

export default async function createWallRight(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
) {
  const {
    patternDuration,
    scene,
    stepDuration,
    timeline,
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

  { // STICK
    const group = new THREE.Group();
    group.position.set(7, 0, 1.75);
    group.rotation.z = Math.PI * 0.35;
    scene.add(group);

    const length = 5;
    const texture = new THREE.TextureLoader().load('../assets/projects/piazzamaggiore/texture-grey.jpg');
    const geometry = new THREE.CylinderBufferGeometry(0.05, 0.05, length);
    const material = new THREE.MeshPhongMaterial({
      color: 0x555555, shininess: 0.4, map: texture, flatShading: false,
    });
    const stick = new THREE.Mesh(geometry, material);
    stick.position.set(0, length * 0.5, 0);
    stick.castShadow = true;
    stick.receiveShadow = true;
    group.add(stick);
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * 0.4),
      duration: patternDuration * 0.2499,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        group.rotation.z = (Math.PI * 0.35) + progress * (Math.PI * 0.30);
      },
    }));
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * 0.65),
      duration: patternDuration * 0.2499,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        group.rotation.z = (Math.PI * 0.65) + progress * (Math.PI * -0.30);
      },
    }));
  }
}
