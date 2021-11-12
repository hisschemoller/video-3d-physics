export interface Tween {
  isActive: boolean;
  update: Function;
}

interface TweenParams {
  delay?: number;
  duration: number;
  easeAmount?: number;
  onComplete?: Function | undefined;
  onStart?: Function | undefined;
  onUpdate?: Function | undefined;
}

/**
 * Mimics the simple -100 to 100 easing in Adobe Flash/Animate.
 * @link https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and
 * direction of the ease.
 */
const getEasefunction = (amount: number) => {
  let eAmount = amount;
  if (eAmount < -1) eAmount = -1;
  else if (eAmount > 1) eAmount = 1;
  return (t: number) => {
    if (eAmount === 0) { return t; }
    if (amount < 0) { return t * (t * -amount + 1 + amount); }
    return t * ((2 - t) * amount + (1 - amount));
  };
};

export default function createTween({
  delay = 0,
  duration = 1,
  easeAmount = 0,
  onComplete,
  onStart,
  onUpdate,
}: TweenParams): Tween {
  let isActive = false;
  const easeFuntion = getEasefunction(easeAmount);

  const update = (timelinePosition: number) => {
    const wasActive = isActive;
    isActive = timelinePosition > delay && timelinePosition <= delay + duration;
    // TODO: start en complete als tween de hele tijd duurt
    if (onStart && !wasActive && isActive) {
      onStart();
    }
    if (onUpdate && isActive) {
      const progress = easeFuntion((timelinePosition - delay) / duration);
      onUpdate(progress);
    }
    if (onComplete && wasActive && !isActive) {
      onComplete();
    }
  };

  return { isActive, update };
}
