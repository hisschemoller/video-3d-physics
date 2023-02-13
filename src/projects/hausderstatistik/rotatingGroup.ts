import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4, MatrixConfig } from '@app/utils';
import addMatrix4Tween from './matrix4Tween';
import { createBox, createTube, rotateAroundAxis } from './tubeObjects';

const GROUND_X = 8;
const GROUND_Y = -7.2;
const GROUND_Z = 9.5;

function createRotatingGroup(
  p: ProjectSettings,
  {
    inDelay,
    inFrom,
    inTo,
    outDelay,
    outFrom,
    outTo,
  } : {
    inDelay: number;
    inFrom: MatrixConfig;
    inTo: MatrixConfig;
    outDelay: number;
    outFrom: MatrixConfig;
    outTo: MatrixConfig;
  },
) {
  const { stepDuration: s } = p;
  const duration = s * 16;

  const group = new THREE.Group();
  // group.position.set(0, 0, 0);

  addMatrix4Tween(p, group, {
    delay: s * inDelay,
    duration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4(inFrom),
    toMatrix4: getMatrix4(inTo),
  });

  addMatrix4Tween(p, group, {
    delay: s * outDelay,
    duration,
    ease: 'cubicInOut',
    fromMatrix4: getMatrix4(outFrom),
    toMatrix4: getMatrix4(outTo),
  });

  group.position.setFromMatrixPosition(getMatrix4(inFrom));
  group.quaternion.setFromRotationMatrix(getMatrix4(inFrom));

  return group;
}

function createShadowGround(
  width: number,
  depth: number,
  x: number,
  y: number,
  z: number,
) {
  const planeGeometry = new THREE.PlaneGeometry(width, depth);
  planeGeometry.rotateX(Math.PI / -2);
  const ground = new THREE.Mesh(
    planeGeometry,
    new THREE.ShadowMaterial({ opacity: 0.4, transparent: true, side: THREE.FrontSide }),
    // new THREE.MeshPhongMaterial({ color: 0x999999 }),
  );
  ground.position.set(x, y, z);
  ground.receiveShadow = true;
  return ground;
}

/**
 * 1.
 */
