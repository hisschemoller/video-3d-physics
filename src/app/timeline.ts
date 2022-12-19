import { Tween } from '@app/tween';

export interface Timeline {
  add: (tween: Tween) => void;
  getDuration: () => number;
  update: (time: number, delta: number) => Promise<void[]>;
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

  const getDuration = () => duration;

  const update = async (time: number, delta: number) => {
    const promises = tweens.reduce((accumulator, tween) => {
      const promise = tween.update(time, delta, duration);
      return (promise === undefined) ? accumulator : [...accumulator, promise];
    }, [] as Promise<void>[]);
    return Promise.all(promises);
  };

  return { add, getDuration, update };
}
