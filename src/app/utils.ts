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
 * Get the angle between two coordinates.
 */
export function getAngleRadians(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1);
}
export function getAngleDegrees(x1: number, y1: number, x2: number, y2: number) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}


/**
 * Create matrix from rotation, scale and position.
 */
export function getMatrix4(config: MatrixConfig = {}) {
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
  console.log(
    `Bounding box w: ${size.x.toFixed(3)}, h: ${size.y.toFixed(3)}, d: ${size.z.toFixed(3)}`,
  );
}

/**
 * Create blob from image URI.
 */
export function dataURIToBlob(dataURI: string): Blob {
  const binStr = window.atob(dataURI.split(',')[1]);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new window.Blob([arr]);
}

/**
 * Create filename.
 */
export function defaultFileName(ext: string) {
  const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
  return str.replace(/\//g, '-').replace(/:/g, '.');
}
