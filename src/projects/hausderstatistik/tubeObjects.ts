import { THREE } from 'enable3d';

// eslint-disable-next-line import/prefer-default-export
export function createTestTube(
  x: number,
  y: number,
  z: number,
  color: number,
) {
  const curve = [[0, 0, 0], [4, -0.2, 0.2], [6, -0.5, 0.5]];
  const points = curve.map((curveItem) => new THREE.Vector3(...curveItem));
  const curve3 = new THREE.CatmullRomCurve3(points);

  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve3, 40, 0.05, 4, false),
    new THREE.MeshPhongMaterial({ color }),
  );
  tube.castShadow = true;
  tube.receiveShadow = true;
  tube.position.set(x, y, z);
  return tube;
}
