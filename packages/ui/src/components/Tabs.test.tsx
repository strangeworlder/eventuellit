// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

function mockRect(el: HTMLElement, left: number, top: number, width: number, height: number) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  });
}

describe("Tabs metaball slime indicator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hides the slime indicator when no tab is selected", () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="one">Yksi</TabsTrigger>
          <TabsTrigger value="two">Kaksi</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByTestId("tabs-list");
    const svg = list.querySelector("[data-slime-indicator]") as SVGSVGElement | null;
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("data-slime-state")).toBe("hidden");
    expect(svg?.style.opacity).toBe("0");
  });

  it("responds continuously to cursor weight and position with minimalist single-body slosh and resets on mouseleave", () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(
      <Tabs defaultValue="seula">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="seula">Seula</TabsTrigger>
          <TabsTrigger value="syke">Syke</TabsTrigger>
          <TabsTrigger value="verso">Verso</TabsTrigger>
        </TabsList>
        <TabsContent value="seula">Seula sisältö</TabsContent>
        <TabsContent value="syke">Syke sisältö</TabsContent>
        <TabsContent value="verso">Verso sisältö</TabsContent>
      </Tabs>,
    );

    const list = screen.getByTestId("tabs-list");
    const tabSeula = screen.getByRole("tab", { name: "Seula" });
    const tabSyke = screen.getByRole("tab", { name: "Syke" });
    const tabVerso = screen.getByRole("tab", { name: "Verso" });

    mockRect(list, 0, 0, 400, 48);
    mockRect(tabSeula, 0, 0, 100, 44);
    mockRect(tabSyke, 104, 0, 100, 44);
    mockRect(tabVerso, 208, 0, 100, 44);

    let simTime = 1000;
    const stepFrames = (count: number) => {
      for (let i = 0; i < count; i++) {
        const next = rafCallbacks.shift();
        if (!next) break;
        simTime += 16;
        act(() => {
          next(simTime);
        });
      }
    };

    const svg = list.querySelector("[data-slime-indicator]") as SVGSVGElement;
    const rects = svg.querySelectorAll("rect");
    const leftRect = rects[0];
    const rightRect = rects[2];

    // Move cursor over the right side of the active tab itself -> presses downward & rolls mass right
    fireEvent.mouseMove(tabSeula, { clientX: 90, clientY: 24 });
    expect(svg.getAttribute("data-slime-state")).toBe("tugging");
    stepFrames(22);
    const rightPressedY = Number.parseFloat(rightRect?.getAttribute("y") ?? "0");
    const leftHWhenCursorRight = Number.parseFloat(leftRect?.getAttribute("height") ?? "0");
    const rightHWhenCursorRight = Number.parseFloat(rightRect?.getAttribute("height") ?? "0");

    // Move cursor over the left side of the active tab -> mass shifts from right lobe into left lobe
    fireEvent.mouseMove(tabSeula, { clientX: 10, clientY: 24 });
    stepFrames(22);
    const leftHWhenCursorLeft = Number.parseFloat(leftRect?.getAttribute("height") ?? "0");
    const rightHWhenCursorLeft = Number.parseFloat(rightRect?.getAttribute("height") ?? "0");
    expect(leftHWhenCursorLeft).toBeGreaterThan(leftHWhenCursorRight + 1);
    expect(rightHWhenCursorRight).toBeGreaterThan(rightHWhenCursorLeft + 1);
    expect(rightPressedY).toBeGreaterThan(1.5);

    // Move cursor onto distant tab -> minimalist single-body weighted lean (no detached scout droplet)
    fireEvent.mouseMove(tabVerso, { clientX: 260, clientY: 22 });
    stepFrames(20);
    expect(svg.getAttribute("data-slime-state")).toBe("tugging");
    expect(Number.parseFloat(list.style.getPropertyValue("--tab-stretch-x"))).toBeGreaterThan(1);
    expect(Number.parseFloat(list.style.getPropertyValue("--tab-stretch-y"))).toBeLessThan(1);
    const scoutEllipse = svg.querySelector("[data-slime-scout] ellipse");
    expect(Number.parseFloat(scoutEllipse?.getAttribute("rx") ?? "10")).toBeLessThanOrEqual(0.2);

    // Leave tablist -> lifts cursor weight and resets tug vars
    fireEvent.mouseLeave(list);
    expect(list.style.getPropertyValue("--tab-tug-x")).toBe("0px");
    expect(list.style.getPropertyValue("--tab-stretch-x")).toBe("1");
  });

  it("oozes leading edge ahead of trailing edge on tab switch and settles to stillness", async () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(
      <Tabs defaultValue="seula">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="seula">Seula</TabsTrigger>
          <TabsTrigger value="verso">Verso</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByTestId("tabs-list");
    const tabSeula = screen.getByRole("tab", { name: "Seula" });
    const tabVerso = screen.getByRole("tab", { name: "Verso" });

    mockRect(list, 0, 0, 400, 48);
    mockRect(tabSeula, 0, 0, 100, 44);
    mockRect(tabVerso, 220, 0, 100, 44);

    let simTime = 1000;
    const stepFrames = (count: number, dtMs = 16) => {
      for (let i = 0; i < count; i++) {
        const next = rafCallbacks.shift();
        if (!next) break;
        simTime += dtMs;
        act(() => {
          next(simTime);
        });
      }
    };

    // Prime initial position via hover + leave and let springs reach active tab
    fireEvent.mouseOver(tabVerso);
    fireEvent.mouseLeave(list);
    stepFrames(60);

    // Click distant tab
    await act(async () => {
      fireEvent.click(tabVerso);
      await Promise.resolve();
    });

    const svg = list.querySelector("[data-slime-indicator]") as SVGSVGElement;
    const rects = svg.querySelectorAll("rect");
    const leftRect = rects[0];
    const midRect = rects[1];
    const rightRect = rects[2];

    // Mid-ooze (~96ms): leading right edge has surged far ahead of trailing left edge, stretching the body
    stepFrames(6);
    expect(svg.getAttribute("data-slime-state")).toBe("oozing");
    const midLeftX = Number.parseFloat(leftRect?.getAttribute("x") ?? "0");
    const midRightEdge =
      Number.parseFloat(rightRect?.getAttribute("x") ?? "0") +
      Number.parseFloat(rightRect?.getAttribute("width") ?? "0");
    const leadingAdvance = midRightEdge - 102;
    const trailingAdvance = midLeftX - -2;
    expect(leadingAdvance).toBeGreaterThan(trailingAdvance + 50);
    expect(midRightEdge - midLeftX).toBeGreaterThan(155);

    // Advance ~0.55s: slime has just landed unstressed on Verso [218..322] in accent tone
    stepFrames(35);
    expect(svg.getAttribute("data-slime-state")).toBe("idle");
    expect(svg.getAttribute("class")).toContain("text-[var(--theme-accent)]");
    const settledLeftX = Number.parseFloat(leftRect?.getAttribute("x") ?? "0");
    expect(Math.abs(settledLeftX - 218)).toBeLessThan(2);

    const firstArchetype = svg.getAttribute("data-slime-archetype");
    const initialOrganic = Number.parseFloat(svg.getAttribute("data-slime-organic") ?? "0");
    expect(initialOrganic).toBeGreaterThan(0.75);
    expect(rafCallbacks.length).toBeGreaterThan(0);

    // Viscoelastic curve: relaxes faster in the first 1.2s than in the next 1.2s as it decelerates onto the slow tail
    stepFrames(6, 200);
    const afterFirstWindow = Number.parseFloat(svg.getAttribute("data-slime-organic") ?? "0");
    stepFrames(6, 200);
    const afterSecondWindow = Number.parseFloat(svg.getAttribute("data-slime-organic") ?? "0");
    const earlyDrop = initialOrganic - afterFirstWindow;
    const laterDrop = afterFirstWindow - afterSecondWindow;
    expect(earlyDrop).toBeGreaterThan(laterDrop * 1.35);
    expect(afterSecondWindow).toBeGreaterThan(0.24);

    // Advance ~28 more seconds: settles close to a pill while keeping subtle continuous organic micro-motion
    stepFrames(140, 200);
    const finalOrganic = Number.parseFloat(svg.getAttribute("data-slime-organic") ?? "1");
    const relaxedWaistH = Number.parseFloat(midRect?.getAttribute("height") ?? "0");
    expect(finalOrganic).toBeCloseTo(0.12, 2);
    expect(relaxedWaistH).toBeGreaterThan(33);
    expect(rafCallbacks.length).toBeGreaterThan(0);

    // Sample ambient micro-motion over ~3 seconds: heights subtly breathe without drifting off the tab
    const sampledHeights: number[] = [relaxedWaistH];
    for (let s = 0; s < 15; s++) {
      stepFrames(1, 200);
      sampledHeights.push(Number.parseFloat(midRect?.getAttribute("height") ?? "0"));
    }
    const minH = Math.min(...sampledHeights);
    const maxH = Math.max(...sampledHeights);
    expect(maxH - minH).toBeGreaterThan(0.05);
    expect(maxH - minH).toBeLessThan(6);
    expect(Math.abs(Number.parseFloat(leftRect?.getAttribute("x") ?? "0") - 218)).toBeLessThan(2);

    // Switching to another tab rolls a different landing archetype so it does not repeat the same shape
    await act(async () => {
      fireEvent.click(tabSeula);
      await Promise.resolve();
    });
    stepFrames(70);
    const secondArchetype = svg.getAttribute("data-slime-archetype");
    expect(secondArchetype).not.toBe(firstArchetype);
  });

  it("respects prefers-reduced-motion by snapping without hover tug or rAF animation", async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation(
        (query: string) =>
          ({
            matches: query.includes("prefers-reduced-motion"),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList,
      ),
    });
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    try {
      render(
        <Tabs defaultValue="seula">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="seula">Seula</TabsTrigger>
            <TabsTrigger value="syke">Syke</TabsTrigger>
          </TabsList>
        </Tabs>,
      );

      const list = screen.getByTestId("tabs-list");
      const tabSeula = screen.getByRole("tab", { name: "Seula" });
      const tabSyke = screen.getByRole("tab", { name: "Syke" });
      mockRect(list, 0, 0, 300, 48);
      mockRect(tabSeula, 0, 0, 100, 44);
      mockRect(tabSyke, 110, 0, 100, 44);

      fireEvent.mouseOver(tabSyke);
      expect(list.style.getPropertyValue("--tab-tug-x")).toBe("0px");

      await act(async () => {
        fireEvent.click(tabSyke);
        await Promise.resolve();
      });

      expect(rafSpy).not.toHaveBeenCalled();
      const svg = list.querySelector("[data-slime-indicator]") as SVGSVGElement;
      expect(svg.getAttribute("data-slime-state")).toBe("idle");
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: originalMatchMedia,
      });
    }
  });
});
