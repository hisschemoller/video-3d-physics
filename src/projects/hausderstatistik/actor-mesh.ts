import { ExtendedMesh, THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix4 } from '@app/utils';

export const BASE_COLOR = 0xD6C49C;

/**
 * Create 3D box.
 */
export function createRectangle(
  width: number,
  height: number,
  texture : THREE.Texture,
  depth = 0.02,
) {
  const geometry = new THREE.BoxGeometry(width, height, depth);

  // move registration point to left top corner
  geometry.translate(width * 0.5, height * -0.5, 0);
  geometry.groups.forEach((group, index) => {
    // set index so that only the front has index 1
    /* eslint-disable no-param-reassign */
    group.materialIndex = index === 4 ? 1 : 0;
  });
  const materials = [
    new THREE.MeshPhongMaterial({
      color: BASE_COLOR,
      opacity: 1,
      transparent: false,
      side: THREE.FrontSide,
    }),
    new THREE.MeshPhongMaterial({
      map: texture,
      opacity: 1,
      transparent: false,
      side: THREE.FrontSide,
      shininess: 0,
    }),
  ];
  const mesh = new ExtendedMesh(geometry, materials);
  return mesh;
}

/**
 * Create ExtrudeGeometry from Shape.
 */
function createMeshFromShape(
  shape: THREE.Shape,
  scale: number,
  depth: number,
  color: number,
  texture?: THREE.Texture,
) {
  const surface = texture ? { map: texture } : { color };
  const materials = [
    new THREE.MeshPhongMaterial({
      color,
      flatShading: false,
      opacity: 1,
      side: THREE.BackSide,
      transparent: true,
    }),
    new THREE.MeshPhongMaterial({
      ...surface,
      flatShading: false,
      opacity: 1,
      side: THREE.BackSide,
      transparent: true,
    }),
  ];
  const geometry = new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: false,
    depth,
  });
  geometry.groups.forEach((group, index) => {
    group.materialIndex = index === 0 ? 1 : 0;
  });
  geometry.applyMatrix4(getMatrix4({
    sx: scale,
    sy: scale * -1,
  }));
  geometry.computeVertexNormals();
  const mesh = new ExtendedMesh(geometry, materials);
  return mesh;
}

/**
 * Create Mesh from points.
 */
export function createMeshFromPoints(
  points: [number, number][],
  texture?: THREE.Texture,
  depth: number = 0.02,
  color: number = BASE_COLOR,
) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  const mesh = createMeshFromShape(shape, 1, depth, color, texture);
  return mesh;
}

/**
 * Load SVG file and create extrude from it.
 */
export function createSVG(
  svgUrl: string,
  svgScale: number,
  texture?: THREE.Texture,
  depth: number = 0.02,
  color: number = BASE_COLOR,
) {
  return new Promise<ExtendedMesh>(
    (resolve, reject) => {
      new SVGLoader().load(
        svgUrl,
        (data) => {
          const { paths } = data;
          paths.forEach((path) => {
            const shapes = SVGLoader.createShapes(path);
            if (shapes.length > 0) {
              const shape = shapes[0];
              const mesh = createMeshFromShape(shape, svgScale, depth, color, texture);
              resolve(mesh);
            }
          });
        },
        () => {},
        () => {
          reject();
        },
      );
    },
  );
}
