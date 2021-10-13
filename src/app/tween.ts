
export interface Tween {
  isActive: boolean;
  update: Function;
};

interface TweenParams {
  delay: number;
  duration: number;
  onComplete?: Function | undefined;
  onStart?: Function | undefined;
  onUpdate?: Function | undefined;
};

export default function createTween({
  delay = 0,
  duration = 1,
  onComplete,
  onStart,
  onUpdate,
}: TweenParams): Tween {
  let isActive = false;

  const update = (timelinePosition: number, timelineProgress: number) => {
    const wasActive = isActive;
    isActive = timelinePosition > delay && timelinePosition <= delay + duration;
    if (onStart && !wasActive && isActive) {
      onStart();
    }
    if (onUpdate && isActive) {
      const progress = (timelinePosition - delay) / duration;
      onUpdate(progress);
    }
    if (onComplete && wasActive && !isActive) {
      onComplete();
    }
  };
  
  return { isActive, update };
}
