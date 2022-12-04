import { THREE } from 'enable3d';

let sound: THREE.Audio;
let url: string;

export function playSound(audiofileUrl: string | undefined = undefined) {
  if (audiofileUrl) {
    url = audiofileUrl;
  }

  if (url) {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
  }
}

export function setupAudio(camera: THREE.Camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
}

export function pauseSound() {
  sound.pause();
}
