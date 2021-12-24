import { THREE } from 'enable3d';

export function mergeBufferGeometries(
  geometries: THREE.BufferGeometry[], useGroups?: boolean): THREE.BufferGeometry;
export function mergeBufferAttributes(attributes: BufferAttribute[]): BufferAttribute;
export function interleaveAttributes(attributes: BufferAttribute[]): InterleavedBufferAttribute;
export function estimateBytesUsed(geometry: BufferGeometry): number;
export function mergeVertices(geometry: BufferGeometry, tolerance?: number): BufferGeometry;
export function toTrianglesDrawMode(
  geometry: BufferGeometry, drawMode: TrianglesDrawModes): BufferGeometry;
export function computeMorphedAttributes(object: Mesh | Line | Points): object;
