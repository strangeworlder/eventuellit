// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";
import { buildIcosahedron, ICOSAHEDRON_MESH, projectVisibleFaces, rotateVec3 } from "./HeroCanvas";
import { OldHero } from "./OldHero";

function createMockCanvas2dContext(): CanvasRenderingContext2D {
  const gradientStub = {
    addColorStop: vi.fn(),
  };

  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    setLineDash: vi.fn(),
    createLinearGradient: vi.fn(() => gradientStub),
    createRadialGradient: vi.fn(() => gradientStub),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineJoin: "miter",
    lineCap: "butt",
  } as unknown as CanvasRenderingContext2D;
}

describe("Icosahedron 3D geometry (d20)", () => {
  it("constructs an exact regular icosahedron satisfying Euler's polyhedron formula", () => {
    const mesh = buildIcosahedron();
    expect(mesh.vertices).toHaveLength(12);
    expect(mesh.faces).toHaveLength(20);
    expect(mesh.edges).toHaveLength(30);
    // V - E + F = 2
    expect(mesh.vertices.length - mesh.edges.length + mesh.faces.length).toBe(2);

    for (const v of mesh.vertices) {
      expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 6);
    }

    const expectedEdgeLen = 2 / Math.hypot(1, (1 + Math.sqrt(5)) / 2);
    for (const [a, b] of mesh.edges) {
      const va = mesh.vertices[a];
      const vb = mesh.vertices[b];
      expect(va).toBeDefined();
      expect(vb).toBeDefined();
      if (va && vb) {
        const dist = Math.hypot(va.x - vb.x, va.y - vb.y, va.z - vb.z);
        expect(dist).toBeCloseTo(expectedEdgeLen, 5);
      }
    }

    for (const face of mesh.faces) {
      expect(Math.hypot(face.normal.x, face.normal.y, face.normal.z)).toBeCloseTo(1, 6);
      const outwardDot =
        face.normal.x * face.centroid.x +
        face.normal.y * face.centroid.y +
        face.normal.z * face.centroid.z;
      expect(outwardDot).toBeGreaterThan(0.79);
    }
  });

  it("preserves vector length under 3D Euler rotations", () => {
    const v = { x: 0.3, y: -0.7, z: 0.648 };
    const origLen = Math.hypot(v.x, v.y, v.z);
    const rotated = rotateVec3(v, 0.73, -1.24, 2.11);
    expect(Math.hypot(rotated.x, rotated.y, rotated.z)).toBeCloseTo(origLen, 6);
  });

  it("back-face culls hidden triangles and painter-sorts visible faces back-to-front", () => {
    const { visibleFaces } = projectVisibleFaces(
      ICOSAHEDRON_MESH,
      { x: 0.4, y: 1.1, z: -0.3 },
      { x: 0.05, y: -0.08 },
      600,
      120,
      96,
    );

    expect(visibleFaces.length).toBeGreaterThanOrEqual(7);
    expect(visibleFaces.length).toBeLessThanOrEqual(11);

    for (let i = 1; i < visibleFaces.length; i++) {
      const prev = visibleFaces[i - 1];
      const curr = visibleFaces[i];
      if (prev && curr) {
        expect(curr.depthZ).toBeGreaterThanOrEqual(prev.depthZ);
      }
    }
  });
});

describe("Hero and OldHero components", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("renders Hero title, description, children, theme attribute, and decorative canvas", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);

    const { container } = render(
      <Hero title="Kynnys" description="Asemaverkoston tilannekuva" theme="accent-dark">
        <span>Toimintopainike</span>
      </Hero>,
    );

    expect(screen.getByRole("heading", { name: "Kynnys" })).toBeTruthy();
    expect(screen.getByText("Asemaverkoston tilannekuva")).toBeTruthy();
    expect(screen.getByText("Toimintopainike")).toBeTruthy();

    const root = container.firstElementChild as HTMLElement | null;
    expect(root?.getAttribute("data-theme")).toBe("accent-dark");

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
    expect(canvas?.getAttribute("tabindex")).toBe("-1");
  });

  it("renders background image instead of canvas when backgroundImageSrc is set", () => {
    const { container } = render(
      <Hero
        title="Maailma"
        backgroundImageSrc="https://example.com/station.jpg"
        backgroundImageAlt="Aseman siluetti"
      />,
    );

    expect(container.querySelector("canvas")).toBeNull();
    const img = screen.getByRole("img", { name: "Aseman siluetti" });
    expect(img).toBeTruthy();
  });

  it("draws a static single frame without scheduling an animation loop when prefers-reduced-motion is enabled", () => {
    const mockCtx = createMockCanvas2dContext();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((contextId: string) =>
      contextId === "2d" ? mockCtx : null,
    );
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(1024);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(192);

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<Hero title="Hiljainen ohjaamo" />);

    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 1024, 192);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("schedules requestAnimationFrame and cleans up on unmount when motion is allowed", () => {
    const mockCtx = createMockCanvas2dContext();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((contextId: string) =>
      contextId === "2d" ? mockCtx : null,
    );
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(1200);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(192);

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    let queuedCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      queuedCallback = cb;
      return 42;
    });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(<Hero title="Liikkuva ohjaamo" />);
    expect(queuedCallback).not.toBeNull();
    if (queuedCallback) {
      (queuedCallback as FrameRequestCallback)(16);
    }
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 1200, 192);

    unmount();
    expect(cancelSpy).toHaveBeenCalledWith(42);
  });

  it("preserves OldHero in the design system with canvas and backgroundImageSrc modes", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);

    const { container, rerender } = render(
      <OldHero title="Arkistoitu otsikko" description="Vanha tähtikenttä" theme="base" />,
    );

    expect(screen.getByRole("heading", { name: "Arkistoitu otsikko" })).toBeTruthy();
    expect(container.querySelector("canvas")).toBeTruthy();

    rerender(
      <OldHero
        title="Arkistoitu otsikko"
        backgroundImageSrc="https://example.com/legacy.jpg"
        backgroundImageAlt="Vanha taustakuva"
      />,
    );
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.getByRole("img", { name: "Vanha taustakuva" })).toBeTruthy();
  });
});
