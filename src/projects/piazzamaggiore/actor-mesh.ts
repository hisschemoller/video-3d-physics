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
  return new Promise<ExtendedMesh>((resolve) => {
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
        transparent: true,
        side: THREE.FrontSide,
      }),
      new THREE.MeshPhongMaterial({
        map: texture,
        opacity: 1,
        transparent: true,
        side: THREE.FrontSide,
        shininess: 0,
      }),
    ];
    const mesh = new ExtendedMesh(geometry, materials);
    resolve(mesh);
  });
}

/**
 * Load SVG file and create extrude from it.
 */
export function createSVG(
  svgUrl: string,
  svgScale: number,
  texture?: THREE.Texture,
  depth: number = 0.02,
) {
  return new Promise<ExtendedMesh>(
    (resolve, reject) => {
      new SVGLoader().load(
        svgUrl,
        (data) => {
          const { paths } = data;

          paths.forEach((path) => {
            const materials = [
              new THREE.MeshPhongMaterial({
                color: BASE_COLOR,
                opacity: 0,
                transparent: false,
                side: THREE.BackSide,
              }),
              new THREE.MeshPhongMaterial({
                map: texture,
                opacity: 1,
                transparent: false,
                side: THREE.BackSide,
              }),
            ];

            const shapes = SVGLoader.createShapes(path);
            if (shapes.length > 0) {
              const shape = shapes[0];
              const geometry = new THREE.ExtrudeGeometry(shape, {
                bevelEnabled: false,
                depth,
              });
              geometry.groups.forEach((group, index) => {
                group.materialIndex = index === 0 ? 1 : 0;
              });
              geometry.applyMatrix4(getMatrix4({
                sx: svgScale,
                sy: svgScale * -1,
              }));
              geometry.computeVertexNormals();
              const mesh = new ExtendedMesh(geometry, materials);
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
