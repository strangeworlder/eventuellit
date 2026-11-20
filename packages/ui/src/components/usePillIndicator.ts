import type { CSSProperties, MouseEvent, RefObject } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";

export interface PillIndicatorConfig {
  /** CSS selector for nav items or tabs (e.g. `[data-nav-item]` or `[role="tab"]`). */
  itemSelector: string;
  /** Whether the element is the active item (current page or selected tab). */
  activeCheck: (el: HTMLElement) => boolean;
}

export interface SlimeIndicatorHandle {
  filterId: string;
  svgRef: RefObject<SVGSVGElement | null>;
  filterRef: RefObject<SVGFilterElement | null>;
  lobeLeftRef: RefObject<SVGRectElement | null>;
  lobeMidGroupRef: RefObject<SVGGElement | null>;
  lobeMidRef: RefObject<SVGRectElement | null>;
  lobeRightRef: RefObject<SVGRectElement | null>;
  lobeBulgeRef: RefObject<SVGEllipseElement | null>;
  lobeBeadRef: RefObject<SVGEllipseElement | null>;
  snoutGroupRef: RefObject<SVGGElement | null>;
  snoutRef: RefObject<SVGEllipseElement | null>;
  dropletGroupRef: RefObject<SVGGElement | null>;
  dropletRef: RefObject<SVGEllipseElement | null>;
  trailBeadRef: RefObject<SVGEllipseElement | null>;
}

type PillMouseEvent = MouseEvent<HTMLDivElement> | globalThis.MouseEvent;

interface RectBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SpringScalar {
  pos: number;
  vel: number;
}

interface SpringBox {
  x: SpringScalar;
  y: SpringScalar;
  w: SpringScalar;
  h: SpringScalar;
}

interface PointerInfluence {
  px: number;
  py: number;
  dx: number;
  dy: number;
  ux: number;
  uy: number;
  dist: number;
  outsideDist: number;
  proximity: number;
  signedPull: number;
}

const REST_ORGANIC = 0.12;
const RELAX_INITIAL_BOOST = 0.85;
const RELAX_BOOST_DECAY_SEC = 1.1;
const RELAX_TAU_SEC = 4.5;

interface LandingProfile {
  archetype: number;
  leftScaleDelta: number;
  midScaleDelta: number;
  rightScaleDelta: number;
  leftDy: number;
  midDy: number;
  rightDy: number;
  midShiftT: number;
  midWidthFrac: number;
  bulgeT: number;
  bulgeSide: number;
  bulgeAmp: number;
  beadSideX: number;
  beadSideY: number;
  beadScale: number;
}

interface WanderChannel {
  pos: number;
  mid: number;
  goal: number;
  timer: number;
  rate: number;
}

