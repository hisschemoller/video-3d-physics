export interface Tween {
  isActive: boolean;
  update: (timelinePosition: number, progress?: number) => Promise<void> | void | undefined;
}

interface TweenParams {
  delay?: number;
  duration: number;
  easeAmount?: number;
  onComplete?: () => void | undefined;
  onStart?: () => void | undefined;
  onUpdate?: (progress: number) => (Promise<void> | void) | undefined;
}

/**
 * Mimics the simple -100 to 100 easing in Adobe Flash/Animate.
 * @link https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and
 * direction of the ease.
 */
const getEasefunction = (amount: number) => {
  const eAmount = Math.max(-1, Math.min(amount, 1));
  if (eAmount === 0) {
    return (t: number) => t;
  }
  if (eAmount < 0) {
    return (t: number) => t * (t * -amount + 1 + amount);
  }
  return (t: number) => t * ((2 - t) * amount + (1 - amount));
};

export default function createTween({
  delay = 0,
  duration = 1,
  easeAmount = 0,
  onComplete,
  onStart,
  onUpdate,
}: TweenParams): Tween {
  const easeFunction = getEasefunction(easeAmount);
  let isActive = false;
  let progressOffset = 0;

  const update = (timelinePosition: number): Promise<void> | void | undefined => {
    let result: Promise<void> | void | undefined;
    const wasActive = isActive;
    isActive = timelinePosition > delay && timelinePosition <= delay + duration;
    // TODO: start en complete als tween de hele tijd duurt
    if (onStart && !wasActive && isActive) {
      progressOffset = (timelinePosition - delay) / duration;
      onStart();
    }
    if (onUpdate && isActive) {
      const progress = easeFunction(((timelinePosition - delay) / duration) - progressOffset);
      result = onUpdate(progress);
    }
    if (onComplete && wasActive && !isActive) {
      onComplete();
    }
    return result;
  };

  return { isActive, update };
}
