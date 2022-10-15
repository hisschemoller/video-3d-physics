import { THREE } from 'enable3d';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Timeline } from '@app/timeline';
import createTween from '@app/tween';
import { ProjectSettings } from '@app/interfaces';
import { createSVG } from './actor-mesh';

export interface ShapeArgs {
  gltf: GLTF;
  patternDuration: number;
  projectSettings: ProjectSettings;
  scene: THREE.Scene;
  stepDuration: number;
  timeline: Timeline;
}

// const TEST_IMAGE = '../assets/projects/test/testimage3d.jpg';
// const WIRE_RADIUS = 0.01;
const EXTRUDE_DEPTH = 0.03;
const Z = -2;

async function createShape(
  projectSettings: ProjectSettings,
  svgScale: number,
  svgUrl: string,
  imgUrl: string,
  color = 0x888888,
) {
  const { scene } = projectSettings;
  const texture = new THREE.TextureLoader().load(imgUrl);
  const mesh = await createSVG(svgUrl, svgScale, texture, EXTRUDE_DEPTH, color);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // the texture should exactly cover the SVG extrude front
  const sizeVector = new THREE.Vector3();
  mesh.geometry.computeBoundingBox();
  mesh.geometry.boundingBox?.getSize(sizeVector);
  const wRepeat = (1 / sizeVector.x) * svgScale;
  const hRepeat = (1 / sizeVector.y) * svgScale * -1;
  texture.offset = new THREE.Vector2(0, 1);
  texture.repeat = new THREE.Vector2(wRepeat, hRepeat);

  mesh.position.set(-4, 5, -2.0);
  scene.add(mesh);
  return mesh;
}

async function createShape1({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.5 / 1024,
    '../assets/projects/piazzamaggiore/shape1.svg',
    '../assets/projects/piazzamaggiore/shape1.jpg',
    0x954031,
  );
  mesh.position.set(-0.6, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-3.5, 1.1, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 1) + (patternDuration * i * 0.6),
      duration: patternDuration * 0.33333,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 1.1 - (prog * 2.2);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * 8;
    },
  }));
}

async function createShape1a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.0 / 1024,
    '../assets/projects/piazzamaggiore/shape1.svg',
    '../assets/projects/piazzamaggiore/shape1.jpg',
    0x954031,
  );
  mesh.position.set(-0.4, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-0.2, 0.7, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 1) + (patternDuration * i * 0.6),
      duration: patternDuration * 0.33333,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 1.2 - ((1 - prog) * 0.8);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * -32;
    },
  }));
}

async function createShape2({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    5 / 1024,
    '../assets/projects/piazzamaggiore/shape2.svg',
    '../assets/projects/piazzamaggiore/shape2.jpg',
  );
  mesh.rotation.y = -0.3;
  mesh.position.set(-3, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-1, -1.9, Z);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.499,
    ease: 'sineInOut',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = -0.1 + (progress * Math.PI * 0.2);
    },
  }));
  timeline.add(createTween({
    delay: stepDuration + (patternDuration * 0.5),
    duration: patternDuration * 0.499,
    ease: 'sineInOut',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = -0.1 + ((1 - progress) * Math.PI * 0.2);
    },
  }));
}

async function createShape2a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    2.5 / 1024,
    '../assets/projects/piazzamaggiore/shape2.svg',
    '../assets/projects/piazzamaggiore/shape2.jpg',
  );
  mesh.rotation.y = -0.3;
  mesh.position.set(-3, 0, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(2.5, 1.9, Z + 0.2);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 8) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 1.9 + (prog * 1.7);
      },
    }));
  }
}

async function createShape3({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.8 / 1024,
    '../assets/projects/piazzamaggiore/shape3.svg',
    '../assets/projects/piazzamaggiore/shape3.jpg',
    0x97c2c21,
  );
  mesh.rotation.z = Math.PI * 0.47;
  mesh.position.set(-0.75, -1, 0);

  const mesh2 = mesh.clone();
  mesh2.rotation.y = Math.PI * 0.5;
  mesh2.position.set(0, -1, 0.75);

  const group = new THREE.Group();
  group.add(mesh);
  group.add(mesh2);
  group.position.set(0.75, -0.4, Z);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * -8;
    },
  }));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 2) + (patternDuration * i * 0.6),
      duration: patternDuration * 0.33333,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = -0.9 + (prog * 0.5);
      },
    }));
  }
}