interface SimulationState {
  initialized: boolean;
  hasActive: boolean;
  activeIndex: number;
  target: RectBox;
  head: SpringBox;
  tail: SpringBox;
  hoverAmount: SpringScalar;
  cursorSlosh: SpringScalar;
  cursorWeight: SpringScalar;
  dropletX: SpringScalar;
  dropletY: SpringScalar;
  dropletScale: SpringScalar;
  snoutX: SpringScalar;
  snoutY: SpringScalar;
  aimAngleDeg: number;
  hoverTarget: PointerInfluence | null;
  organic: number;
  idleElapsed: number;
  profile: LandingProfile;
  targetProfile: LandingProfile;
  wander: WanderChannel[];
  lastMoveSign: number;
  lastFrameMs: number;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function rollLandingProfile(prevArchetype = -1): LandingProfile {
  const archetype =
    prevArchetype >= 0 && prevArchetype < 4
      ? (prevArchetype + 1 + Math.floor(Math.random() * 3)) % 4
      : Math.floor(Math.random() * 4);

  let leftScaleDelta = 0;
  let midScaleDelta = 0;
  let rightScaleDelta = 0;
  let midShiftT = randRange(-0.08, 0.08);
  let midWidthFrac = randRange(0.62, 0.76);

  if (archetype === 0) {
    // Plump center-bellied lens / droplet (fuller in the middle than at the ends)
    midScaleDelta = randRange(0.06, 0.13);
    leftScaleDelta = randRange(-0.13, -0.04);
    rightScaleDelta = randRange(-0.13, -0.04);
    midWidthFrac = randRange(0.68, 0.82);
  } else if (archetype === 1) {
    // Left-heavy pear / teardrop
    leftScaleDelta = randRange(0.08, 0.14);
    midScaleDelta = randRange(-0.05, 0.04);
    rightScaleDelta = randRange(-0.14, -0.06);
    midShiftT = randRange(-0.1, -0.02);
  } else if (archetype === 2) {
    // Right-heavy pear / teardrop
    leftScaleDelta = randRange(-0.14, -0.06);
    midScaleDelta = randRange(-0.05, 0.04);
    rightScaleDelta = randRange(0.08, 0.14);
    midShiftT = randRange(0.02, 0.1);
  } else {
    // Off-center saddle / asymmetric pinch
    const offsetSign = Math.random() < 0.5 ? -1 : 1;
    midScaleDelta = randRange(-0.21, -0.11);
    midShiftT = offsetSign * randRange(0.05, 0.14);
    leftScaleDelta = randRange(0.02, 0.11);
    rightScaleDelta = randRange(0.02, 0.11);
    midWidthFrac = randRange(0.58, 0.7);
  }

  const archSign = Math.random() < 0.5 ? -1 : 1;
  return {
    archetype,
    leftScaleDelta,
    midScaleDelta,
    rightScaleDelta,
    leftDy: randRange(-2.1, 2.1),
    midDy: archSign * randRange(0.4, 1.8),
    rightDy: randRange(-2.1, 2.1),
    midShiftT,
    midWidthFrac,
    bulgeT: randRange(0.2, 0.8),
    bulgeSide: Math.random() < 0.5 ? -1 : 1,
    bulgeAmp: randRange(0.17, 0.28),
    beadSideX: Math.random() < 0.5 ? -1 : 1,
    beadSideY: Math.random() < 0.5 ? -1 : 1,
    beadScale: randRange(0.55, 1.08),
  };
}

function lerpProfile(cur: LandingProfile, tgt: LandingProfile, alpha: number) {
  cur.archetype = tgt.archetype;
  cur.leftScaleDelta += (tgt.leftScaleDelta - cur.leftScaleDelta) * alpha;
  cur.midScaleDelta += (tgt.midScaleDelta - cur.midScaleDelta) * alpha;
  cur.rightScaleDelta += (tgt.rightScaleDelta - cur.rightScaleDelta) * alpha;
  cur.leftDy += (tgt.leftDy - cur.leftDy) * alpha;
  cur.midDy += (tgt.midDy - cur.midDy) * alpha;
  cur.rightDy += (tgt.rightDy - cur.rightDy) * alpha;
  cur.midShiftT += (tgt.midShiftT - cur.midShiftT) * alpha;
  cur.midWidthFrac += (tgt.midWidthFrac - cur.midWidthFrac) * alpha;
  cur.bulgeT += (tgt.bulgeT - cur.bulgeT) * alpha;
  cur.bulgeSide += (tgt.bulgeSide - cur.bulgeSide) * alpha;
  cur.bulgeAmp += (tgt.bulgeAmp - cur.bulgeAmp) * alpha;
  cur.beadSideX += (tgt.beadSideX - cur.beadSideX) * alpha;
  cur.beadSideY += (tgt.beadSideY - cur.beadSideY) * alpha;
  cur.beadScale += (tgt.beadScale - cur.beadScale) * alpha;
}

function createWanderChannels(): WanderChannel[] {
  const rates = [0.85, 0.72, 0.91, 0.64, 0.55, 0.78];
  return rates.map((rate) => {
    const start = randRange(-0.45, 0.45);
    return {
      pos: start,
      mid: start,
      goal: randRange(-1, 1),
      timer: randRange(0.6, 2.8),
      rate,
    };
  });
}

function stepWanderChannels(channels: WanderChannel[], dt: number) {
  for (const ch of channels) {
    ch.timer -= dt;
    if (ch.timer <= 0) {
      ch.goal = randRange(-1, 1);
      ch.timer = randRange(1.5, 3.8);
    }
    const alpha = 1 - Math.exp(-ch.rate * dt);
    ch.mid += (ch.goal - ch.mid) * alpha;
    ch.pos += (ch.mid - ch.pos) * alpha;
  }
}

function makeSpring(initial = 0): SpringScalar {
  return { pos: initial, vel: 0 };
}

function makeSpringBox(box: RectBox): SpringBox {
  return {
    x: makeSpring(box.x),
    y: makeSpring(box.y),
    w: makeSpring(box.w),
    h: makeSpring(box.h),
  };
}

function snapSpring(s: SpringScalar, value: number) {
  s.pos = value;
  s.vel = 0;
}

function snapSpringBox(sb: SpringBox, box: RectBox) {
  snapSpring(sb.x, box.x);
  snapSpring(sb.y, box.y);
  snapSpring(sb.w, box.w);
  snapSpring(sb.h, box.h);
}

function stepSpring(
  s: SpringScalar,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
): boolean {
  const disp = s.pos - target;
  const force = -stiffness * disp - damping * s.vel;
  s.vel += force * dt;
  s.pos += s.vel * dt;
  if (Math.abs(s.pos - target) < 0.08 && Math.abs(s.vel) < 0.4) {
    s.pos = target;
    s.vel = 0;
    return false;
  }
  return true;
}

function stepSpringBox(
  sb: SpringBox,
  target: RectBox,
  stiffness: number,
  damping: number,
  dt: number,
): boolean {
  const mx = stepSpring(sb.x, target.x, stiffness, damping, dt);
  const my = stepSpring(sb.y, target.y, stiffness, damping, dt);
  const mw = stepSpring(sb.w, target.w, stiffness, damping, dt);
  const mh = stepSpring(sb.h, target.h, stiffness, damping, dt);
  return mx || my || mw || mh;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveItemFromEvent(
  e: PillMouseEvent,
  listEl: HTMLElement,
  itemSelector: string,
): HTMLElement | null {
  const nativeEvent = "nativeEvent" in e ? e.nativeEvent : e;
  const path = nativeEvent?.composedPath?.() ?? [];
  if (path.length === 0) {
    const el = e.target instanceof Element ? e.target : null;
    const hit = el?.closest(itemSelector);
    return hit instanceof HTMLElement && listEl.contains(hit) ? hit : null;
  }
  for (const node of path) {
    if (node === listEl) break;
    if (!(node instanceof HTMLElement) || !listEl.contains(node)) continue;
    try {
      if (node.matches(itemSelector)) {
        return node;
      }
    } catch {
      break;
    }
  }
  return null;
}

function measureSlimeBox(itemEl: HTMLElement, listEl: HTMLElement): RectBox | null {
  const listRect = listEl.getBoundingClientRect();
  const itemRect = itemEl.getBoundingClientRect();
  if (itemRect.width <= 0 || itemRect.height <= 0) {
    return null;
  }
  const offsetX = listEl.clientLeft || 0;
  const offsetY = listEl.clientTop || 0;
  const rawX = itemRect.left - listRect.left - offsetX;
  const rawY = itemRect.top - listRect.top - offsetY;
  return {
    x: rawX - 2,
    y: rawY + 2,
    w: itemRect.width + 4,
    h: Math.max(22, itemRect.height - 7),
  };
}

function setRectAttrs(el: SVGRectElement | null, x: number, y: number, w: number, h: number) {
  if (!el) return;
  const safeW = Math.max(0.5, w);
  const safeH = Math.max(0.5, h);
  const r = Math.min(safeW / 2, safeH / 2);
  el.setAttribute("x", x.toFixed(3));
  el.setAttribute("y", y.toFixed(3));
  el.setAttribute("width", safeW.toFixed(3));
  el.setAttribute("height", safeH.toFixed(3));
  el.setAttribute("rx", r.toFixed(3));
  el.setAttribute("ry", r.toFixed(3));
}

function setEllipseAttrs(
  el: SVGEllipseElement | null,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) {
  if (!el) return;
  el.setAttribute("cx", cx.toFixed(3));
  el.setAttribute("cy", cy.toFixed(3));
  el.setAttribute("rx", Math.max(0.1, rx).toFixed(3));
  el.setAttribute("ry", Math.max(0.1, ry).toFixed(3));
}

function createInitialSimulationState(): SimulationState {
  const initialProfile = rollLandingProfile();
  return {
    initialized: false,
    hasActive: false,
    activeIndex: 0,
    target: { x: 0, y: 0, w: 0, h: 0 },
    head: makeSpringBox({ x: 0, y: 0, w: 0, h: 0 }),
    tail: makeSpringBox({ x: 0, y: 0, w: 0, h: 0 }),
    hoverAmount: makeSpring(0),
    cursorSlosh: makeSpring(0),
    cursorWeight: makeSpring(0),
    dropletX: makeSpring(0),
    dropletY: makeSpring(0),
    dropletScale: makeSpring(0),
    snoutX: makeSpring(0),
    snoutY: makeSpring(0),
    aimAngleDeg: 0,
    hoverTarget: null,
    organic: 1,
    idleElapsed: 0,
    profile: { ...initialProfile },
    targetProfile: { ...initialProfile },
    wander: createWanderChannels(),
    lastMoveSign: 1,
    lastFrameMs: 0,
  };
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Shared viscous metaball-slime indicator physics for TopNavList and TabsList.
 * Drives an SVG gooey filter field without per-frame React re-renders:
 * - At rest: calm, organic multi-lobe puddle silhouette (zero idle rAF frames).
 * - On hover: main mass narrows and tugs toward the hovered tab while extruding a
 *   pseudopod snout and a scout droplet (necked on adjacent tabs, pinched off on distant tabs).
 * - On change: leading front advances fast while trailing tail slurps behind and coalesces.
 */
export function usePillIndicator({ itemSelector, activeCheck }: PillIndicatorConfig) {
  const rawId = useId();
  const filterId = `ds-slime-goo-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const listRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const filterRef = useRef<SVGFilterElement | null>(null);
  const lobeLeftRef = useRef<SVGRectElement | null>(null);
  const lobeMidGroupRef = useRef<SVGGElement | null>(null);
  const lobeMidRef = useRef<SVGRectElement | null>(null);
  const lobeRightRef = useRef<SVGRectElement | null>(null);
  const lobeBulgeRef = useRef<SVGEllipseElement | null>(null);
  const lobeBeadRef = useRef<SVGEllipseElement | null>(null);
  const snoutGroupRef = useRef<SVGGElement | null>(null);
  const snoutRef = useRef<SVGEllipseElement | null>(null);
  const dropletGroupRef = useRef<SVGGElement | null>(null);
  const dropletRef = useRef<SVGEllipseElement | null>(null);
  const trailBeadRef = useRef<SVGEllipseElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const simRef = useRef<SimulationState>(createInitialSimulationState());

  const updateFilterBounds = useCallback(() => {
    const listEl = listRef.current;
    const filterEl = filterRef.current;
    if (!listEl || !filterEl) return;
    const rect = listEl.getBoundingClientRect();
    const w = Math.max(rect.width, listEl.offsetWidth, 320);
    const h = Math.max(rect.height, listEl.offsetHeight, 56);
    filterEl.setAttribute("x", "-56");
    filterEl.setAttribute("y", "-36");
    filterEl.setAttribute("width", String(Math.ceil(w + 112)));
    filterEl.setAttribute("height", String(Math.ceil(h + 72)));
  }, []);

  const renderFrame = useCallback(() => {
    const sim = simRef.current;
    const svgEl = svgRef.current;
    if (!svgEl) return;

    if (!sim.hasActive || !sim.initialized) {
      svgEl.style.opacity = "0";
      svgEl.setAttribute("data-slime-state", "hidden");
      return;
    }

    svgEl.style.opacity = "1";

    const hx = sim.head.x.pos;
    const hy = sim.head.y.pos;
    const hw = Math.max(20, sim.head.w.pos);
    const hh = Math.max(16, sim.head.h.pos);

    const tx = sim.tail.x.pos;
    const ty = sim.tail.y.pos;
    const tw = Math.max(20, sim.tail.w.pos);
    const th = Math.max(16, sim.tail.h.pos);

    const headCx = hx + hw / 2;
    const headCy = hy + hh / 2;
    const tailCx = tx + tw / 2;
    const tailCy = ty + th / 2;

    const oozeDx = headCx - tailCx;
    const oozeDy = headCy - tailCy;
    const oozeDist = Math.hypot(oozeDx, oozeDy);

    const targetCx = sim.target.x + sim.target.w / 2;
    const targetCy = sim.target.y + sim.target.h / 2;
    const tailDistToHome = Math.hypot(tailCx - targetCx, tailCy - targetCy);

    const isTugging =
      sim.hoverTarget !== null ||
      sim.hoverAmount.pos > 0.04 ||
      Math.abs(sim.cursorSlosh.pos) > 0.04 ||
      sim.cursorWeight.pos > 0.04;
    const isOozing = sim.hoverTarget === null ? oozeDist > 1.2 : tailDistToHome > 18;
    const org = clamp(sim.organic, REST_ORGANIC, 1);
    const prof = sim.profile;
    svgEl.setAttribute("data-slime-state", isOozing ? "oozing" : isTugging ? "tugging" : "idle");
    svgEl.setAttribute("data-slime-organic", org.toFixed(3));
    svgEl.setAttribute("data-slime-archetype", String(prof.archetype));

    const baseW = Math.max(sim.target.w, 40);
    const baseH = Math.max(sim.target.h, 20);
    const stretch = (baseW + oozeDist) / baseW;

    // Detect arrival rebound when tail slightly overshoots head along travel axis
    const signedDelta = oozeDx * sim.lastMoveSign;
    const reboundOvershoot = signedDelta < 0 ? Math.min(5, Math.abs(signedDelta)) : 0;
    const plumpRebound = 1 + (reboundOvershoot / baseW) * 1.1;

    // Weighted cursor compression & stretch (squats under direct cursor weight, narrows when pulled far)
    const hoverAmt = clamp(sim.hoverAmount.pos, 0, 1.3);
    const slosh = clamp(sim.cursorSlosh.pos, -1.1, 1.1);
    const weight = clamp(sim.cursorWeight.pos, 0, 1.15);
    const hoverSquashY = (1 - Math.min(0.11, hoverAmt * 0.085)) * (1 - 0.075 * weight);
    const viscousScaleY = hoverSquashY * plumpRebound;

    // Continuous small volume-conserving random organic motion (disabled for reduced motion)
    const reduced = prefersReducedMotion();
    const w0 = reduced ? 0 : (sim.wander[0]?.pos ?? 0);
    const w1 = reduced ? 0 : (sim.wander[1]?.pos ?? 0);
    const w2 = reduced ? 0 : (sim.wander[2]?.pos ?? 0);
    const w3 = reduced ? 0 : (sim.wander[3]?.pos ?? 0);
    const w4 = reduced ? 0 : (sim.wander[4]?.pos ?? 0);
    const w5 = reduced ? 0 : (sim.wander[5]?.pos ?? 0);
    const wMean = (w0 + w1 + w2) / 3;

    const travelDist = isOozing ? oozeDist : 0;
    const calm = clamp(1 - travelDist / 26, 0, 1);
    const ambLeftScale = calm * (w0 - 0.72 * wMean) * 0.062;
    const ambMidScale = calm * (w1 - 0.72 * wMean) * 0.068;
    const ambRightScale = calm * (w2 - 0.72 * wMean) * 0.062;
    const ambLeftDy = calm * w3 * 1.3;
    const ambRightDy = calm * (-w3 * 1.1 + w4 * 0.55);
    const ambMidDy = calm * (-w3 * 0.35 - w4 * 0.85);
    const ambLeftDx = calm * w5 * 0.85;
    const ambRightDx = calm * -w4 * 0.85;

    const lobeWidthFrac = 0.54 - 0.07 * org;

    // Determine left-most and right-most boxes continuously
    const headIsRight = headCx >= tailCx;
    const leftBox = headIsRight ? { x: tx, y: ty, w: tw, h: th } : { x: hx, y: hy, w: hw, h: hh };
    const rightBox = headIsRight ? { x: hx, y: hy, w: hw, h: hh } : { x: tx, y: ty, w: tw, h: th };

    const rightness = Math.tanh(oozeDx / 18);
    const oozeTaper = 1 / stretch ** 0.48;
    const leftOozeScale = rightness > 0 ? 1 - rightness * (1 - oozeTaper) : 1;
    const rightOozeScale = rightness < 0 ? 1 + rightness * (1 - oozeTaper) : 1;

    const spanX = Math.max(rightBox.x + rightBox.w - leftBox.x, baseW * 0.6);
    const leftCy = leftBox.y + leftBox.h / 2;
    const rightCy = rightBox.y + rightBox.h / 2;

    // 1. Left organic lobe (rolls heavy fluid mass toward left when cursor is left, thins when cursor pulls right)
    const leftW = Math.max(leftBox.w * lobeWidthFrac, Math.min(spanX * 0.34, leftBox.w * 0.72));
    const leftRestScale = 1 + org * prof.leftScaleDelta + ambLeftScale - slosh * 0.115;
    const leftH =
      leftBox.h * (calm * leftRestScale + (1 - calm) * 0.96) * leftOozeScale * viscousScaleY;
    const leftDy = calm * org * prof.leftDy + ambLeftDy - slosh * 1.55;
    setRectAttrs(
      lobeLeftRef.current,
      leftBox.x + ambLeftDx,
      leftCy - leftH / 2 + leftDy,
      leftW,
      leftH,
    );

    // 2. Right organic lobe (rolls heavy fluid mass toward right when cursor is right, thins when cursor pulls left)
    const rightW = Math.max(rightBox.w * lobeWidthFrac, Math.min(spanX * 0.34, rightBox.w * 0.72));
    const rightRestScale = 1 + org * prof.rightScaleDelta + ambRightScale + slosh * 0.115;
    const rightH =
      rightBox.h * (calm * rightRestScale + (1 - calm) * 0.96) * rightOozeScale * viscousScaleY;
    const rightDy = calm * org * prof.rightDy + ambRightDy + slosh * 1.55;
    setRectAttrs(
      lobeRightRef.current,
      rightBox.x + rightBox.w - rightW + ambRightDx,
      rightCy - rightH / 2 + rightDy,
      rightW,
      rightH,
    );

    // 3. Center body / viscous bridge (shifts center of gravity smoothly with cursor weight)
    const leftAnchorX = leftBox.x + leftW * 0.55;
    const rightAnchorX = rightBox.x + rightBox.w - rightW * 0.55;
    const midShiftPx =
      calm * org * prof.midShiftT * baseW + calm * w4 * 2.2 + calm * slosh * baseW * 0.055;
    const midCx = (leftAnchorX + rightAnchorX) / 2 + midShiftPx;
    const midCy = (leftCy + rightCy) / 2 + calm * org * prof.midDy + ambMidDy + weight * 0.7;
    const bridgeSpan = Math.hypot(rightAnchorX - leftAnchorX, rightCy - leftCy);
    const restBridgeFrac = 0.98 - (0.98 - prof.midWidthFrac) * org;
    const bridgeW = Math.max(
      baseW * (calm * restBridgeFrac + (1 - calm) * 0.64),
      bridgeSpan + Math.min(leftW, rightW) * 0.55,
    );
    const bridgeAngle =
      (Math.atan2(rightCy - leftCy, Math.max(1, rightAnchorX - leftAnchorX)) * 180) / Math.PI;
    const restMidScale = 0.99 + org * prof.midScaleDelta + ambMidScale;
    const waistRatio = clamp(restMidScale / stretch ** 0.7, 0.28, 1.14);
    const bridgeH = baseH * waistRatio * viscousScaleY;

    if (lobeMidGroupRef.current) {
      lobeMidGroupRef.current.setAttribute(
        "transform",
        `translate(${midCx.toFixed(3)} ${midCy.toFixed(3)}) rotate(${bridgeAngle.toFixed(3)})`,
      );
    }
    setRectAttrs(lobeMidRef.current, -bridgeW / 2, -bridgeH / 2, bridgeW, bridgeH);

    // 4. Wandering organic bulge (slowly drifts along the membrane even at calm equilibrium)
    const liveBulgeT = clamp(prof.bulgeT + (reduced ? 0 : w4 * 0.16), 0.16, 0.84);
    const bulgeCx = leftBox.x + spanX * liveBulgeT;
    const ambientRipple = reduced ? 0 : (0.12 + 0.08 * Math.abs(w5)) * (w3 >= 0 ? 1 : -1);
    const bulgeSideOffset =
      (org * prof.bulgeSide * prof.bulgeAmp + (1 - org) * ambientRipple) * calm + 0.08 * (1 - calm);
    const bulgeCy = leftCy * (1 - liveBulgeT) + rightCy * liveBulgeT + baseH * bulgeSideOffset;
    const bulgeRx = Math.min(22, baseW * (0.15 + 0.04 * Math.abs(w0))) * (0.5 + 0.5 * calm);
    const bulgeRy =
      baseH * (0.15 + 0.14 * org + (reduced ? 0 : 0.05 * Math.abs(w5))) * calm * viscousScaleY;
    setEllipseAttrs(lobeBulgeRef.current, bulgeCx, bulgeCy, bulgeRx, bulgeRy);

    // 5. Randomized corner surface-tension bleb (absorbs as pill relaxes, with subtle micro-pulse)
    const beadAmbient = reduced ? 0 : Math.max(0, w2 - 0.25) * 0.45;
    const beadStrength =
      calm *
      clamp(org * prof.beadScale + (1 - org) * beadAmbient, 0, 1.15) *
      clamp(1 - hoverAmt * 1.1, 0, 1);
    const beadOnRight = prof.beadSideX >= 0;
    const beadCx = beadOnRight ? rightBox.x + rightBox.w - 3.5 : leftBox.x + 3.5;
    const beadCy = (beadOnRight ? rightCy : leftCy) + (prof.beadSideY >= 0 ? 1 : -1) * baseH * 0.26;
    setEllipseAttrs(lobeBeadRef.current, beadCx, beadCy, 7.2 * beadStrength, 5.8 * beadStrength);

    // 6. Minimalist integrated meniscus nose (stays fused inside the main contour; no separate hover bubble)
    const noseScale = clamp(sim.dropletScale.pos, 0, 1);
    if (snoutGroupRef.current) {
      snoutGroupRef.current.setAttribute(
        "transform",
        `translate(${sim.snoutX.pos.toFixed(3)} ${sim.snoutY.pos.toFixed(3)}) rotate(${sim.aimAngleDeg.toFixed(3)})`,
      );
    }
    setEllipseAttrs(snoutRef.current, 0, 0, 10.5 * noseScale, 7.4 * noseScale);
    setEllipseAttrs(dropletRef.current, headCx, headCy, 0.1, 0.1);

    // 7. Trailing viscous bead during long multi-tab jumps
    const trailFactor = clamp((oozeDist - 64) / 70, 0, 1);
    if (trailFactor > 0.02 && oozeDist > 1) {
      const ux = oozeDx / oozeDist;
      const uy = oozeDy / oozeDist;
      const trailTipX = tailCx - ux * (tw * 0.46 + 9 * trailFactor);
      const trailTipY = tailCy - uy * (th * 0.3 + 6 * trailFactor);
      setEllipseAttrs(
        trailBeadRef.current,
        trailTipX,
        trailTipY,
        7.8 * trailFactor,
        6.2 * trailFactor,
      );
    } else {
      setEllipseAttrs(trailBeadRef.current, tailCx, tailCy, 0.1, 0.1);
    }
  }, []);

  const computeDesiredTargets = useCallback(() => {
    const sim = simRef.current;
    const base = sim.target;
    const acx = base.x + base.w / 2;
    const acy = base.y + base.h / 2;

    if (!sim.hoverTarget) {
      return {
        headTarget: base,
        tailTarget: base,
        hoverAmtTarget: 0,
        sloshTarget: 0,
        weightTarget: 0,
        snoutTargetX: acx,
        snoutTargetY: acy,
        snoutScaleTarget: 0,
        dropTargetX: acx,
        dropTargetY: acy,
      };
    }

    const { dx, dy, ux, uy, outsideDist, proximity, signedPull } = sim.hoverTarget;
    const hw = Math.max(base.w / 2, 1);
    const hh = Math.max(base.h / 2, 1);

    // Gravitational downward sag & subtle horizontal spread when cursor weight presses near/over the slime
    const weightSagY = 2.4 * proximity + clamp(dy * 0.14, -1.4, 2.2);
    const spreadW = 4.2 * proximity;

    // Minimalist cohesive pull: leading side leans heavily toward cursor while trailing flank clings with surface tension
    const leadShiftX =
      signedPull * (5.0 * (1 - proximity * 0.4) + Math.min(11.5, outsideDist * 0.042)) +
      clamp(dx * 0.08 * proximity, -5, 5);
    const tailShiftX =
      signedPull * Math.min(3.6, Math.abs(dx) * 0.012) + clamp(dx * 0.045 * proximity, -3, 3);

    const headTarget: RectBox = {
      x: base.x - spreadW * 0.5 + leadShiftX,
      y: base.y + weightSagY + uy * Math.min(3, outsideDist * 0.015),
      w: base.w + spreadW,
      h: base.h,
    };
    const tailTarget: RectBox = {
      x: base.x - spreadW * 0.5 + tailShiftX,
      y: base.y + weightSagY * 0.8,
      w: base.w + spreadW,
      h: base.h,
    };

    // Subtle integrated meniscus nose (stays fused inside the main contour — no detached flying bubbles)
    const tRay = 1 / Math.max(Math.abs(ux) / hw, Math.abs(uy) / hh, 0.001);
    const leadEdgeX = headTarget.x + headTarget.w / 2 + ux * Math.min(tRay, hw + 2);
    const leadEdgeY = headTarget.y + headTarget.h / 2 + uy * Math.min(tRay, hh);
    const noseStrength = clamp((outsideDist - 8) / 75, 0, 0.72);

    return {
      headTarget,
      tailTarget,
      hoverAmtTarget: clamp(outsideDist / 140, 0, 0.95),
      sloshTarget: signedPull,
      weightTarget: proximity,
      snoutTargetX: leadEdgeX - ux * 3.2,
      snoutTargetY: leadEdgeY - uy * 1.5,
      snoutScaleTarget: noseStrength,
      dropTargetX: acx,
      dropTargetY: acy,
    };
  }, []);

  const tick = useCallback(
    (nowMs: number) => {
      const sim = simRef.current;
      if (!sim.hasActive || !sim.initialized) {
        rafRef.current = null;
        renderFrame();
        return;
      }

      if (prefersReducedMotion() || (typeof document !== "undefined" && document.hidden)) {
        sim.lastFrameMs = 0;
        rafRef.current = null;
        return;
      }

      const rawDt = sim.lastFrameMs > 0 ? (nowMs - sim.lastFrameMs) / 1000 : 1 / 60;
      sim.lastFrameMs = nowMs;
      // Sub-step clamp keeps explicit Euler springs unconditionally stable even after tab backgrounding
      const totalDt = Math.min(rawDt, 0.05);
      const steps = totalDt > 0.02 ? 2 : 1;
      const dt = totalDt / steps;
      const relaxDt = Math.min(Math.max(rawDt, 0), 0.25);

      const desired = computeDesiredTargets();
      const travelDist = Math.hypot(sim.head.x.pos - sim.target.x, sim.head.y.pos - sim.target.y);
      const isTraveling = travelDist > 22;
      // Brisk springs for tab navigation; heavy, weighty mercury-like inertia for cursor hover
      const headStiff = isTraveling ? 255 : 78;
      const headDamp = isTraveling ? 23.5 : 14.8;
      const tailStiff = isTraveling ? 105 : 64;
      const tailDamp = isTraveling ? 14.0 : 13.5;

      for (let i = 0; i < steps; i++) {
        stepSpringBox(sim.head, desired.headTarget, headStiff, headDamp, dt);
        stepSpringBox(sim.tail, desired.tailTarget, tailStiff, tailDamp, dt);
        stepSpring(sim.hoverAmount, desired.hoverAmtTarget, 85, 15.5, dt);
        stepSpring(sim.cursorSlosh, desired.sloshTarget, 74, 14.2, dt);
        stepSpring(sim.cursorWeight, desired.weightTarget, 78, 14.8, dt);
        stepSpring(sim.snoutX, desired.snoutTargetX, 110, 17, dt);
        stepSpring(sim.snoutY, desired.snoutTargetY, 110, 17, dt);
        stepSpring(sim.dropletX, desired.dropTargetX, 140, 19, dt);
        stepSpring(sim.dropletY, desired.dropTargetY, 140, 19, dt);
        stepSpring(sim.dropletScale, desired.snoutScaleTarget, 95, 16, dt);
      }

      // Smoothly blend toward the active randomized landing profile and advance ambient micro-motion
      lerpProfile(sim.profile, sim.targetProfile, 1 - Math.exp(-5.5 * relaxDt));
      stepWanderChannels(sim.wander, relaxDt);

      const headCx = sim.head.x.pos + sim.head.w.pos / 2;
      const headCy = sim.head.y.pos + sim.head.h.pos / 2;
      const tailCx = sim.tail.x.pos + sim.tail.w.pos / 2;
      const tailCy = sim.tail.y.pos + sim.tail.h.pos / 2;
      const oozeDist = Math.hypot(headCx - tailCx, headCy - tailCy);
      const isStressed =
        oozeDist > 1.0 ||
        sim.hoverTarget !== null ||
        sim.hoverAmount.pos > 0.05 ||
        Math.abs(sim.cursorSlosh.pos) > 0.05 ||
        sim.cursorWeight.pos > 0.05 ||
        sim.dropletScale.pos > 0.06;

      if (isStressed) {
        sim.idleElapsed = 0;
        const wakeRate = oozeDist > 4 ? 14 : 7.5;
        sim.organic += (1 - sim.organic) * (1 - Math.exp(-wakeRate * relaxDt));
        if (1 - sim.organic < 0.002) {
          sim.organic = 1;
        }
      } else {
        // Viscoelastic curve: brisk initial relaxation in the first ~1.2s, decelerating onto the slow tail (1 / RELAX_TAU_SEC)
        sim.idleElapsed += relaxDt;
        if (sim.organic > REST_ORGANIC + 0.003) {
          const t = Math.max(0, sim.idleElapsed - 0.06);
          const onset = 1 - Math.exp(-t / 0.1);
          const baseRate = 1 / RELAX_TAU_SEC;
          const initialBoost = RELAX_INITIAL_BOOST * Math.exp(-t / RELAX_BOOST_DECAY_SEC);
          const relaxRate = onset * (baseRate + initialBoost);
          sim.organic += (REST_ORGANIC - sim.organic) * (1 - Math.exp(-relaxRate * relaxDt));
          if (sim.organic <= REST_ORGANIC + 0.003) {
            sim.organic = REST_ORGANIC;
          }
        } else {
          sim.organic = REST_ORGANIC;
        }
      }

      renderFrame();
      rafRef.current = window.requestAnimationFrame(tick);
    },
    [computeDesiredTargets, renderFrame],
  );

  const ensureAnimating = useCallback(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) {
      const sim = simRef.current;
      const desired = computeDesiredTargets();
      snapSpringBox(sim.head, desired.headTarget);
      snapSpringBox(sim.tail, desired.tailTarget);
      snapSpring(sim.hoverAmount, 0);
      snapSpring(sim.cursorSlosh, 0);
      snapSpring(sim.cursorWeight, 0);
      snapSpring(sim.dropletScale, 0);
      snapSpring(sim.dropletX, desired.dropTargetX);
      snapSpring(sim.dropletY, desired.dropTargetY);
      snapSpring(sim.snoutX, desired.snoutTargetX);
      snapSpring(sim.snoutY, desired.snoutTargetY);
      sim.organic = REST_ORGANIC;
      sim.idleElapsed = 0;
      renderFrame();
      return;
    }
    if (typeof document !== "undefined" && document.hidden) {
      return;
    }
    if (rafRef.current === null) {
      simRef.current.lastFrameMs = 0;
      rafRef.current = window.requestAnimationFrame(tick);
    }
  }, [computeDesiredTargets, renderFrame, tick]);

  const setListTugCssVars = useCallback(
    (tugX: number, tugY: number, ox: string, oy: string, sx: number, sy: number) => {
      const el = listRef.current;
      if (!el) return;
      el.style.setProperty("--tab-tug-x", `${tugX}px`);
      el.style.setProperty("--tab-tug-y", `${tugY}px`);
      el.style.setProperty("--tab-tug-ox", ox);
      el.style.setProperty("--tab-tug-oy", oy);
      el.style.setProperty("--tab-stretch-x", String(sx));
      el.style.setProperty("--tab-stretch-y", String(sy));
    },
    [],
  );

  const syncActiveGeometry = useCallback(
    (animateIfMoved: boolean) => {
      const listEl = listRef.current;
      if (!listEl) return;

      updateFilterBounds();

      const items = Array.from(listEl.querySelectorAll<HTMLElement>(itemSelector));
      const activeIdx = items.findIndex((item) => activeCheck(item));
      const activeEl = activeIdx >= 0 ? items[activeIdx] : undefined;
      const sim = simRef.current;

      if (!activeEl) {
        sim.hasActive = false;
        sim.initialized = false;
        sim.hoverTarget = null;
        renderFrame();
        return;
      }

      const box = measureSlimeBox(activeEl, listEl);
      if (!box) {
        // Container may currently be display:none (e.g. hidden tablet:flex); wait for ResizeObserver
        renderFrame();
        return;
      }

      const prevCx = sim.target.x + sim.target.w / 2;
      const nextCx = box.x + box.w / 2;
      if (Math.abs(nextCx - prevCx) > 1) {
        sim.lastMoveSign = nextCx >= prevCx ? 1 : -1;
      }

      const moved =
        Math.abs(sim.target.x - box.x) > 0.5 ||
        Math.abs(sim.target.y - box.y) > 0.5 ||
        Math.abs(sim.target.w - box.w) > 0.5 ||
        Math.abs(sim.target.h - box.h) > 0.5;

      sim.hasActive = true;
      sim.activeIndex = activeIdx;
      sim.target = box;

      if (!sim.initialized || !animateIfMoved || prefersReducedMotion()) {
        const wasUninitialized = !sim.initialized;
        sim.initialized = true;
        snapSpringBox(sim.head, box);
        snapSpringBox(sim.tail, box);
        const cx = box.x + box.w / 2;
        const cy = box.y + box.h / 2;
        snapSpring(sim.snoutX, cx);
        snapSpring(sim.snoutY, cy);
        snapSpring(sim.dropletX, cx);
        snapSpring(sim.dropletY, cy);
        snapSpring(sim.dropletScale, 0);
        snapSpring(sim.hoverAmount, 0);
        snapSpring(sim.cursorSlosh, 0);
        snapSpring(sim.cursorWeight, 0);
        if (prefersReducedMotion()) {
          sim.organic = REST_ORGANIC;
          sim.idleElapsed = 0;
          renderFrame();
          return;
        }
        if (wasUninitialized) {
          const fresh = rollLandingProfile(sim.targetProfile.archetype);
          sim.profile = { ...fresh };
          sim.targetProfile = { ...fresh };
          sim.organic = 1;
          sim.idleElapsed = 0;
        }
        renderFrame();
        ensureAnimating();
        return;
      }

      if (moved) {
        // Roll a distinct new landing puddle anatomy so every arrival settles differently
        sim.hoverTarget = null;
        sim.targetProfile = rollLandingProfile(sim.targetProfile.archetype);
        sim.organic = 1;
        sim.idleElapsed = 0;
        setListTugCssVars(0, 0, "50%", "50%", 1, 1);
        if (svgRef.current) {
          svgRef.current.setAttribute("data-slime-state", "oozing");
        }
        ensureAnimating();
      } else {
        renderFrame();
      }
    },
    [
      activeCheck,
      ensureAnimating,
      itemSelector,
      renderFrame,
      setListTugCssVars,
      updateFilterBounds,
    ],
  );

  useIsomorphicLayoutEffect(() => {
    syncActiveGeometry(false);
  }, [syncActiveGeometry]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const mutationObs = new MutationObserver(() => {
      syncActiveGeometry(true);
    });
    mutationObs.observe(listEl, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ["aria-selected", "aria-current", "data-state"],
    });

    const resizeObs =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            syncActiveGeometry(false);
          })
        : null;
    resizeObs?.observe(listEl);

    const handleVisibility = () => {
      if (typeof document === "undefined") return;
      if (document.hidden) {
        if (rafRef.current !== null && typeof window !== "undefined") {
          window.cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (simRef.current.hasActive) {
        ensureAnimating();
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      mutationObs.disconnect();
      resizeObs?.disconnect();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
      if (rafRef.current !== null && typeof window !== "undefined") {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [ensureAnimating, syncActiveGeometry]);

  const triggerSettle = useCallback(() => {
    const sim = simRef.current;
    sim.hoverTarget = null;
    setListTugCssVars(0, 0, "50%", "50%", 1, 1);
    syncActiveGeometry(true);
    ensureAnimating();
  }, [ensureAnimating, setListTugCssVars, syncActiveGeometry]);

  const handlePointerEvent = useCallback(
    (e: PillMouseEvent) => {
      const listEl = listRef.current;
      if (!listEl) return;

      const hitItem = resolveItemFromEvent(e, listEl, itemSelector);
      if (hitItem?.hasAttribute("disabled")) {
        triggerSettle();
        return;
      }

      if (prefersReducedMotion()) {
        return;
      }

      const items = Array.from(listEl.querySelectorAll<HTMLElement>(itemSelector));
      const activeIdx = items.findIndex((t) => activeCheck(t));
      const activeEl = activeIdx >= 0 ? items[activeIdx] : undefined;
      if (!activeEl) return;

      const activeBox = measureSlimeBox(activeEl, listEl);
      if (!activeBox) return;

      const sim = simRef.current;
      if (!sim.initialized) {
        sim.initialized = true;
        sim.hasActive = true;
        sim.activeIndex = activeIdx;
        sim.target = activeBox;
        snapSpringBox(sim.head, activeBox);
        snapSpringBox(sim.tail, activeBox);
      }

      // Entering hover from rest rolls a fresh landing shape for when the cursor leaves
      if (!sim.hoverTarget) {
        sim.targetProfile = rollLandingProfile(sim.targetProfile.archetype);
      }

      const listRect = listEl.getBoundingClientRect();
      const offsetX = listEl.clientLeft || 0;
      const offsetY = listEl.clientTop || 0;
      const activeCx = activeBox.x + activeBox.w / 2;
      const activeCy = activeBox.y + activeBox.h / 2;

      const hasClientCoords = typeof e.clientX === "number" && (e.clientX !== 0 || e.clientY !== 0);
      const hitBox = hitItem ? measureSlimeBox(hitItem, listEl) : null;
      const px = hasClientCoords
        ? e.clientX - listRect.left - offsetX
        : hitBox
          ? hitBox.x + hitBox.w / 2
          : activeCx;
      const py = hasClientCoords
        ? e.clientY - listRect.top - offsetY
        : hitBox
          ? hitBox.y + hitBox.h / 2
          : activeCy;

      const dx = px - activeCx;
      const dy = py - activeCy;
      const dist = Math.hypot(dx, dy);
      const ux = dist > 0.001 ? dx / dist : 1;
      const uy = dist > 0.001 ? dy / dist : 0;

      const hw = Math.max(activeBox.w / 2, 1);
      const outsideDist = Math.max(0, Math.abs(dx) - hw * 0.72);
      const proximity = Math.exp(-(dx * dx) / (2 * Math.max(activeBox.w * 1.1, 88) ** 2));
      const signedPull = Math.tanh(dx / 105);

      if (sim.dropletScale.pos < 0.05) {
        const seedX = activeCx + ux * Math.max(0, hw - 6);
        const seedY = activeCy + uy * Math.max(0, activeBox.h / 2 - 5);
        snapSpring(sim.snoutX, seedX);
        snapSpring(sim.snoutY, seedY);
      }

      sim.aimAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      sim.hoverTarget = {
        px,
        py,
        dx,
        dy,
        ux,
        uy,
        dist,
        outsideDist,
        proximity,
        signedPull,
      };

      const maxPull = 14;
      const pullX = clamp(dx * 0.075, -maxPull, maxPull);
      const pullY = clamp(dy * 0.075 + proximity * 1.8, -maxPull, maxPull);
      const scaleX = 1 + (Math.abs(pullX) + proximity * 3) / Math.max(activeBox.w, 1);
      const scaleY = Math.max(
        0.86,
        1 - (Math.abs(pullX) / Math.max(activeBox.w, 1)) * 0.5 - proximity * 0.06,
      );
      const edgeEps = 0.5;
      const originX = dx > edgeEps ? "0%" : dx < -edgeEps ? "100%" : "50%";
      const originY = dy > edgeEps ? "0%" : dy < -edgeEps ? "100%" : "50%";

      setListTugCssVars(pullX, pullY, originX, originY, scaleX, scaleY);

      if (svgRef.current) {
        svgRef.current.setAttribute("data-slime-state", "tugging");
      }

      ensureAnimating();
    },
    [activeCheck, ensureAnimating, itemSelector, setListTugCssVars, triggerSettle],
  );

  const handleMouseLeave = useCallback(() => {
    const sim = simRef.current;
    sim.hoverTarget = null;
    setListTugCssVars(0, 0, "50%", "50%", 1, 1);
    ensureAnimating();
  }, [ensureAnimating, setListTugCssVars]);

  const handleClick = useCallback(
    (e: PillMouseEvent) => {
      const listEl = listRef.current;
      if (!listEl) return;
      if (resolveItemFromEvent(e, listEl, itemSelector)) {
        simRef.current.hoverTarget = null;
        setListTugCssVars(0, 0, "50%", "50%", 1, 1);
        // Next microtask/frame allows controlled state or router NavLink to update aria-selected/aria-current
        queueMicrotask(() => {
          syncActiveGeometry(true);
        });
      }
    },
    [itemSelector, setListTugCssVars, syncActiveGeometry],
  );

  const style = useMemo(
    () =>
      ({
        "--tab-tug-x": "0px",
        "--tab-tug-y": "0px",
        "--tab-tug-ox": "50%",
        "--tab-tug-oy": "50%",
        "--tab-stretch-x": "1",
        "--tab-stretch-y": "1",
      }) as CSSProperties,
    [],
  );

  const slime: SlimeIndicatorHandle = useMemo(
    () => ({
      filterId,
      svgRef,
      filterRef,
      lobeLeftRef,
      lobeMidGroupRef,
      lobeMidRef,
      lobeRightRef,
      lobeBulgeRef,
      lobeBeadRef,
      snoutGroupRef,
      snoutRef,
      dropletGroupRef,
      dropletRef,
      trailBeadRef,
    }),
    [filterId],
  );

  const handlers = useMemo(
    () => ({
      onMouseOver: handlePointerEvent,
      onMouseMove: handlePointerEvent,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
    }),
    [handlePointerEvent, handleMouseLeave, handleClick],
  );

  return {
    listRef,
    style,
    slime,
    triggerSettle,
    handlers,
  };
}
