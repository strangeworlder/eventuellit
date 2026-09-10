export interface SwipeInput {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  durationMs: number;
}

export interface SwipeOptions {
  /**
   * Minimum horizontal distance in pixels required to trigger a swipe.
   * Default: 100px.
   */
  minDistance?: number;
  /**
   * Maximum vertical movement in pixels allowed during the swipe.
   * Prevents vertical page scrolling from triggering a swipe.
   * Default: 75px.
   */
  maxVerticalDelta?: number;
  /**
   * Minimum ratio of horizontal displacement to vertical displacement.
   * Ensures the gesture is predominantly horizontal.
   * Default: 2.0.
   */
  minHorizontalRatio?: number;
  /**
   * Maximum duration in milliseconds for the gesture to count as a swipe.
   * Default: 500ms.
   */
  maxDurationMs?: number;
  /**
   * Minimum velocity in px/ms required for swipe.
   * Default: 0.2 px/ms.
   */
  minVelocity?: number;
}

export type SwipeDirection = "left" | "right";

/**
 * Detects whether a touch gesture is a deliberate horizontal swipe.
 * Returns "left" (swipe left -> move forward), "right" (swipe right -> move back),
 * or null if the gesture does not qualify as a valid horizontal swipe.
 */
export function detectSwipeDirection(
  input: SwipeInput,
  options: SwipeOptions = {},
): SwipeDirection | null {
  const {
    minDistance = 100,
    maxVerticalDelta = 75,
    minHorizontalRatio = 2.0,
    maxDurationMs = 500,
    minVelocity = 0.2,
  } = options;

  const { startX, startY, endX, endY, durationMs } = input;

  if (durationMs > maxDurationMs || durationMs <= 0) {
    return null;
  }

  const deltaX = startX - endX;
  const deltaY = startY - endY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  // Must exceed minimum horizontal distance
  if (absX < minDistance) {
    return null;
  }

  // Must not exceed maximum vertical drift
  if (absY > maxVerticalDelta) {
    return null;
  }

  // Horizontal motion must clearly dominate vertical motion
  if (absX < absY * minHorizontalRatio) {
    return null;
  }

  // Velocity must meet minimum threshold
  const velocity = absX / durationMs;
  if (velocity < minVelocity) {
    return null;
  }

  // deltaX > 0: startX > endX -> finger swiped to the left
  // deltaX < 0: startX < endX -> finger swiped to the right
  return deltaX > 0 ? "left" : "right";
}