async function createShape3a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.8 / 1024,
    '../assets/projects/piazzamaggiore/shape3.svg',
    '../assets/projects/piazzamaggiore/shape3.jpg',
    0xcc4e17,
  );
  mesh.rotation.z = Math.PI * 0.47;
  mesh.position.set(-0.75, -1, 0);

  const mesh2 = mesh.clone();
  mesh2.rotation.y = Math.PI * 0.5;
  mesh2.position.set(0, -1, 0.75);

  const groupScale = 0.8;
  const group = new THREE.Group();
  group.add(mesh);
  group.add(mesh2);
  group.scale.set(groupScale, groupScale, groupScale);
  group.rotation.z = Math.PI * 0.5;
  group.position.set(2.7, 2.0, Z);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.x = progress * Math.PI * -2;
      group.rotation.z = progress * Math.PI * 2;
    },
  }));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 16) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 2.0 + (prog * 1.0);
      },
    }));
  }
}

async function createShape4({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
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
  group.position.set(1.2, 3.2, Z);
  scene.add(group);

  for (let i = 0; i < 8; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.125),
      duration: patternDuration * 0.1249,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.rotation.z = -1 + (prog * Math.PI * 0.7);
      },
    }));
  }

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 12) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 3.2 + (prog * 0.8);
      },
    }));
  }
}

async function createShape4a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    0.8 / 1024,
    '../assets/projects/piazzamaggiore/shape4.svg',
    '../assets/projects/piazzamaggiore/shape4.jpg',
    0x7d7f00,
  );
  mesh.position.set(-0.4, 0.3, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(0.5, 0.4, Z + 0.7);
  scene.add(group);

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * Math.PI * -8;
    },
  }));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 12) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 0.4 + (prog * 3.6);
      },
    }));
  }
}

async function createShape5({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.6 / 1024,
    '../assets/projects/piazzamaggiore/shape5.svg',
    '../assets/projects/piazzamaggiore/shape5.jpg',
  );
  mesh.position.set(-0.75, 0.75, 0);
  // mesh.add(new THREE.AxesHelper(1));

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(0.75, 2.6, Z + 0.1);
  scene.add(group);
  // group.add(new THREE.AxesHelper(2));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 1.3 + (prog * 1.7);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * Math.PI * 4;
    },
  }));
}

async function createShape5a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    0.6 / 1024,
    '../assets/projects/piazzamaggiore/shape5.svg',
    '../assets/projects/piazzamaggiore/shape5a.jpg',
  );
  mesh.position.set(-0.3, 0.3, 0);
  // mesh.add(new THREE.AxesHelper(1));

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(1.1, 0.1, Z + 0.9);
  scene.add(group);
  // group.add(new THREE.AxesHelper(2));

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: stepDuration + (patternDuration * i * 0.5),
      duration: patternDuration * 0.36,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 0.1 + (prog * 4.4);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * Math.PI * 8;
    },
  }));
}

async function createShape6({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.0 / 1024,
    '../assets/projects/piazzamaggiore/shape6.svg',
    '../assets/projects/piazzamaggiore/shape6.jpg',
  );
  mesh.position.set(-0.5, -1, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-3.5, 3.8, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 1) + (patternDuration * i * 0.6),
      duration: patternDuration * 0.33333,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 3.8 - (prog * 2.2);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * -4;
    },
  }));
}

async function createShape6a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    0.9 / 1024,
    '../assets/projects/piazzamaggiore/shape6.svg',
    '../assets/projects/piazzamaggiore/shape6.jpg',
  );
  mesh.position.set(-0.5, -1, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(2.0, 0.6, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 16) + (patternDuration * i * 0.6),
      duration: patternDuration * 0.33333,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 0.6 + (prog * 2.7);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.y = progress * Math.PI * 4;
    },
  }));
}

