import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix4 } from '@app/utils';

const BASE_COLOR = 0x6c645f;

/**
 * Create 3D box.
 */
export function createRectangle(
  width: number,
  height: number,
  texture : THREE.Texture,
) {
  return new Promise<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial[]>>((resolve) => {
    const geometry = new THREE.BoxGeometry(width, height, 0.02);
    geometry.groups.forEach((group, index) => {
      /* eslint-disable no-param-reassign */
      group.materialIndex = index === 4 ? 1 : 0;
    });
    const materials = [
      new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide }),
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    resolve(mesh);
  });
}

/**
 * Load SVG file and create extrude from it.
 */
export function createSVG(
  svgUrl: string,
  svgScale: number,
  svgX3d: number,
  svgY3d: number,
  texture : THREE.Texture,
  viewport3dWidth: number,
  viewport3dHeight: number,
) {
  return new Promise<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhongMaterial[]>>(
    (resolve, reject) => {
      new SVGLoader().load(
        svgUrl,
        (data) => {
          const { paths } = data;

          paths.forEach((path) => {
            const materials = [
              new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.BackSide }),
              new THREE.MeshPhongMaterial({ map: texture, side: THREE.BackSide }),
            ];

            const shapes = SVGLoader.createShapes(path);
            if (shapes.length > 0) {
              const shape = shapes[0];
              const geometry = new THREE.ExtrudeGeometry(shape, {
                bevelEnabled: false,
                depth: 0.02,
              });
              geometry.groups.forEach((group, index) => {
                /* eslint-disable no-param-reassign */
                group.materialIndex = index === 0 ? 1 : 0;
              });
              geometry.applyMatrix4(getMatrix4({
                x: (viewport3dWidth * -0.5) + svgX3d,
                y: (viewport3dHeight * 0.5) - svgY3d,
                sx: svgScale,
                sy: svgScale * -1,
              }));
              geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(geometry, materials);
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
