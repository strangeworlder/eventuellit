import { type RefObject, useEffect, useRef } from "react";
import {
  mapSectionOffsetsToProgressPositions,
  resolveActiveSectionFromProgress,
} from "./article-navigation-utils";
import {
  ARTICLE_JUMP_EVENT,
  ARTICLE_PROGRESS_EVENT,
  type ArticleJumpPayload,
  type ArticleProgressPayload,
  type ArticleProgressSource,
} from "./article-progress-events";

export interface UseArticleScrollProgressOptions {
  articleRef: RefObject<HTMLElement | null>;
  source: ArticleProgressSource;
  /** Current route path (e.g. location.pathname) — rebinds listeners when it changes */
  route: string;
  scrollRootId?: string;
  jumpOffsetPx?: number;
  enabled?: boolean;
  /** Optional hook for local state (e.g. reading position) — runs whenever scroll state is computed */
  onAfterProgressComputed?: (payload: ArticleProgressPayload) => void;
}

/**
 * Wires `#app-scroll-root` scroll + heading positions to {@link ARTICLE_PROGRESS_EVENT}
 * and handles {@link ARTICLE_JUMP_EVENT} for the given content source.
 */
export function useArticleScrollProgress(options: UseArticleScrollProgressOptions): void {
  const {
    articleRef,
    source,
    route,
    scrollRootId = "app-scroll-root",
    jumpOffsetPx = 96,
    enabled = true,
    onAfterProgressComputed,
  } = options;

  const onAfterRef = useRef(onAfterProgressComputed);
  onAfterRef.current = onAfterProgressComputed;

  useEffect(() => {
    if (!enabled) return;
    const scrollRoot = document.getElementById(scrollRootId);
    if (!scrollRoot) return;

    const getOffsetWithinScrollRoot = (element: HTMLElement) => {
      const elementRect = element.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      return elementRect.top - rootRect.top + scrollRoot.scrollTop;
    };

    const dispatchProgress = (payload: ArticleProgressPayload) => {
      window.dispatchEvent(
        new CustomEvent<ArticleProgressPayload>(ARTICLE_PROGRESS_EVENT, { detail: payload }),
      );
    };

    const updateScrollState = () => {
      const scrollY = scrollRoot.scrollTop;
      const maxScroll = Math.max(scrollRoot.scrollHeight - scrollRoot.clientHeight, 1);
      const headingElements = Array.from(
        articleRef.current?.querySelectorAll<HTMLElement>("h3[id]") ?? [],
      );
      const renderedSections = headingElements.map((heading) => ({
        id: heading.id,
        label: heading.textContent?.trim() ?? heading.id,
      }));

      const sectionOffsets = headingElements.map((heading) => ({
        id: heading.id,
        top: getOffsetWithinScrollRoot(heading),
      }));

      const nextProgress = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      const nextMarkerPositions = mapSectionOffsetsToProgressPositions(
        sectionOffsets,
        0,
        scrollRoot.scrollHeight,
      );
      const nextActiveSectionId = resolveActiveSectionFromProgress(
        nextProgress,
        renderedSections.map((s) => s.id),
        nextMarkerPositions,
      );

      const payload: ArticleProgressPayload = {
        source,
        route,
        sections: renderedSections,
        progress: nextProgress,
        activeSectionId: nextActiveSectionId,
        markerPositions: nextMarkerPositions,
      };
      onAfterRef.current?.(payload);
      dispatchProgress(payload);
    };

    const onJumpRequested = (event: Event) => {
      const customEvent = event as CustomEvent<ArticleJumpPayload>;
      const payload = customEvent.detail;
      if (!payload || payload.source !== source) {
        return;
      }

      const element = document.getElementById(payload.sectionId);
      if (element) {
        const targetTop = Math.max(getOffsetWithinScrollRoot(element) - jumpOffsetPx, 0);
        scrollRoot.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    };

    updateScrollState();
    scrollRoot.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    window.addEventListener(ARTICLE_JUMP_EVENT, onJumpRequested as EventListener);

    return () => {
      scrollRoot.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      window.removeEventListener(ARTICLE_JUMP_EVENT, onJumpRequested as EventListener);
    };
  }, [articleRef, source, route, scrollRootId, jumpOffsetPx, enabled]);
}
