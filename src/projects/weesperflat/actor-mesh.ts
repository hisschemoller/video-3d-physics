import { ExtendedMesh, THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix4 } from '@app/utils';

export const BASE_COLOR = 0x6c645f;

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
      /* eslint-disable no-param-reassign */
      group.materialIndex = index === 4 ? 1 : 0;
    }); 
    const materials = [
      new THREE.MeshPhongMaterial({ color: BASE_COLOR, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide }),
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
  xVP: number,
  yVP: number,
  texture : THREE.Texture,
  viewport3dWidth: number,
  viewport3dHeight: number,
  depth = 0.02,
  alignWithViewport = true,
) {
  return new Promise<ExtendedMesh>(
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
                depth,
              });
              geometry.groups.forEach((group, index) => {
                group.materialIndex = index === 0 ? 1 : 0;
              });
              geometry.applyMatrix4(getMatrix4({
                x: alignWithViewport ? (viewport3dWidth * -0.5) + xVP : 0,
                y: alignWithViewport ? (viewport3dHeight * 0.5) + yVP : 0,
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
