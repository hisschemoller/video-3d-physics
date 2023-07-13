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
}
