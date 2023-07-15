/* eslint-disable object-curly-newline */
import { THREE } from 'enable3d';
import { createSVG } from './actor-mesh';

export default async function createAntenna(
  building: THREE.Mesh,
  svgFileName: string,
  x: number = 0,
  y: number = 0,
  z: number = 0,
  color: number = 0x81A1B8,
  scale: number = 0.003,
  rotateY: number = 0,
) {
  const svgUrl = `../assets/projects/piazzatrentoetrieste/${svgFileName}.svg`;
  const antenna = await createSVG(svgUrl, scale, undefined, 0.01, color);
  antenna.position.set(x, y, z);
  antenna.rotateY(rotateY);
  building.add(antenna);
  return antenna;
}

export async function createFlagPole(
  building: THREE.Mesh,
  svgFileName: string,
  x: number = 0,
  y: number = 0,
  z: number = 0,
  scale: number = 0.003,
) {
  const antenna = await createAntenna(building, svgFileName, x, y, z, 0xffffff, scale, Math.PI / 2);

  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshPhongMaterial({ color: 0xcc7700 }),
  );
  antenna.add(top);

  // const wimpel = await createAntenna(antenna, 'wimpel', 0, -0.1, 0, 0xffccaa, 0.01, Math.PI);
}
