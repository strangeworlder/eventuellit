import React, { useEffect, useRef } from "react";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface IcosahedronFace {
  indices: readonly [number, number, number];
  normal: Vec3;
  centroid: Vec3;
}

export interface IcosahedronMesh {
  vertices: readonly Vec3[];
  faces: readonly IcosahedronFace[];
  edges: readonly (readonly [number, number])[];
}

export interface ProjectedFace {
  faceIndex: number;
  indices: readonly [number, number, number];
  points2d: readonly [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
  centroid2d: { x: number; y: number };
  depthZ: number;
  ndotl: number;
  bounce: number;
  rim: number;
}

export interface HeroCanvasProps {
  className?: string;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface ScenePalette {
  bg: Rgb;
  accent: Rgb;
  accentDeep: Rgb;
  accentHighlight: Rgb;
  primary: Rgb;
  secondary: Rgb;
  isLight: boolean;
}

interface CurrentRibbon {
  yFrac: number;
  thicknessFrac: number;
  ampFrac: number;
  freq1: number;
  freq2: number;
  speed: number;
  phase: number;
  alpha: number;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  wobbleFreq: number;
  wobbleAmp: number;
  wobblePhase: number;
  alpha: number;
  /** Depth in [-1, 1]: negative is behind the d20, non-negative is in front */
  depth: number;
}

interface OrbitRing {
  radiusMult: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  dash: readonly number[];
  lineWidth: number;
  alpha: number;
  hasBeacon: boolean;
  beaconPhase: number;
  beaconSpeed: number;
  hasApsisTicks: boolean;
}

interface SceneConfig {
  xFrac: number;
  yFrac: number;
  radiusFrac: number;
  initialRot: Vec3;
  rotVelocity: Vec3;
  tickPhase: number;
  ribbons: CurrentRibbon[];
  orbits: OrbitRing[];
}

const CAMERA_DIST = 5.2;
const BUBBLE_COUNT = 44;
const ORBIT_SEGMENTS = 96;

function vecLength(v: Vec3): number {
  return Math.hypot(v.x, v.y, v.z);
}

function normalize(v: Vec3): Vec3 {
  const len = vecLength(v);
  if (len === 0) return { x: 0, y: 0, z: 1 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function rotateVec3(v: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = v.y * cx - v.z * sx;
  const z1 = v.y * sx + v.z * cx;

  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = v.x * cy + z1 * sy;
  const z2 = -v.x * sy + z1 * cy;

  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  return {
    x: x2 * cz - y1 * sz,
    y: x2 * sz + y1 * cz,
    z: z2,
  };
}

const LIGHT_DIR: Vec3 = normalize({ x: -0.62, y: -0.54, z: 0.57 });
const BOUNCE_DIR: Vec3 = normalize({ x: 0.58, y: 0.44, z: -0.25 });

/**
 * Builds an exact regular 20-face unit icosahedron with verified outward-pointing
 * unit normals and deduplicated undirected edge pairs.
 */
export function buildIcosahedron(): IcosahedronMesh {
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices: readonly [number, number, number][] = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];

  const vertices: Vec3[] = rawVertices.map(([x, y, z]) => normalize({ x, y, z }));

  const rawFaces: readonly [number, number, number][] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];

  const faces: IcosahedronFace[] = rawFaces.map(([i0, i1, i2]) => {
    const v0 = vertices[i0] ?? { x: 0, y: 0, z: 0 };
    const v1 = vertices[i1] ?? { x: 0, y: 0, z: 0 };
    const v2 = vertices[i2] ?? { x: 0, y: 0, z: 0 };

    const centroid = {
      x: (v0.x + v1.x + v2.x) / 3,
      y: (v0.y + v1.y + v2.y) / 3,
      z: (v0.z + v1.z + v2.z) / 3,
    };

    const rawNormal = normalize(cross(sub(v1, v0), sub(v2, v0)));
    const outward = dot(rawNormal, centroid) >= 0;
    const indices: readonly [number, number, number] = outward ? [i0, i1, i2] : [i0, i2, i1];
    const normal: Vec3 = outward
      ? rawNormal
      : { x: -rawNormal.x, y: -rawNormal.y, z: -rawNormal.z };

    const pairs: readonly [number, number][] = [
      [indices[0], indices[1]],
      [indices[1], indices[2]],
      [indices[2], indices[0]],
    ];
    for (const [a, b] of pairs) {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const key = `${lo}:${hi}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([lo, hi]);
      }
    }

    return { indices, normal, centroid };
  });

  return { vertices, faces, edges };
}

export const ICOSAHEDRON_MESH: IcosahedronMesh = buildIcosahedron();

function projectPoint3d(p: Vec3, cx: number, cy: number, radius: number): { x: number; y: number } {
  const denom = Math.max(0.8, CAMERA_DIST - p.z);
  const persp = CAMERA_DIST / denom;
  return {
    x: cx + p.x * radius * persp,
    y: cy + p.y * radius * persp,
  };
}

/**
 * Rotates and projects all front-facing icosahedron triangles, sorted back-to-front.
 */
export function projectVisibleFaces(
  mesh: IcosahedronMesh,
  rot: Vec3,
  camTilt: { x: number; y: number },
  cx: number,
  cy: number,
  radius: number,
): {
  rotatedVertices: Vec3[];
  projectedVertices: { x: number; y: number }[];
  visibleFaces: ProjectedFace[];
} {
  const rotatedVertices = mesh.vertices.map((v) => {
    const r = rotateVec3(v, rot.x, rot.y, rot.z);
    return rotateVec3(r, camTilt.x, camTilt.y, 0);
  });

  const projectedVertices = rotatedVertices.map((v) => projectPoint3d(v, cx, cy, radius));

  const visibleFaces: ProjectedFace[] = [];

  mesh.faces.forEach((face, faceIndex) => {
    const [i0, i1, i2] = face.indices;
    const n1 = rotateVec3(face.normal, rot.x, rot.y, rot.z);
    const n = normalize(rotateVec3(n1, camTilt.x, camTilt.y, 0));

    const c1 = rotateVec3(face.centroid, rot.x, rot.y, rot.z);
    const c = rotateVec3(c1, camTilt.x, camTilt.y, 0);

    const toCam: Vec3 = { x: -c.x, y: -c.y, z: CAMERA_DIST - c.z };
    if (dot(n, toCam) <= 0) return;

    const p0 = projectedVertices[i0] ?? { x: cx, y: cy };
    const p1 = projectedVertices[i1] ?? { x: cx, y: cy };
    const p2 = projectedVertices[i2] ?? { x: cx, y: cy };

    const viewDir = normalize(toCam);
    const viewDot = Math.max(0, dot(n, viewDir));
    const ndotl = Math.max(0, dot(n, LIGHT_DIR));
    const bounce = Math.max(0, dot(n, BOUNCE_DIR));
    const rim = (1 - viewDot) ** 2.1;

    visibleFaces.push({
      faceIndex,
      indices: face.indices,
      points2d: [p0, p1, p2],
      centroid2d: {
        x: (p0.x + p1.x + p2.x) / 3,
        y: (p0.y + p1.y + p2.y) / 3,
      },
      depthZ: c.z,
      ndotl,
      bounce,
      rim,
    });
  });

  visibleFaces.sort((a, b) => a.depthZ - b.depthZ);

  return { rotatedVertices, projectedVertices, visibleFaces };
}

function parseCssColor(raw: string, fallback: Rgb): Rgb {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt((hex[0] ?? "0") + (hex[0] ?? "0"), 16);
      const g = parseInt((hex[1] ?? "0") + (hex[1] ?? "0"), 16);
      const b = parseInt((hex[2] ?? "0") + (hex[2] ?? "0"), 16);
      if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
        return { r, g, b };
      }
    } else if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
        return { r, g, b };
      }
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)/i);
  if (rgbMatch) {
    const r = Math.round(Number(rgbMatch[1]));
    const g = Math.round(Number(rgbMatch[2]));
    const b = Math.round(Number(rgbMatch[3]));
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return { r, g, b };
    }
  }

  return fallback;
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * clamped),
    g: Math.round(a.g + (b.g - a.g) * clamped),
    b: Math.round(a.b + (b.b - a.b) * clamped),
  };
}

function rgba(c: Rgb, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`;
}

function resolvePalette(el: Element): ScenePalette {
  const style = getComputedStyle(el);
  const bg = parseCssColor(style.getPropertyValue("--theme-bg"), { r: 15, g: 15, b: 19 });
  const accent = parseCssColor(style.getPropertyValue("--theme-accent"), {
    r: 84,
    g: 121,
    b: 222,
  });
  const accentDeep = parseCssColor(style.getPropertyValue("--color-accent-900"), {
    r: 20,
    g: 42,
    b: 103,
  });
  const accentPale = parseCssColor(style.getPropertyValue("--color-accent-100"), {
    r: 212,
    g: 221,
    b: 247,
  });
  const primary = parseCssColor(style.getPropertyValue("--theme-primary"), {
    r: 207,
    g: 83,
    b: 74,
  });
  const secondary = parseCssColor(style.getPropertyValue("--theme-secondary"), {
    r: 39,
    g: 139,
    b: 134,
  });

  const luminance = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b;
  const isLight = luminance > 140;

  const accentHighlight = isLight
    ? mixRgb(accent, { r: 255, g: 255, b: 255 }, 0.55)
    : mixRgb(accent, accentPale, 0.65);

  return {
    bg,
    accent,
    accentDeep,
    accentHighlight,
    primary,
    secondary,
    isLight,
  };
}

function buildSceneConfig(): SceneConfig {
  const sign = Math.random() < 0.5 ? -1 : 1;
  const baseTiltZ = Math.random() * 0.44 - 0.22 + sign * 0.14;

  const ribbons: CurrentRibbon[] = [
    {
      yFrac: 0.22 + Math.random() * 0.12,
      thicknessFrac: 0.26 + Math.random() * 0.08,
      ampFrac: 0.055 + Math.random() * 0.03,
      freq1: 1.4 + Math.random() * 0.5,
      freq2: 2.9 + Math.random() * 0.7,
      speed: 0.18 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.1,
    },
    {
      yFrac: 0.5 + Math.random() * 0.14,
      thicknessFrac: 0.32 + Math.random() * 0.1,
      ampFrac: 0.07 + Math.random() * 0.035,
      freq1: 1.1 + Math.random() * 0.45,
      freq2: 2.3 + Math.random() * 0.6,
      speed: 0.13 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.12,
    },
    {
      yFrac: 0.78 + Math.random() * 0.12,
      thicknessFrac: 0.28 + Math.random() * 0.09,
      ampFrac: 0.05 + Math.random() * 0.03,
      freq1: 1.7 + Math.random() * 0.5,
      freq2: 3.2 + Math.random() * 0.8,
      speed: 0.21 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.09,
    },
  ];

  const orbits: OrbitRing[] = [
    {
      radiusMult: 1.28,
      tiltX: 1.05 + Math.random() * 0.22,
      tiltY: (Math.random() - 0.5) * 0.35,
      tiltZ: baseTiltZ,
      dash: [],
      lineWidth: 1,
      alpha: 0.34,
      hasBeacon: true,
      beaconPhase: Math.random() * Math.PI * 2,
      beaconSpeed: 0.14 + Math.random() * 0.05,
      hasApsisTicks: false,
    },
    {
      radiusMult: 1.56,
      tiltX: 1.16 + Math.random() * 0.2,
      tiltY: (Math.random() - 0.5) * 0.5,
      tiltZ: baseTiltZ - sign * (0.38 + Math.random() * 0.18),
      dash: [5, 5],
      lineWidth: 0.9,
      alpha: 0.25,
      hasBeacon: false,
      beaconPhase: 0,
      beaconSpeed: 0,
      hasApsisTicks: true,
    },
    {
      radiusMult: 1.88,
      tiltX: 0.96 + Math.random() * 0.26,
      tiltY: (Math.random() - 0.5) * 0.4,
      tiltZ: baseTiltZ + sign * (0.22 + Math.random() * 0.16),
      dash: [14, 6, 2, 6],
      lineWidth: 0.85,
      alpha: 0.18,
      hasBeacon: false,
      beaconPhase: 0,
      beaconSpeed: 0,
      hasApsisTicks: false,
    },
  ];

  // ~95-125s per full revolution (2*PI / ~0.058 ≈ 108s)
  return {
    xFrac: 0.69 + Math.random() * 0.15,
    yFrac: 0.52 + Math.random() * 0.26,
    radiusFrac: 0.48 + Math.random() * 0.18,
    initialRot: {
      x: Math.random() * Math.PI * 2,
      y: Math.random() * Math.PI * 2,
      z: Math.random() * Math.PI * 2,
    },
    rotVelocity: {
      x: (Math.random() * 0.018 + 0.014) * (Math.random() < 0.5 ? -1 : 1),
      y: 0.048 + Math.random() * 0.018,
      z: (Math.random() * 0.014 + 0.008) * (Math.random() < 0.5 ? -1 : 1),
    },
    tickPhase: Math.random() * Math.PI * 2,
    ribbons,
    orbits,
  };
}

function buildBubbles(width: number, height: number): Bubble[] {
  const safeW = Math.max(width, 320);
  const safeH = Math.max(height, 160);
  const bubbles: Bubble[] = [];

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const depth = Math.random() * 2 - 1; // [-1, 1]
    const depthScale = 0.65 + (depth + 1) * 0.35; // 0.65 .. 1.35
    const radius = (1.5 + Math.random() ** 2.35 * 6.5) * (0.85 + (depth + 1) * 0.12);

    bubbles.push({
      x: Math.random() * safeW,
      y: Math.random() * safeH,
      radius: Math.min(8, Math.max(1.5, radius)),
      vx: (7 + Math.random() * 10) * depthScale,
      vy: -(1.4 + Math.random() * 3.6) * depthScale,
      wobbleFreq: 0.5 + Math.random() * 0.9,
      wobbleAmp: 2.5 + Math.random() * 5.5,
      wobblePhase: Math.random() * Math.PI * 2,
      alpha: (0.09 + Math.random() * 0.17) * (depth >= 0 ? 1.05 : 0.82),
      depth,
    });
  }

  return bubbles;
}

export const HeroCanvas = React.forwardRef<HTMLCanvasElement, HeroCanvasProps>(
  ({ className }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) ?? internalRef;
    const sceneRef = useRef<SceneConfig | null>(null);
    if (!sceneRef.current) {
      sceneRef.current = buildSceneConfig();
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      const scene = sceneRef.current;
      if (!canvas || !scene) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = 1;
      let palette = resolvePalette(canvas);
      let bubbles: Bubble[] = [];
      let animationId = 0;
      let elapsed = 0;
      let lastTimestamp: number | null = null;

      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };

      const reducedMotionQuery =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(prefers-reduced-motion: reduce)")
          : null;
      let prefersReducedMotion = reducedMotionQuery?.matches ?? false;

      function resize() {
        if (!canvas || !ctx) return;
        const nextW = canvas.offsetWidth;
        const nextH = canvas.offsetHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = nextW;
        height = nextH;
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        palette = resolvePalette(canvas);
        if (bubbles.length === 0 && width > 0 && height > 0) {
          bubbles = buildBubbles(width, height);
        }
      }

      function drawBackgroundWashes(
        pcx: number,
        pcy: number,
        d20Radius: number,
        mx: number,
        my: number,
      ) {
        if (!ctx) return;
        const washAlphaPrimary = palette.isLight ? 0.11 : 0.42;
        const washAlphaSecondary = palette.isLight ? 0.06 : 0.22;
        const washCore = palette.isLight
          ? palette.accent
          : mixRgb(palette.accentDeep, palette.accent, 0.26);

        const rightWash = ctx.createRadialGradient(
          pcx - d20Radius * 0.2 + mx * 10,
          pcy - d20Radius * 0.15 + my * 8,
          d20Radius * 0.15,
          pcx,
          pcy,
          Math.max(width * 0.62, d20Radius * 3.1),
        );
        rightWash.addColorStop(0, rgba(washCore, washAlphaPrimary));
        rightWash.addColorStop(0.5, rgba(palette.accentDeep, washAlphaPrimary * 0.65));
        rightWash.addColorStop(1, rgba(palette.bg, 0));
        ctx.fillStyle = rightWash;
        ctx.fillRect(0, 0, width, height);

        const midWash = ctx.createRadialGradient(
          width * 0.34 + mx * 6,
          height * 0.28 + my * 5,
          10,
          width * 0.34,
          height * 0.28,
          Math.max(width * 0.48, height * 1.8),
        );
        midWash.addColorStop(0, rgba(palette.accentDeep, washAlphaSecondary));
        midWash.addColorStop(1, rgba(palette.bg, 0));
        ctx.fillStyle = midWash;
        ctx.fillRect(0, 0, width, height);
      }

      function sampleRibbonY(ribbon: CurrentRibbon, x: number, t: number): number {
        const nx = x / Math.max(width, 320);
        const wave1 = Math.sin(nx * Math.PI * ribbon.freq1 - t * ribbon.speed + ribbon.phase);
        const wave2 =
          Math.cos(nx * Math.PI * ribbon.freq2 + t * ribbon.speed * 0.63 + ribbon.phase * 1.4) *
          0.45;
        return height * ribbon.yFrac + (wave1 + wave2) * height * ribbon.ampFrac;
      }

      function drawCurrentRibbons(t: number, mx: number, my: number) {
        if (!ctx || !scene) return;
        const step = 24;
        const ox = mx * 10;
        const oy = my * 6;
        const baseRibbonColor = palette.isLight
          ? palette.accent
          : mixRgb(palette.accentDeep, palette.accent, 0.48);

        for (const ribbon of scene.ribbons) {
          const halfThick = height * ribbon.thicknessFrac * 0.5;
          const alphaScale = palette.isLight ? ribbon.alpha * 0.65 : ribbon.alpha;

          ctx.beginPath();
          for (let x = -step; x <= width + step; x += step) {
            const cy = sampleRibbonY(ribbon, x - ox, t) + oy;
            const localMod = 0.82 + 0.28 * Math.sin(x * 0.006 + t * 0.25 + ribbon.phase);
            const topY = cy - halfThick * localMod;
            if (x === -step) {
              ctx.moveTo(x, topY);
            } else {
              ctx.lineTo(x, topY);
            }
          }
          for (let x = width + step; x >= -step; x -= step) {
            const cy = sampleRibbonY(ribbon, x - ox, t) + oy;
            const localMod = 0.82 + 0.28 * Math.sin(x * 0.006 + t * 0.25 + ribbon.phase);
            const botY = cy + halfThick * localMod;
            ctx.lineTo(x, botY);
          }
          ctx.closePath();

          const midY = height * ribbon.yFrac + oy;
          const grad = ctx.createLinearGradient(
            0,
            midY - halfThick * 1.2,
            0,
            midY + halfThick * 1.2,
          );
          grad.addColorStop(0, rgba(baseRibbonColor, 0));
          grad.addColorStop(0.5, rgba(baseRibbonColor, alphaScale));
          grad.addColorStop(1, rgba(baseRibbonColor, 0));
          ctx.fillStyle = grad;
          ctx.fill();

          // Subtle crest filament along the spine of the current
          ctx.beginPath();
          for (let x = -step; x <= width + step; x += step) {
            const cy = sampleRibbonY(ribbon, x - ox, t) + oy;
            if (x === -step) {
              ctx.moveTo(x, cy);
            } else {
              ctx.lineTo(x, cy);
            }
          }
          ctx.strokeStyle = rgba(palette.accent, alphaScale * 0.7);
          ctx.lineWidth = 0.75;
          ctx.setLineDash([]);
          ctx.stroke();
        }
      }

      function updateAndDrawBubbles(
        dt: number,
        t: number,
        mx: number,
        my: number,
        layer: "back" | "front",
      ) {
        if (!ctx || !scene) return;
        const margin = 16;
        const primaryRibbon = scene.ribbons[1] ?? scene.ribbons[0];

        for (const b of bubbles) {
          const isBack = b.depth < 0;
          if ((layer === "back" && !isBack) || (layer === "front" && isBack)) {
            continue;
          }

          if (dt > 0) {
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            if (b.x > width + margin) {
              b.x = -margin;
              b.y = Math.random() * height;
            }
            if (b.y < -margin) {
              b.y = height + margin;
              b.x = Math.random() * width;
            } else if (b.y > height + margin) {
              b.y = -margin;
            }
          }

          const currentOffset = primaryRibbon
            ? (sampleRibbonY(primaryRibbon, b.x, t) - height * primaryRibbon.yFrac) * 0.22
            : 0;
          const wobbleY = Math.sin(t * b.wobbleFreq + b.wobblePhase) * b.wobbleAmp;
          const parallaxScale = 12 + (b.depth + 1) * 14;
          const bx = b.x + mx * parallaxScale;
          const by = b.y + currentOffset + wobbleY + my * parallaxScale * 0.65;

          const baseAlpha = palette.isLight ? b.alpha * 0.85 : b.alpha;

          // Subtle interior refraction tint
          ctx.beginPath();
          ctx.arc(bx, by, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = rgba(palette.accent, baseAlpha * 0.13);
          ctx.fill();

          // Thin Accent Blue outer rim
          ctx.lineWidth = b.radius > 4.5 ? 0.95 : 0.75;
          ctx.strokeStyle = rgba(palette.accent, baseAlpha);
          ctx.setLineDash([]);
          ctx.stroke();

          // Specular crescent highlight toward upper-left directional light
          if (b.radius >= 1.8) {
            ctx.beginPath();
            ctx.arc(bx, by, b.radius * 0.7, -Math.PI * 0.88, -Math.PI * 0.38);
            ctx.lineWidth = b.radius > 4.5 ? 1.05 : 0.75;
            ctx.strokeStyle = rgba(palette.accentHighlight, Math.min(0.55, baseAlpha * 1.45));
            ctx.stroke();
          }
        }
      }

      function drawOrbitPass(
        pcx: number,
        pcy: number,
        d20Radius: number,
        camTilt: { x: number; y: number },
        t: number,
        pass: "back" | "front",
      ) {
        if (!ctx || !scene) return;

        for (const orbit of scene.orbits) {
          const orbitRadius = d20Radius * orbit.radiusMult;
          const pts: { x: number; y: number; z: number }[] = [];

          for (let s = 0; s <= ORBIT_SEGMENTS; s++) {
            const theta = (s / ORBIT_SEGMENTS) * Math.PI * 2;
            const local: Vec3 = { x: Math.cos(theta), y: Math.sin(theta), z: 0 };
            const tilted = rotateVec3(local, orbit.tiltX, orbit.tiltY, orbit.tiltZ);
            const viewed = rotateVec3(tilted, camTilt.x, camTilt.y, 0);
            const p2d = projectPoint3d(viewed, pcx, pcy, orbitRadius);
            pts.push({ x: p2d.x, y: p2d.y, z: viewed.z });
          }

          ctx.save();
          ctx.lineWidth = orbit.lineWidth;
          ctx.setLineDash([...orbit.dash]);
          const strokeAlpha = pass === "front" ? orbit.alpha : orbit.alpha * 0.45;
          ctx.strokeStyle = rgba(palette.accent, strokeAlpha);

          let inRun = false;
          ctx.beginPath();
          for (let s = 0; s < ORBIT_SEGMENTS; s++) {
            const a = pts[s];
            const b = pts[s + 1];
            if (!a || !b) continue;
            const midZ = (a.z + b.z) * 0.5;
            const matches = pass === "back" ? midZ < 0 : midZ >= 0;

            if (matches) {
              if (!inRun) {
                ctx.moveTo(a.x, a.y);
                inRun = true;
              }
              ctx.lineTo(b.x, b.y);
            } else {
              inRun = false;
            }
          }
          ctx.stroke();
          ctx.restore();

          // Apsis tick marks at theta = 0 and theta = PI
          if (orbit.hasApsisTicks) {
            for (const apsisAngle of [0, Math.PI]) {
              const innerLocal: Vec3 = {
                x: Math.cos(apsisAngle) * 0.96,
                y: Math.sin(apsisAngle) * 0.96,
                z: 0,
              };
              const outerLocal: Vec3 = {
                x: Math.cos(apsisAngle) * 1.04,
                y: Math.sin(apsisAngle) * 1.04,
                z: 0,
              };
              const innerV = rotateVec3(
                rotateVec3(innerLocal, orbit.tiltX, orbit.tiltY, orbit.tiltZ),
                camTilt.x,
                camTilt.y,
                0,
              );
              const outerV = rotateVec3(
                rotateVec3(outerLocal, orbit.tiltX, orbit.tiltY, orbit.tiltZ),
                camTilt.x,
                camTilt.y,
                0,
              );
              const inPass = pass === "back" ? innerV.z < 0 : innerV.z >= 0;
              if (!inPass) continue;

              const pIn = projectPoint3d(innerV, pcx, pcy, orbitRadius);
              const pOut = projectPoint3d(outerV, pcx, pcy, orbitRadius);
              ctx.beginPath();
              ctx.moveTo(pIn.x, pIn.y);
              ctx.lineTo(pOut.x, pOut.y);
              ctx.setLineDash([]);
              ctx.lineWidth = 1.1;
              ctx.strokeStyle = rgba(palette.secondary, pass === "front" ? 0.34 : 0.16);
              ctx.stroke();
            }
          }

          // Orbiting --theme-primary (red) satellite beacon pip
          if (orbit.hasBeacon) {
            const beaconTheta = orbit.beaconPhase + t * orbit.beaconSpeed;
            const beaconLocal: Vec3 = {
              x: Math.cos(beaconTheta),
              y: Math.sin(beaconTheta),
              z: 0,
            };
            const beaconTilted = rotateVec3(beaconLocal, orbit.tiltX, orbit.tiltY, orbit.tiltZ);
            const beaconViewed = rotateVec3(beaconTilted, camTilt.x, camTilt.y, 0);
            const inPass = pass === "back" ? beaconViewed.z < 0 : beaconViewed.z >= 0;

            if (inPass) {
              const bp = projectPoint3d(beaconViewed, pcx, pcy, orbitRadius);
              const depthFade = pass === "front" ? 1 : 0.65;

              const glow = ctx.createRadialGradient(bp.x, bp.y, 0.5, bp.x, bp.y, 8);
              glow.addColorStop(0, rgba(palette.primary, 0.42 * depthFade));
              glow.addColorStop(1, rgba(palette.primary, 0));
              ctx.beginPath();
              ctx.arc(bp.x, bp.y, 8, 0, Math.PI * 2);
              ctx.fillStyle = glow;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(bp.x, bp.y, 5.2, 0, Math.PI * 2);
              ctx.setLineDash([]);
              ctx.lineWidth = 0.8;
              ctx.strokeStyle = rgba(palette.primary, 0.38 * depthFade);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(bp.x, bp.y, 2.2, 0, Math.PI * 2);
              ctx.fillStyle = rgba(palette.primary, 0.92 * depthFade);
              ctx.fill();
            }
          }
        }

        // Subtle radial degree ticks outside the d20 rim (drawn once in front pass)
        if (pass === "front") {
          const tickRadius = d20Radius * 1.42;
          const totalTicks = 48;
          const rotOffset = scene.tickPhase + t * 0.01;
          ctx.setLineDash([]);

          for (let i = 0; i < totalTicks; i++) {
            const angle = (i / totalTicks) * Math.PI * 2 + rotOffset;
            const isMajor = i % 4 === 0;
            const innerR = tickRadius;
            const outerR = tickRadius + (isMajor ? 5.5 : 3);
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(pcx + cosA * innerR, pcy + sinA * innerR);
            ctx.lineTo(pcx + cosA * outerR, pcy + sinA * outerR);
            ctx.lineWidth = isMajor ? 0.95 : 0.75;
            ctx.strokeStyle = isMajor ? rgba(palette.accent, 0.22) : rgba(palette.secondary, 0.16);
            ctx.stroke();
          }
        }
      }

      function drawD20(
        pcx: number,
        pcy: number,
        d20Radius: number,
        rot: Vec3,
        camTilt: { x: number; y: number },
      ) {
        if (!ctx) return;

        // Atmospheric Accent Blue rim halo behind the solid d20
        const haloOffsetX = pcx - d20Radius * 0.12;
        const haloOffsetY = pcy - d20Radius * 0.1;
        const haloGrad = ctx.createRadialGradient(
          haloOffsetX,
          haloOffsetY,
          d20Radius * 0.68,
          pcx,
          pcy,
          d20Radius * 1.34,
        );
        const haloPeak = palette.isLight ? 0.18 : 0.3;
        haloGrad.addColorStop(0, rgba(palette.accent, 0));
        haloGrad.addColorStop(0.52, rgba(palette.accent, haloPeak));
        haloGrad.addColorStop(0.78, rgba(palette.accentHighlight, haloPeak * 0.42));
        haloGrad.addColorStop(1, rgba(palette.accent, 0));

        ctx.beginPath();
        ctx.arc(pcx, pcy, d20Radius * 1.34, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        const { projectedVertices, visibleFaces } = projectVisibleFaces(
          ICOSAHEDRON_MESH,
          rot,
          camTilt,
          pcx,
          pcy,
          d20Radius,
        );

        const shadowBase = palette.isLight
          ? mixRgb(palette.accentDeep, palette.bg, 0.12)
          : mixRgb(palette.bg, palette.accentDeep, 0.42);
        const midLitBase = palette.isLight
          ? mixRgb(palette.accentDeep, palette.accent, 0.58)
          : mixRgb(palette.accentDeep, palette.accent, 0.62);
        const brightRimBase = palette.isLight
          ? mixRgb(palette.accent, palette.accentHighlight, 0.45)
          : mixRgb(palette.accent, palette.accentHighlight, 0.38);

        // Track shared visible edges so outer silhouette limbs can catch extra rim light
        const edgeMeta = new Map<
          string,
          { a: number; b: number; count: number; maxLight: number; maxRim: number }
        >();

        for (const face of visibleFaces) {
          const [p0, p1, p2] = face.points2d;
          const diffuseFactor = face.ndotl ** 1.15 * 0.68 + face.bounce * 0.08;
          const rimFactor = face.rim * (0.28 + 0.72 * face.ndotl) * 0.42;
          const totalLight = Math.min(1, diffuseFactor + rimFactor);

          const baseFaceRgb =
            totalLight < 0.65
              ? mixRgb(shadowBase, midLitBase, totalLight / 0.65)
              : mixRgb(midLitBase, brightRimBase, (totalLight - 0.65) / 0.35);

          const topLeftTint = mixRgb(baseFaceRgb, palette.accentHighlight, 0.08 * face.ndotl);
          const botRightTint = mixRgb(baseFaceRgb, shadowBase, 0.16);

          const faceGrad = ctx.createLinearGradient(
            face.centroid2d.x - d20Radius * 0.35,
            face.centroid2d.y - d20Radius * 0.35,
            face.centroid2d.x + d20Radius * 0.35,
            face.centroid2d.y + d20Radius * 0.35,
          );
          faceGrad.addColorStop(0, rgba(topLeftTint, 1));
          faceGrad.addColorStop(1, rgba(botRightTint, 1));

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();

          ctx.fillStyle = faceGrad;
          ctx.fill();

          // Seal anti-aliased polygon seams between adjacent solid facets
          ctx.setLineDash([]);
          ctx.lineJoin = "round";
          ctx.lineWidth = 0.65;
          ctx.strokeStyle = rgba(baseFaceRgb, 1);
          ctx.stroke();

          // Subtle inner megastructure bevel seam lines (no numbers)
          const bevelAlpha = 0.025 + face.ndotl ** 1.35 * 0.16 + face.rim * 0.1;
          if (bevelAlpha > 0.035) {
            const inset = 0.78;
            const cx2 = face.centroid2d.x;
            const cy2 = face.centroid2d.y;
            const ip0x = cx2 + (p0.x - cx2) * inset;
            const ip0y = cy2 + (p0.y - cy2) * inset;
            const ip1x = cx2 + (p1.x - cx2) * inset;
            const ip1y = cy2 + (p1.y - cy2) * inset;
            const ip2x = cx2 + (p2.x - cx2) * inset;
            const ip2y = cy2 + (p2.y - cy2) * inset;

            ctx.beginPath();
            ctx.moveTo(ip0x, ip0y);
            ctx.lineTo(ip1x, ip1y);
            ctx.lineTo(ip2x, ip2y);
            ctx.closePath();
            ctx.lineWidth = 0.7;
            ctx.strokeStyle = rgba(palette.accentHighlight, Math.min(0.28, bevelAlpha));
            ctx.stroke();
          }

          const [vi0, vi1, vi2] = face.indices;
          const pairs: readonly [number, number][] = [
            [vi0, vi1],
            [vi1, vi2],
            [vi2, vi0],
          ];
          for (const [ea, eb] of pairs) {
            const lo = Math.min(ea, eb);
            const hi = Math.max(ea, eb);
            const key = `${lo}:${hi}`;
            const existing = edgeMeta.get(key);
            if (existing) {
              existing.count += 1;
              existing.maxLight = Math.max(existing.maxLight, face.ndotl);
              existing.maxRim = Math.max(existing.maxRim, face.rim);
            } else {
              edgeMeta.set(key, {
                a: lo,
                b: hi,
                count: 1,
                maxLight: face.ndotl,
                maxRim: face.rim,
              });
            }
          }
        }

        // Draw crisp wireframe edges with heightened luminance along lit silhouette limbs
        ctx.setLineDash([]);
        ctx.lineCap = "round";
        for (const edge of edgeMeta.values()) {
          const pa = projectedVertices[edge.a];
          const pb = projectedVertices[edge.b];
          if (!pa || !pb) continue;

          const isSilhouette = edge.count === 1;
          const edgeAlpha = isSilhouette
            ? 0.24 + edge.maxLight * 0.52 + edge.maxRim * 0.24
            : 0.1 + edge.maxLight * 0.36 + edge.maxRim * 0.14;
          const edgeColor =
            isSilhouette && edge.maxLight > 0.25
              ? mixRgb(palette.accent, palette.accentHighlight, 0.55)
              : mixRgb(palette.accent, palette.accentHighlight, edge.maxLight * 0.35);

          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.lineWidth = isSilhouette ? 1.3 : 0.9;
          ctx.strokeStyle = rgba(edgeColor, Math.min(0.92, edgeAlpha));
          ctx.stroke();
        }
      }

      function renderFrame(dt: number, t: number) {
        if (!ctx || !scene || width <= 0 || height <= 0) return;

        ctx.clearRect(0, 0, width, height);

        const lerpFactor = dt > 0 ? 1 - Math.exp(-dt * 3.2) : 1;
        mouse.x += (targetMouse.x - mouse.x) * lerpFactor;
        mouse.y += (targetMouse.y - mouse.y) * lerpFactor;

        const mx = prefersReducedMotion ? 0 : mouse.x;
        const my = prefersReducedMotion ? 0 : mouse.y;

        const effectiveXFrac = width < 550 ? Math.max(0.76, scene.xFrac + 0.06) : scene.xFrac;
        const pcx = width * effectiveXFrac + mx * 18;
        const pcy = height * scene.yFrac + my * 12;
        const d20Radius = Math.max(48, Math.min(height * scene.radiusFrac, width * 0.26));

        const rot: Vec3 = {
          x: scene.initialRot.x + t * scene.rotVelocity.x,
          y: scene.initialRot.y + t * scene.rotVelocity.y,
          z: scene.initialRot.z + t * scene.rotVelocity.z,
        };
        const camTilt = {
          x: -my * 0.11,
          y: mx * 0.14,
        };

        drawBackgroundWashes(pcx, pcy, d20Radius, mx, my);
        drawCurrentRibbons(t, mx, my);
        updateAndDrawBubbles(dt, t, mx, my, "back");
        drawOrbitPass(pcx, pcy, d20Radius, camTilt, t, "back");
        drawD20(pcx, pcy, d20Radius, rot, camTilt);
        drawOrbitPass(pcx, pcy, d20Radius, camTilt, t, "front");
        updateAndDrawBubbles(dt, t, mx, my, "front");
      }

      function tick(now: number) {
        if (prefersReducedMotion) return;
        const rawDt = lastTimestamp === null ? 0.016 : (now - lastTimestamp) / 1000;
        const dt = Math.min(0.05, Math.max(0, rawDt));
        lastTimestamp = now;
        elapsed += dt;

        renderFrame(dt, elapsed);
        animationId = requestAnimationFrame(tick);
      }

      function startOrDrawStatic() {
        cancelAnimationFrame(animationId);
        lastTimestamp = null;
        if (prefersReducedMotion) {
          renderFrame(0, elapsed);
        } else {
          animationId = requestAnimationFrame(tick);
        }
      }

      resize();
      startOrDrawStatic();

      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => {
              resize();
              if (prefersReducedMotion) {
                renderFrame(0, elapsed);
              }
            })
          : null;
      ro?.observe(canvas);

      // Re-resolve CSS custom properties when data-theme changes on Hero or ancestor scopes
      const mo =
        typeof MutationObserver !== "undefined"
          ? new MutationObserver(() => {
              if (!canvas) return;
              palette = resolvePalette(canvas);
              if (prefersReducedMotion) {
                renderFrame(0, elapsed);
              }
            })
          : null;
      let ancestor: Element | null = canvas;
      while (ancestor && mo) {
        mo.observe(ancestor, { attributes: true, attributeFilter: ["data-theme"] });
        ancestor = ancestor.parentElement;
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!canvas || prefersReducedMotion) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        targetMouse.x = Math.max(-0.75, Math.min(0.75, (e.clientX - rect.left) / rect.width - 0.5));
        targetMouse.y = Math.max(-0.75, Math.min(0.75, (e.clientY - rect.top) / rect.height - 0.5));
      };

      const handleMouseLeave = () => {
        targetMouse.x = 0;
        targetMouse.y = 0;
      };

      const handleReducedMotionChange = (e: MediaQueryListEvent) => {
        prefersReducedMotion = e.matches;
        startOrDrawStatic();
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave);
      reducedMotionQuery?.addEventListener("change", handleReducedMotionChange);

      return () => {
        cancelAnimationFrame(animationId);
        ro?.disconnect();
        mo?.disconnect();
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        reducedMotionQuery?.removeEventListener("change", handleReducedMotionChange);
      };
    }, [canvasRef]);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        tabIndex={-1}
        className={className}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    );
  },
);

HeroCanvas.displayName = "HeroCanvas";
