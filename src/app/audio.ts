import { THREE } from 'enable3d';

let sound: THREE.Audio;

export function playSound(url: string) {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(url, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
}

export function setupAudio(camera: THREE.Camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
}
