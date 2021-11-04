import { THREE } from 'enable3d';

export interface MatrixConfig {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  sx?: number;
  sy?: number;
  sz?: number;
}

/**
 * Create matrix from rotation, scale and position.
 * @param {MatrixConfig} [conf={}]
 * @returns {Matrix4}
 */
export function getMatrix(config: MatrixConfig = {}) {
  const {
    x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0,
  } = config;
  const scaleMatrix = new THREE.Matrix4().makeScale(sx, sy, sz);
  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
  const matrix4 = new THREE.Matrix4().multiplyMatrices(scaleMatrix, rotationMatrix);
  matrix4.setPosition(x, y, z);
  return matrix4;
}

export function logBoundingBox(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox?.getSize(size);
}
