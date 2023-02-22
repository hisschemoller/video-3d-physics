import { THREE } from 'enable3d';

function createBox(size = 0.5, color = 0x666666) {
  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(size, size, size),
    new THREE.MeshPhongMaterial({
      side: THREE.FrontSide, color, transparent: true, opacity: 1,
    }),
  );
  return box;
}

export default class BoxCache {
  boxSize: number;

  cache: THREE.Mesh[];

  index: number;

  numBoxes: number;

  constructor(boxSize: number, numBoxes = 8) {
    this.boxSize = boxSize;
    this.cache = [];
    this.index = 0;
    this.numBoxes = numBoxes;
    this.create();
  }

  create() {
    for (let i = 0; i < this.numBoxes; i += 1) {
      this.cache.push(createBox(this.boxSize));
    }
  }

  getNext() {
    this.index = (this.index + 1) % this.numBoxes;
    return this.cache[this.index];
  }
}
