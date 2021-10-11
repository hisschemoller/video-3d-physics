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
}: TimelineParams): Timeline {
  const repeat = true;
  const tweens: Tween[] = [];

  const add = function(tween: Tween) {
    tweens.push(tween);
  }

  const update = function(time: number, delta: number) {
    const position = time % duration;
    const progress = position / duration;
    tweens.forEach((tween) => tween.update(position, progress));
  }

  return { add, update };
}
