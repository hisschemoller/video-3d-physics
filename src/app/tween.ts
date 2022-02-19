export interface Tween {
  update: (
    time: number, delta: number, timelineDuration: number) => Promise<void> | void | undefined;
}

/**
 * @link https://easings.net/
 */
export const Ease = {
  linear: (progress: number) => progress,
  cubicIn: (progress: number) => 1 - progress * progress * progress,
  cubicInOut: (progress: number) => (
    progress < 0.5 ? 4 * progress * progress * progress : 1 - ((-2 * progress + 2) ** 3) / 2),
  cubicOut: (progress: number) => 1 - ((1 - progress) ** 3),
  sineIn: (progress: number) => 1 - Math.cos((Math.PI * progress) / 2),
  sineInOut: (progress: number) => -(Math.cos(Math.PI * progress) - 1) / 2,
  sineOut: (progress: number) => Math.sin((Math.PI * progress) / 2),
};

interface TweenParams {
  delay?: number;
  duration: number;
  ease?: keyof typeof Ease,
  easeAmount?: number;
  onComplete?: () => void | undefined;
  onStart?: () => void | undefined;
  onUpdate?: (progress: number, percentage: number) => (Promise<void> | void) | undefined;
}

/**
 * Mimics the simple -100 to 100 easing in Macromedia / Adobe Flash / Animate.
 * @link https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and
 * direction of the ease.
 */
// const getEasefunction = (amount: number) => {
//   const eAmount = Math.max(-1, Math.min(amount, 1));
//   if (eAmount === 0) {
//     return (t: number) => t;
//   }
//   if (eAmount < 0) {
//     return (t: number) => t * (t * -amount + 1 + amount);
//   }
//   return (t: number) => t * ((2 - t) * amount + (1 - amount));
// };

export default function createTween({
  delay = 0,
  duration = 1,
  ease,
  onComplete,
  onStart,
  onUpdate,
}: TweenParams): Tween {
  const easeFunction = ease ? Ease[ease] : Ease.linear;
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
    const shouldComplete = isStart && !isComplete;
    // if the tween end (localEnd) is close to timelineDuration, then it can happen that localTime
    // jumps back to the start of the tween before the end is detected
    const restartBeforeComplete = isActive
      && localTime >= localEnd - timelineDuration
      && localTime - delta < localEnd - timelineDuration;
    if (onComplete && (isComplete || shouldComplete || restartBeforeComplete)) {
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
      const percentage = (currentPosition - startPosition) / duration;
      const progress = easeFunction(percentage);
      result = onUpdate(progress, percentage);
    }
    return result;
  };

  return { update };
}
