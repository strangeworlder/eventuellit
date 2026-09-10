import { describe, expect, it } from "vitest";
import { detectSwipeDirection } from "./swipe";

describe("detectSwipeDirection", () => {
  it("detects a valid swipe to the left (forward)", () => {
    const result = detectSwipeDirection({
      startX: 300,
      startY: 200,
      endX: 180, // deltaX = +120
      endY: 210, // deltaY = -10 (abs = 10)
      durationMs: 250,
    });
    expect(result).toBe("left");
  });

  it("detects a valid swipe to the right (backward)", () => {
    const result = detectSwipeDirection({
      startX: 100,
      startY: 200,
      endX: 230, // deltaX = -130
      endY: 195, // deltaY = +5 (abs = 5)
      durationMs: 200,
    });
    expect(result).toBe("right");
  });

  it("rejects vertical scrolling gestures with minor horizontal drift", () => {
    // User scrolling down page, finger moves 300px down and drifts 70px horizontally
    const result = detectSwipeDirection({
      startX: 200,
      startY: 500,
      endX: 130, // deltaX = 70 (would have triggered previously with threshold 60!)
      endY: 200, // deltaY = 300
      durationMs: 300,
    });
    expect(result).toBeNull();
  });

  it("rejects diagonal gestures where vertical movement exceeds tolerance", () => {
    const result = detectSwipeDirection({
      startX: 300,
      startY: 200,
      endX: 150, // deltaX = 150 (large horizontal move)
      endY: 300, // deltaY = -100 (vertical drift > 75)
      durationMs: 250,
    });
    expect(result).toBeNull();
  });

  it("rejects gestures where horizontal movement does not dominate vertical movement (ratio < 2)", () => {
    const result = detectSwipeDirection({
      startX: 200,
      startY: 200,
      endX: 95, // deltaX = 105 (>= 100)
      endY: 140, // deltaY = 60 (<= 75, but ratio 105 / 60 < 2)
      durationMs: 250,
    });
    expect(result).toBeNull();
  });

  it("rejects small movements below minDistance threshold", () => {
    const result = detectSwipeDirection({
      startX: 200,
      startY: 200,
      endX: 140, // deltaX = 60 (< 100)
      endY: 200,
      durationMs: 200,
    });
    expect(result).toBeNull();
  });

  it("rejects slow drags exceeding maxDurationMs", () => {
    const result = detectSwipeDirection({
      startX: 300,
      startY: 200,
      endX: 150, // deltaX = 150
      endY: 200,
      durationMs: 600, // > 500ms
    });
    expect(result).toBeNull();
  });

  it("rejects low velocity movements", () => {
    // 100px over 490ms -> 0.204 px/ms (passes), but 100px over 550ms fails duration,
    // let's test velocity directly with custom options
    const result = detectSwipeDirection(
      {
        startX: 250,
        startY: 200,
        endX: 145, // deltaX = 105
        endY: 200,
        durationMs: 400, // velocity = 105/400 = 0.2625
      },
      { minVelocity: 0.5 },
    );
    expect(result).toBeNull();
  });

  it("rejects invalid durations (<= 0)", () => {
    const result = detectSwipeDirection({
      startX: 300,
      startY: 200,
      endX: 150,
      endY: 200,
      durationMs: 0,
    });
    expect(result).toBeNull();
  });
});
