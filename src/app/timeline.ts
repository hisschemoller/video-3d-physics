import { Tween } from '@app/tween';

export interface Timeline {
  add: (tween: Tween) => void;
  update: (time: number) => Promise<boolean[]>;
}

interface TimelineParams {
  duration: number;
  onStart?: () => void | undefined;
  onRepeat?: () => void | undefined;
}

export default function createTimeline({
  duration = 1,
}: TimelineParams): Timeline {
  const tweens: Tween[] = [];

  const add = (tween: Tween) => {
    tweens.push(tween);
  };

  const update = async (time: number) => {
    const position = time % duration;
    const progress = position / duration;
    const promises = tweens.reduce((accumulator, tween) => {
      const promise = tween.update(position, progress);
      return (promise === undefined) ? accumulator : [...accumulator, promise];
    }, [] as Promise<boolean>[]);
    return Promise.all(promises);
  };

  return { add, update };
}
