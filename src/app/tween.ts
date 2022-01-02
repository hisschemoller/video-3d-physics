export interface Tween {
  isActive: boolean;
  update: (
    time: number, delta: number, timelineDuration: number) => Promise<void> | void | undefined;
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
  let startPosition = 0;
  let currentPosition = 0;

  const update = (
    time: number, delta: number, timelineDuration: number,
  ): Promise<void> | void | undefined => {
    let result: Promise<void> | void | undefined;
    const localTime = time % timelineDuration;
    const localEnd = (delay + duration) % timelineDuration;
    const isStart = localTime >= delay && localTime - delta < delay;
    const isComplete = localTime >= localEnd && localTime - delta < localEnd;
    if (onComplete && isComplete) {
      isActive = false;
      onComplete();
    }
    if (onStart && isStart) {
      isActive = true;
      startPosition = time;
      currentPosition = time;
      onStart();
    }
    if (onUpdate && isActive) {
      currentPosition += delta;
      const progress = easeFunction((currentPosition - startPosition) / duration);
      result = onUpdate(progress);
    }
    return result;
  };

  return { isActive, update };
}
