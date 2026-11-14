// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Card } from "./Card";

function ensurePointerEventPolyfill() {
  if (typeof window.PointerEvent !== "undefined") {
    return;
  }
  class JsdomPointerEvent extends MouseEvent {
    readonly pointerType: string;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerType = params.pointerType ?? "";
    }
  }
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    writable: true,
    value: JsdomPointerEvent,
  });
}

describe("useSurfaceSpotlight integration via Card", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    ensurePointerEventPolyfill();
  });

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("tracks mouse spotlight on interactive cards and clears on leave", async () => {
    const onPointerEnter = vi.fn();
    const onPointerMove = vi.fn();
    const onPointerLeave = vi.fn();

    render(
      <Card
        variant="interactive"
        data-testid="interactive-card"
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        Kortin sisältö
      </Card>,
    );

    const card = screen.getByTestId("interactive-card");
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 210,
      bottom: 120,
      width: 200,
      height: 100,
      toJSON: () => ({}),
    });

    fireEvent.pointerEnter(card, { clientX: 50, clientY: 45, pointerType: "mouse" });

    expect(onPointerEnter).toHaveBeenCalledTimes(1);
    expect(card.dataset.spotlightActive).toBe("true");
    expect(card.style.getPropertyValue("--spotlight-x")).toBe("40px");
    expect(card.style.getPropertyValue("--spotlight-y")).toBe("25px");

    fireEvent.pointerMove(card, { clientX: 110, clientY: 70, pointerType: "mouse" });
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });

    expect(onPointerMove).toHaveBeenCalledTimes(1);
    expect(card.style.getPropertyValue("--spotlight-x")).toBe("100px");
    expect(card.style.getPropertyValue("--spotlight-y")).toBe("50px");

    fireEvent.pointerLeave(card, { pointerType: "mouse" });
    expect(onPointerLeave).toHaveBeenCalledTimes(1);
    expect(card.dataset.spotlightActive).toBeUndefined();
  });

  it("ignores non-mouse pointers such as touch", () => {
    render(
      <Card variant="interactive" data-testid="touch-card">
        Kosketuskortti
      </Card>,
    );

    const card = screen.getByTestId("touch-card");
    fireEvent.pointerEnter(card, { clientX: 40, clientY: 40, pointerType: "touch" });
    fireEvent.pointerMove(card, { clientX: 60, clientY: 60, pointerType: "touch" });

    expect(card.dataset.spotlightActive).toBeUndefined();
    expect(card.style.getPropertyValue("--spotlight-x")).toBe("");
  });

  it("ignores pointer tracking when prefers-reduced-motion is active", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <Card variant="interactive" data-testid="reduced-motion-card">
        Kortti
      </Card>,
    );

    const card = screen.getByTestId("reduced-motion-card");
    fireEvent.pointerEnter(card, { clientX: 50, clientY: 50, pointerType: "mouse" });

    expect(card.dataset.spotlightActive).toBeUndefined();
  });

  it("does not activate spotlight on non-interactive outline cards", () => {
    render(
      <Card variant="outline" data-testid="outline-card">
        Staattinen kortti
      </Card>,
    );

    const card = screen.getByTestId("outline-card");
    fireEvent.pointerEnter(card, { clientX: 50, clientY: 50, pointerType: "mouse" });

    expect(card.dataset.spotlightActive).toBeUndefined();
    expect(card.className).toContain("ds-luminous-surface");
  });
});
