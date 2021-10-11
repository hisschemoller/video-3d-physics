import { Tween } from '@app/tween';

export interface Timeline {
  add: Function;
  update: Function;
};

interface TimelineParams {
  duration: number;
  onStart?: Function | undefined;
  onRepeat?: Function | undefined;
};

export default function createTimeline({
  duration = 1,
  onStart = undefined,
  onRepeat = undefined,
}: TimelineParams): Timeline {
  const repeat = true;
  const tweens: Tween[] = [];

  const add = function(tween: Tween) {
    tweens.push(tween);
  }

  const update = function(time: number, delta: number) {
    const progress = (time % duration) / duration;
    tweens.forEach((tween) => tween.update(progress));
  }

  return { add, update };
}
