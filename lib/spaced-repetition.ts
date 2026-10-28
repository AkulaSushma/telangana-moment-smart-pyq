export type QueueState = {
  intervalDays: number;
  streak: number;
  ease: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function updateQueueOnWrong(_previous: QueueState | null, now = Date.now()) {
  return {
    intervalDays: 1,
    streak: 0,
    ease: 2.1,
    nextReviewAt: now + DAY_MS,
  };
}

export function updateQueueOnCorrect(previous: QueueState, now = Date.now()) {
  const streak = previous.streak + 1;
  const ease = Math.min(2.8, previous.ease + 0.05);
  const intervalDays = streak === 1 ? 1 : Math.max(1, Math.round(previous.intervalDays * ease));
  const mastered = streak >= 3;

  return {
    intervalDays,
    streak,
    ease,
    mastered,
    nextReviewAt: now + intervalDays * DAY_MS,
  };
}
