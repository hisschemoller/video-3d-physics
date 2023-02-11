import { THREE } from 'enable3d';
import { ProjectSettings } from '@app/interfaces';
import { getMatrix4, MatrixConfig } from '@app/utils';
import addMatrix4Tween from './matrix4Tween';

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

function createTestBox(
  x: number,
  y: number,
  z: number,
  color: number,
) {
  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
    new THREE.MeshPhongMaterial({ color }),
  );
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.set(x, y, z);
  return box;
}

/**
 * 1
 */
export async function createRotatingGroup1(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const group = createRotatingGroup(p, {
    inDelay: 4,
    inFrom: { x: -2.5, z: -5, ry: -0.2 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 36,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: -2.5, z: -5, ry: -0.2 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, 8 - 1, -7.2, 9.5);
  group.add(ground);

  const box = createTestBox(8 - 1, -7.2 + 0.7, 9.5, 0xff0000);
  group.add(box);

  return group;
}

/**
 * 2
 */
export async function createRotatingGroup2(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const group = createRotatingGroup(p, {
    inDelay: 36,
    inFrom: { x: 2, z: 5, ry: 1 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 68,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: 2, z: 5, ry: 1 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, 8 - 1, -7.2, 9.5);
  group.add(ground);

  const box = createTestBox(8 - 1, -7.2 + 0.7, 9.5, 0x00ff00);
  group.add(box);

  return group;
}

/**
 * 3
 */
export async function createRotatingGroup3(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const group = createRotatingGroup(p, {
    inDelay: 68,
    inFrom: { x: -2.5, z: -5, ry: -0.2 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 100,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: -2.5, z: -5, ry: -0.2 },
  });
  rootGroup.add(group);

  const ground = createShadowGround(4, 2, 8 - 1, -7.2, 9.5);
  group.add(ground);

  const box = createTestBox(8 - 1, -7.2 + 0.7, 9.5, 0x0000ff); // blauw
  group.add(box);

  return group;
}

/**
 * 4
 */
export async function createRotatingGroup4(
  p: ProjectSettings,
  rootGroup: THREE.Group,
) {
  const group = createRotatingGroup(p, {
    inDelay: 100,
    inFrom: { x: 4, z: 2, ry: 1 },
    inTo: { x: 0, z: 0, ry: 0 },
    outDelay: 4,
    outFrom: { x: 0, z: 0, ry: 0 },
    outTo: { x: 4, z: 2, ry: 1 },
  });
  rootGroup.add(group);

  const box = createTestBox(8 + 1, -7.2 + 0.7, 9.5, 0xeffff00);
  group.add(box);

  const ground = createShadowGround(4, 2, 8 + 1, -7.2, 9.5);
  group.add(ground);

  return group;
}
