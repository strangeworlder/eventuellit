import { useCallback, useEffect, useRef } from "react";

export interface SurfaceSpotlightHandlers<T extends HTMLElement = HTMLElement> {
  onPointerEnter?: React.PointerEventHandler<T>;
  onPointerMove?: React.PointerEventHandler<T>;
  onPointerLeave?: React.PointerEventHandler<T>;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

/**
 * Tracks mouse pointer coordinates inside an interactive surface element via CSS
 * variables (`--spotlight-x`, `--spotlight-y`) and `data-spotlight-active` without
 * triggering React re-renders. Disabled for non-mouse pointers and when
 * `prefers-reduced-motion: reduce` is active.
 */
export function useSurfaceSpotlight<T extends HTMLElement = HTMLDivElement>(
  enabled: boolean,
  externalHandlers?: SurfaceSpotlightHandlers<T>,
) {
  const surfaceRef = useRef<T | null>(null);
  const rafRef = useRef<number | null>(null);
  const externalHandlersRef = useRef(externalHandlers);
  externalHandlersRef.current = externalHandlers;

  const attachRef = useCallback(
    (forwardedRef: React.ForwardedRef<T>) => (node: T | null) => {
      surfaceRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [],
  );

  const updateSpotlight = useCallback((clientX: number, clientY: number) => {
    const el = surfaceRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.dataset.spotlightActive = "true";
  }, []);

  const clearSpotlight = useCallback(() => {
    if (rafRef.current !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = surfaceRef.current;
    if (!el) return;
    delete el.dataset.spotlightActive;
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearSpotlight();
    }
    return () => {
      if (rafRef.current !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, clearSpotlight]);

  const onPointerEnter: React.PointerEventHandler<T> = useCallback(
    (e) => {
      externalHandlersRef.current?.onPointerEnter?.(e);
      if (!enabled || e.pointerType !== "mouse" || prefersReducedMotion()) {
        return;
      }
      updateSpotlight(e.clientX, e.clientY);
    },
    [enabled, updateSpotlight],
  );

  const onPointerMove: React.PointerEventHandler<T> = useCallback(
    (e) => {
      externalHandlersRef.current?.onPointerMove?.(e);
      if (!enabled || e.pointerType !== "mouse" || prefersReducedMotion()) {
        return;
      }
      const { clientX, clientY } = e;
      if (typeof requestAnimationFrame !== "function") {
        updateSpotlight(clientX, clientY);
        return;
      }
      if (rafRef.current !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateSpotlight(clientX, clientY);
      });
    },
    [enabled, updateSpotlight],
  );

  const onPointerLeave: React.PointerEventHandler<T> = useCallback(
    (e) => {
      externalHandlersRef.current?.onPointerLeave?.(e);
      clearSpotlight();
    },
    [clearSpotlight],
  );

  return {
    surfaceRef,
    attachRef,
    spotlightProps: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
    },
  };
}
