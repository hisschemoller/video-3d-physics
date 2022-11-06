import { THREE } from 'enable3d';
import { ProjectSettings, VideoData } from '@app/interfaces';
import { getMatrix4 } from '@app/utils';
import createTween from '@app/tween';
import { createActor } from './actor';

async function createMosaicPiece(
  projectSettings: ProjectSettings,
  video: VideoData,
  videoStart: number,
  points: [number, number][],
  x3d: number,
  y3d: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { patternDuration, timeline } = projectSettings;
  const actor = await createActor(
    projectSettings,
    video,
    {
      depth: 2,
      points,
      imageRect: { w, h },
    },
  );
  actor.setStaticPosition(getMatrix4({ x: x3d, y: y3d, z: -2 }));
  actor.addTween({
    delay: 0.01,
    duration: patternDuration,
    videoStart: videoStart - 4,
    fromImagePosition: new THREE.Vector2(x, y),
  });
  const offset = Math.random() * (patternDuration / 2.2);
  for (let i = 0; i < 2; i += 1) {
    timeline.add(createTween({
      delay: offset + (patternDuration * i * 0.5),
      duration: patternDuration * 0.4999,
      ease: 'sineInOut',
      onComplete: () => {},
      onStart: () => {},
      onUpdate: (progress: number) => {
        const prog = i % 2 === 0 ? progress : 1 - progress;
        actor.getMesh().position.z = -2 + (prog * 2);
      },
    }));
  }
}

// eslint-disable-next-line class-methods-use-this
export default async function createMosaic(
  projectSettings: ProjectSettings,
  videos: { [key: string]: VideoData },
) {
  await createMosaicPiece( // BOVEN 1
    projectSettings, videos.main, 110,
    [[0, 0], [4, 0], [4, 2], [2, 3], [0, 3]],
    -8, 4.5, 0, 0, 480, 360,
  );

  await createMosaicPiece( // BOVEN 2
    projectSettings, videos.main, 100,
    [[0, 0], [4, 0], [4, 2], [0, 2]],
    -4, 4.5, 480, 0, 360, 240,
  );

  await createMosaicPiece( // BOVEN 3
    projectSettings, videos.main, 70,
    [[0, 0], [6, 0], [6, 1], [0, 1]],
    0, 4.5, 960, 0, 720, 120,
  );

  await createMosaicPiece( // BOVEN 4
    projectSettings, videos.main, 10,
    [[0, 0], [2, 0], [2, 3], [0, 2]],
    6, 4.5, 1680, 0, 240, 360,
  );

  await createMosaicPiece( // HOOG 1
    projectSettings, videos.main, 40,
    [[0, 1], [2, 0], [6, 0], [6, 2], [4, 3]],
    -6, 2.5, 240, 240, 720, 360,
  );

  await createMosaicPiece( // HOOG 2
    projectSettings, videos.main, 40,
    [[0, 1], [2, 0], [6, 0], [6, 2], [4, 3]],
    -6, 2.5, 240, 240, 720, 360,
  );

  await createMosaicPiece( // HOOG 3
    projectSettings, videos.main, 80,
    [[0, 0], [6, 0], [0, 3]],
    0, 3.5, 960, 120, 720, 360,
  );

  await createMosaicPiece( // HOOG 4
    projectSettings, videos.main, 20,
    [[0, 2], [4, 0], [4, 2]],
    2, 3.5, 1200, 120, 480, 240,
  );

  await createMosaicPiece( // HOOG 5
    projectSettings, videos.main, 60,
    [[0, 0], [2, 1], [2, 2], [0, 1]],
    6, 2.5, 1680, 240, 240, 240,
  );

  await createMosaicPiece( // MIDDEN 1
    projectSettings, videos.main, 90,
    [[0, 0], [2, 0], [6, 2], [6, 3]],
    -8, 1.5, 0, 360, 720, 360,
  );

  await createMosaicPiece( // MIDDEN 2
    projectSettings, videos.main, 55,
    [[0, 2], [4, 0], [4, 2], [0, 4]],
    -2, 1.5, 720, 360, 480, 480,
  );

  await createMosaicPiece( // MIDDEN 3
    projectSettings, videos.main, 35,
    [[0, 0], [4, 0], [4, 2], [0, 2]],
    2, 1.5, 1200, 360, 480, 240,
  );

  await createMosaicPiece( // MIDDEN 4
    projectSettings, videos.main, 105,
    [[0, 0], [2, 1], [2, 2], [0, 3]],
    6, 1.5, 1680, 360, 240, 360,
  );

  await createMosaicPiece( // LAAG 1
    projectSettings, videos.main, 75,
    [[0, 0], [2, 1], [2, 4], [0, 4]],
    -8, 1.5, 0, 360, 240, 480,
  );

  await createMosaicPiece( // LAAG 2
    projectSettings, videos.main, 126,
    [[0, 0], [4, 2], [4, 3], [0, 3]],
    -6, 0.5, 240, 480, 480, 360,
  );

  await createMosaicPiece( // LAAG 3
    projectSettings, videos.main, 15,
    [[0, 2], [4, 0], [4, 2]],
    -2, -0.5, 720, 600, 480, 240,
  );

  await createMosaicPiece( // LAAG 4
    projectSettings, videos.main, 45,
    [[0, 0], [4, 0], [4, 3], [0, 3]],
    2, -0.5, 1200, 600, 480, 360,
  );

  await createMosaicPiece( // LAAG 5
    projectSettings, videos.main, 65,
    [[0, 1], [2, 0], [2, 3], [0, 3]],
    6, -0.5, 1680, 600, 240, 360,
  );

  await createMosaicPiece( // ONDER 1
    projectSettings, videos.main, 5,
    [[0, 0], [2, 0], [1, 2], [0, 2]],
    -8, -2.5, 0, 840, 240, 240,
  );

  await createMosaicPiece( // ONDER 2
    projectSettings, videos.main, 105,
    [[0, 2], [1, 0], [2, 2]],
    -7, -2.5, 120, 840, 240, 240,
  );

  await createMosaicPiece( // ONDER 3
    projectSettings, videos.main, 68,
    [[0, 0], [2, 0], [3, 2], [1, 2]],
    -6, -2.5, 240, 840, 360, 240,
  );

  await createMosaicPiece( // ONDER 4
    projectSettings, videos.main, 32,
    [[0, 0], [4, 0], [4, 2], [1, 2]],
    -4, -2.5, 480, 840, 480, 240,
  );

  await createMosaicPiece( // ONDER 5
    projectSettings, videos.main, 48,
    [[0, 0], [2, 0], [2, 2], [0, 2]],
    0, -2.5, 960, 840, 240, 240,
  );

  await createMosaicPiece( // ONDER 6
    projectSettings, videos.main, 74,
    [[0, 0], [6, 0], [6, 1], [0, 1]],
    2, -3.5, 1200, 960, 720, 120,
  );
}
