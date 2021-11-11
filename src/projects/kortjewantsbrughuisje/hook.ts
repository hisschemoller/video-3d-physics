import { THREE } from 'enable3d';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { getMatrix } from '@app/utils';
import createTween from '@app/tween';
import { ProjectSettings } from './interfaces';

interface HookArgs {
  x: number;
  y: number;
  z: number;
  angleY: number;
  angleZ: number;
  phase?: number;
  duration: number;
  svgUrl: string;
  svgScale: number;
}

const DOUBLE_PI = Math.PI * 2;

export default function createHook(
  {
    scene3d,
    timeline,
  }: ProjectSettings,
  {
    x,
    y,
    z,
    angleY,
    angleZ,
    phase = 0,
    duration,
    svgUrl,
    svgScale,
  }: HookArgs,
) {
  return new Promise<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhongMaterial[]>>(
    (resolve, reject) => {
      new SVGLoader().load(
        svgUrl,
        (data) => {
          const { paths } = data;
          paths.forEach((path) => {
            const materials = [
              new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.BackSide }),
              new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.BackSide }),
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
              geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(geometry, materials);
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.applyMatrix4(getMatrix({
                x,
                y,
                z,
                sx: svgScale,
                sy: svgScale * -1,
                ry: -0.03,
              }));
              scene3d.scene.add(mesh);

              const tween = createTween({
                duration,
                onUpdate: (progress: number) => {
                  const phasedProgress = (progress + phase) % 1;
                  mesh.rotation.y = Math.cos(phasedProgress * DOUBLE_PI) * angleY;
                  mesh.rotation.z = Math.PI + (Math.cos(phasedProgress * DOUBLE_PI) * angleZ);
                  mesh.position.x = x + (Math.cos(phasedProgress * DOUBLE_PI) * 0.1);
                  mesh.position.y = y + (Math.sin(phasedProgress * DOUBLE_PI) * 0.1);
                },
              });
              timeline.add(tween);
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
