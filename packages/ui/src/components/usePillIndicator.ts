import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

export interface PillIndicatorConfig {
  /** CSS selector for nav items or tabs (e.g. `[data-nav-item]` or `[role="tab"]`). */
  itemSelector: string;
  /** Whether the element is the active item (current page or selected tab). */
  activeCheck: (el: HTMLElement) => boolean;
}

const SETTLING_TRANSITION =
  "after:[transition:left_500ms_cubic-bezier(0.23,1,0.32,1),right_500ms_cubic-bezier(0.23,1,0.32,1),top_500ms_cubic-bezier(0.23,1,0.32,1),bottom_500ms_cubic-bezier(0.23,1,0.32,1),transform_600ms_cubic-bezier(0.34,1.56,0.64,1)]";
const HOVER_TRANSITION =
  "after:[transition:left_500ms_cubic-bezier(0.23,1,0.32,1),right_500ms_cubic-bezier(0.23,1,0.32,1),top_500ms_cubic-bezier(0.23,1,0.32,1),bottom_500ms_cubic-bezier(0.23,1,0.32,1),transform_200ms_ease-out]";

/**
 * Shared tug/stretch animation for the binder-style pill indicator under TopNavList / TabsList.
 */
export function usePillIndicator({ itemSelector, activeCheck }: PillIndicatorConfig) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [tugX, setTugX] = useState(0);
  const [tugY, setTugY] = useState(0);
  const [stretchX, setStretchX] = useState(1);
  const [stretchY, setStretchY] = useState(1);
  const [tugOriginX, setTugOriginX] = useState("50%");
  const [tugOriginY, setTugOriginY] = useState("50%");
  const [isSettling, setIsSettling] = useState(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSettle = useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      setIsSettling(true);
      setTugX(0);
      setTugY(0);
      setStretchX(1);
      setStretchY(1);
      setTugOriginX("50%");
      setTugOriginY("50%");
      settleTimerRef.current = setTimeout(() => setIsSettling(false), 700);
    }, 80);
  }, []);

  const handleMouseOver = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest(itemSelector) as HTMLElement | null;
      if (!target || !listRef.current) return;

      if (activeCheck(target)) {
        triggerSettle();
        return;
      }

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      setIsSettling(false);

      const items = Array.from(
        listRef.current.querySelectorAll<HTMLElement>(itemSelector),
      );
      const activeItem = items.find((t) => activeCheck(t));

      if (!activeItem) return;

      const activeRect = activeItem.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const activeCx = activeRect.left + activeRect.width / 2;
      const activeCy = activeRect.top + activeRect.height / 2;
      const targetCx = targetRect.left + targetRect.width / 2;
      const targetCy = targetRect.top + targetRect.height / 2;
      const dx = targetCx - activeCx;
      const dy = targetCy - activeCy;

      const maxPull = 12;
      const pullX = Math.max(-maxPull, Math.min(maxPull, dx * 0.06));
      const pullY = Math.max(-maxPull, Math.min(maxPull, dy * 0.06));

      const scaleX = 1 + Math.abs(pullX) / Math.max(activeRect.width, 1);
      const scaleY = 1 + Math.abs(pullY) / Math.max(activeRect.height, 1);

      const edgeEps = 0.5;
      const originX = dx > edgeEps ? "0%" : dx < -edgeEps ? "100%" : "50%";
      const originY = dy > edgeEps ? "0%" : dy < -edgeEps ? "100%" : "50%";

      setTugX(pullX);
      setTugY(pullY);
      setStretchX(scaleX);
      setStretchY(scaleY);
      setTugOriginX(originX);
      setTugOriginY(originY);
    },
    [activeCheck, itemSelector, triggerSettle],
  );

  const handleMouseLeave = useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    setIsSettling(true);
    setTugX(0);
    setTugY(0);
    setStretchX(1);
    setStretchY(1);
    setTugOriginX("50%");
    setTugOriginY("50%");
    settleTimerRef.current = setTimeout(() => setIsSettling(false), 700);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest(itemSelector)) {
        triggerSettle();
      }
    },
    [itemSelector, triggerSettle],
  );

  const style = {
    "--tab-tug-x": `${tugX}px`,
    "--tab-tug-y": `${tugY}px`,
    "--tab-tug-ox": tugOriginX,
    "--tab-tug-oy": tugOriginY,
    "--tab-stretch-x": stretchX,
    "--tab-stretch-y": stretchY,
  } as CSSProperties;

  const settleClassName = isSettling ? SETTLING_TRANSITION : HOVER_TRANSITION;

  return {
    listRef,
    style,
    settleClassName,
    triggerSettle,
    handlers: {
      onMouseOver: handleMouseOver,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
    },
  };
}