async function createShape7({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    1.2 / 1024,
    '../assets/projects/piazzamaggiore/shape7.svg',
    '../assets/projects/piazzamaggiore/shape7.jpg',
  );
  mesh.rotation.z = Math.PI * 0.3;
  mesh.position.set(-0.6, -0.2, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(-3.5, 4.6, Z);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 8) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 4.6 - (prog * 2.5);
      },
    }));
  }
}

async function createShape7a({
  patternDuration, projectSettings, scene, stepDuration,
}: ShapeArgs) {
  const { timeline } = projectSettings;
  const mesh = await createShape(
    projectSettings,
    0.9 / 1024,
    '../assets/projects/piazzamaggiore/shape7.svg',
    '../assets/projects/piazzamaggiore/shape7.jpg',
  );
  mesh.rotation.z = Math.PI * 0.3;
  mesh.position.set(-0.6, -0.2, 0);

  const group = new THREE.Group();
  group.add(mesh);
  group.position.set(1.7, 0.2, Z + 0.3);
  scene.add(group);

  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: (stepDuration * 12) + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        group.position.y = 0.2 + (prog * 4.4);
      },
    }));
  }

  timeline.add(createTween({
    delay: stepDuration,
    duration: patternDuration * 0.999,
    ease: 'linear',
    onComplete: () => {},
    onStart: () => {},
    onUpdate: (progress: number) => {
      group.rotation.z = progress * Math.PI * 2;
    },
  }));
}

// async function createTwoRedCircles({
//   patternDuration, projectSettings, scene, stepDuration,
// }: ShapeArgs) {
//   const { timeline } = projectSettings;
//   const svgScale = 0.5 / 1024;
//   const svgUrl = '../assets/projects/piazzamaggiore/circle2.svg';
//   const svgRadius = 0.22;

//   const circleLeft = await createSVG(svgUrl, svgScale, undefined, 0.003, 0xaa0000);
//   circleLeft.position.set(-0.4 - svgRadius - svgRadius, svgRadius, 0);
//   circleLeft.castShadow = true;
//   circleLeft.receiveShadow = true;

//   const circleRight = circleLeft.clone();
//   circleRight.position.set(0.4, svgRadius, 0);
//   circleRight.castShadow = true;
//   circleRight.receiveShadow = true;

//   const connectWire = new THREE.Mesh(
//     new THREE.CylinderGeometry(WIRE_RADIUS, WIRE_RADIUS, 0.8),
//     new THREE.MeshPhongMaterial({ color: 0x333333 }),
//   );
//   connectWire.rotation.z = Math.PI * 0.5;
//   connectWire.castShadow = true;
//   connectWire.receiveShadow = true;

//   const group = new THREE.Group();
//   group.position.set(0.75, 2.0, -2.1);
//   group.add(connectWire);
//   group.add(circleLeft);
//   group.add(circleRight);
//   scene.add(group);

//   timeline.add(createTween({
//     delay: stepDuration,
//     duration: patternDuration * 0.999,
//     ease: 'linear',
//     onComplete: () => {},
//     onStart: () => {},
//     onUpdate: (progress: number) => {
//       group.rotation.y = progress * Math.PI * -8;
//     },
//   }));
// }

export default function createShapes(shapeArgs: ShapeArgs) {
  // createTwoRedCircles(shapeArgs);
  createShape1(shapeArgs);
  createShape1a(shapeArgs);
  createShape2(shapeArgs);
  createShape2a(shapeArgs);
  createShape3(shapeArgs);
  createShape3a(shapeArgs);
  createShape4(shapeArgs);
  createShape4a(shapeArgs);
  createShape5(shapeArgs);
  createShape5a(shapeArgs);
  createShape6(shapeArgs);
  createShape6a(shapeArgs);
  createShape7(shapeArgs);
  createShape7a(shapeArgs);
}