export async function createRotatingGroup1(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const inDelay = 100;
  const group = createRotatingGroup(p, {
    inDelay,
    inFrom: { x: 4, z: 2, ry: 1 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 4,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: 4, z: 2, ry: 1 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, GROUND_X + 1, GROUND_Y, GROUND_Z);
  group.add(ground);

  // const tube = createTube(
  //   GROUND_X + 1.3, GROUND_Y + 1, GROUND_Z,
  //   [[0, 0, 0.2], [-0.5, 0.33, 0.02], [0.1, 0.66, -0.2], [0.4, 0.99, -0.02], [-0.2, 1.33, 0]],
  //   0.02, 0x777777,
  // );
  // group.add(tube);
  // rotateAroundAxis(p, tube, inDelay, 48, -6);

  // {
  //   const tube = createTube(
  //     GROUND_X + 0.66, GROUND_Y + 1.7, GROUND_Z + 1,
  //     [[0, 0, 0], [-0.33, 0.33, 0.012], [0, 0.4, 0.05], [0.33, 0.33, -0.012], [0, 0, 0]],
  //     0.015, 0x777777,
  //   );
  //   group.add(tube);
  //   rotateAroundAxis(p, tube, inDelay, 48, 4.5);
  // }

  // {
  //   const tubeGroup = new THREE.Group();
  //   tubeGroup.position.set(GROUND_X, GROUND_Y + 1.3, GROUND_Z + 1);
  //   group.add(tubeGroup);
  //   rotateAroundAxis(p, tubeGroup, inDelay, 48, 6);

  //   const radius = 0.3;
  //   const amount = 5;
  //   for (let i = 0; i < amount; i += 1) {
  //     const arc = (i / amount) * Math.PI * 2;
  //     const tube = createTube(
  //       (Math.cos(arc) * radius), -0.2, (Math.sin(arc) * radius),
  //       [[0, 0, 0], [0, 0.4, 0]], 0.015, 0x777777,
  //     );
  //     tubeGroup.add(tube);
  //   }
  // }

  // {
  //   const curve: [number, number, number][] = [];
  //   for (let i = 0; i < 10; i += 1) {
  //     curve.push([0.03 * (i % 2 === 0 ? 1 : -1), i * 0.08, 0]);
  //   }
  //   const tube = createTube(
  //     GROUND_X + 0.66, GROUND_Y + 1, GROUND_Z + 1, curve, 0.015, 0x777777,
  //   );
  //   group.add(tube);
  //   rotateAroundAxis(p, tube, inDelay, 48, 24);
  // }

  // {
  //   const curve: [number, number, number][] = [];
  //   for (let i = 0; i < 14; i += 1) {
  //     curve.push([0.05 * (i % 2 === 0 ? 1 : -1), i * 0.08, 0]);
  //   }
  //   const tube = createTube(
  //     GROUND_X + 0.33, GROUND_Y + 0.66, GROUND_Z + 1.2, curve, 0.015, 0x777777,
  //   );
  //   group.add(tube);
  //   rotateAroundAxis(p, tube, inDelay, 48, -18);
  // }

  // {
  //   const curve: [number, number, number][] = [];
  //   for (let i = 0; i < 12; i += 1) {
  //     curve.push([0.1 * (i % 2 === 0 ? 1 : -1), i * 0.07, 0]);
  //   }
  //   const tube = createTube(
  //     GROUND_X - 0.33, GROUND_Y + 0.66, GROUND_Z + 0.8, curve, 0.015, 0x777777,
  //   );
  //   group.add(tube);
  //   rotateAroundAxis(p, tube, inDelay, 48, 36);
  // }

  // {
  //   const curve: [number, number, number][] = [];
  //   for (let i = 0; i < 12; i += 1) {
  //     curve.push([0.1 * (i % 2 === 0 ? 1 : -1), i * 0.12, 0]);
  //   }
  //   const tube = createTube(
  //     GROUND_X - 0.11, GROUND_Y + 0.66, GROUND_Z + 0.8, curve, 0.015, 0x777777,
  //   );
  //   group.add(tube);
  //   rotateAroundAxis(p, tube, inDelay, 48, -12);
  // }

  {
    const boxGroup = new THREE.Group();
    boxGroup.position.set(GROUND_X, GROUND_Y + 2, GROUND_Z + 1);
    group.add(boxGroup);
    rotateAroundAxis(p, boxGroup, inDelay, 48, -1.5);

    for (let i = 0; i < 5; i += 1) {
      const box = createBox(0, -0.6, -1 + (i * 0.4), 0.15, 1.2, 0.005, 0x777777);
      boxGroup.add(box);
      rotateAroundAxis(p, box, inDelay, 48, 6);
    }
  }

  return group;
}

/**
 * 2.
 */
export async function createRotatingGroup2(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const inDelay = 4;
  const group = createRotatingGroup(p, {
    inDelay,
    inFrom: { x: -4, z: -5, ry: -0.2 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 36,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: -4, z: -5, ry: -0.2 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, GROUND_X - 1, GROUND_Y, GROUND_Z);
  group.add(ground);

  // const box = createTestBox(GROUND_X - 1, GROUND_Y + 0.7, GROUND_Z, 0xff0000);
  // group.add(box);

  // const tube = createTube(
  //   GROUND_X - 1, GROUND_Y, GROUND_Z,
  //  [[0, 0, 0], [-0.2, 4, 0.2], [-0.5, 6, 0.5]], 0.05, 0x555555,
  // );

  // const tube = createTube(
  //   GROUND_X - 1, GROUND_Y, GROUND_Z,
  //   [[0, 0, 0], [-0.02, 1.5, 0.02], [-0.05, 2.5, 0.05]], 0.02, 0x777777,
  // );
  // group.add(tube);

  {
    const tube = createTube(
      GROUND_X + 0.66, GROUND_Y + 1.8, GROUND_Z + 1,
      [[0, 0, 0], [-0.33, 0.33, 0.012], [0, 0.4, 0.05], [0.33, 0.33, -0.012], [0, 0, 0]],
      0.015, 0x777777,
    );
    group.add(tube);
    rotateAroundAxis(p, tube, inDelay, 48, 4.5);
  }

  {
    const tube = createTube(
      GROUND_X + 0.66, GROUND_Y + 1.6, GROUND_Z + 1,
      [[0.5, 0, 0], [-0.1, 0.12, 0.33], [-0.33, -0.12, 0.05], [0.05, 0.12, -0.33], [0.33, 0, 0]],
      0.015, 0x777777,
    );
    group.add(tube);
    rotateAroundAxis(p, tube, inDelay, 48, -3);
  }

  {
    const tube = createTube(
      GROUND_X + 0.66, GROUND_Y + 1.3, GROUND_Z + 1,
      [[-0.4, 0, 0.3], [-0.1, 0.2, 0.02], [0.44, -0.1, -0.4], [-0.1, 0.1, -0.02], [-0.4, 0, 0.3]],
      0.015, 0x777777,
    );
    group.add(tube);
    rotateAroundAxis(p, tube, inDelay, 48, 6);
  }

  {
    const tube = createTube(
      GROUND_X + 0.66, GROUND_Y + 1.1, GROUND_Z + 1,
      [[0, 0, 0], [-0.33, 0.33, 0.02], [0, 1, 0.33], [0.2, 0.66, -0.1], [0, 0, 0]],
      0.015, 0x777777,
    );
    group.add(tube);
    rotateAroundAxis(p, tube, inDelay, 48, -6);
  }

  // addMatrix4Tween(p, tube2, {
  //   delay: p.stepDuration * 4,
  //   duration: p.stepDuration * 32,
  //   ease: 'linear',
  //   fromMatrix4: getMatrix4({
  //     x: GROUND_X + 1, y: GROUND_Y + 1, z: GROUND_Z, ry: 0,
  //   }),
  //   toMatrix4: getMatrix4({
  //     x: GROUND_X + 1, y: GROUND_Y + 1, z: GROUND_Z, ry: Math.PI * 1,
  //   }),
  // });

  return group;
}

/**
 * 3.
 */
export async function createRotatingGroup3(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const inDelay = 36;
  const group = createRotatingGroup(p, {
    inDelay,
    inFrom: { x: 4.5, z: -4, ry: 0.2 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 68,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: 4.5, z: -4, ry: 0.2 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, GROUND_X - 1, GROUND_Y, GROUND_Z);
  group.add(ground);

  {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(GROUND_X - 0.3, GROUND_Y + 1.5, GROUND_Z + 1.5);
    group.add(tubeGroup);
    rotateAroundAxis(p, tubeGroup, inDelay, 48, 3);

    for (let i = 0; i < 10; i += 1) {
      const tube = createTube(
        (-1.35 + (i * 0.3)), 0, 0,
        [[0, 0, 0], [0, 0.4, 0]], 0.015, 0x777777,
      );
      tubeGroup.add(tube);
    }
  }

  {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(GROUND_X, GROUND_Y + 1.6, GROUND_Z + 1);
    group.add(tubeGroup);
    rotateAroundAxis(p, tubeGroup, inDelay, 48, -3);

    for (let i = 0; i < 10; i += 1) {
      const tube = createTube(
        (-2.25 + (i * 0.5)), 0, 0,
        [[0, 0, 0], [0, 0.6, 0]], 0.015, 0x555555,
      );
      tubeGroup.add(tube);
    }
  }

  {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(GROUND_X + 0.2, GROUND_Y + 1.7, GROUND_Z + 1);
    group.add(tubeGroup);
    rotateAroundAxis(p, tubeGroup, inDelay, 48, 6);

    for (let i = 0; i < 8; i += 1) {
      const tube = createTube(
        (-0.7 + (i * 0.2)), -0.2, 0,
        [[0, 0, 0], [0, 0.4, 0]], 0.015, 0x555555,
      );
      tubeGroup.add(tube);
    }
  }

  return group;
}

/**
 * 4.
 */
export async function createRotatingGroup4(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const inDelay = 68;
  const group = createRotatingGroup(p, {
    inDelay,
    inFrom: { x: -2.5, z: -5, ry: -0.2 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 100,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: -2.5, z: -5, ry: -0.2 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, GROUND_X - 1, GROUND_Y, GROUND_Z);
  group.add(ground);

  {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(GROUND_X, GROUND_Y + 1, GROUND_Z + 1);
    group.add(tubeGroup);
    rotateAroundAxis(p, tubeGroup, inDelay, 48, 3);

    for (let i = 0; i < 5; i += 1) {
      const tube = createTube(
        -0.9, 0, (-0.75 + (i * 0.3)),
        [[0, 0, 0], [1.8, 0, 0]], 0.015, 0x777777,
      );
      tubeGroup.add(tube);
    }
  }

  {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(GROUND_X, GROUND_Y + 1.5, GROUND_Z + 1);
    group.add(tubeGroup);
    rotateAroundAxis(p, tubeGroup, inDelay, 48, -3);

    for (let i = 0; i < 5; i += 1) {
      const tube = createTube(
        -0.9, 0, (-0.75 + (i * 0.3)),
        [[0, 0, 0], [1.8, 0, 0]], 0.015, 0x777777,
      );
      tubeGroup.add(tube);
    }
  }

  return group;
}
