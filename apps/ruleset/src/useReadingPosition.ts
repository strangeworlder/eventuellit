import { useEffect, useRef, useCallback } from "react";
import { requestToast } from "@repo/ui/components/Toast";

const STORAGE_KEY = "ruleset-reading-position";
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SAVE_DEBOUNCE_MS = 1500;

interface SavedPosition {
  pageId: string;
  sectionId: string;
  sectionLabel: string;
  savedAt: number;
}

function storageKey(pageId: string) {
  return `${STORAGE_KEY}-${pageId}`;
}

function loadSaved(pageId: string): SavedPosition | null {
  try {
    const raw = localStorage.getItem(storageKey(pageId));
    if (!raw) return null;
    const parsed: SavedPosition = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > EXPIRY_MS) {
      localStorage.removeItem(storageKey(pageId));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function save(position: SavedPosition) {
  try {
    localStorage.setItem(storageKey(position.pageId), JSON.stringify(position));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function scrollToSectionElement(sectionId: string) {
  const scrollRoot = document.getElementById("app-scroll-root");
  const element = document.getElementById(sectionId);
  if (!element) return;

  if (scrollRoot) {
    const elementRect = element.getBoundingClientRect();
    const rootRect = scrollRoot.getBoundingClientRect();
    const top = Math.max(elementRect.top - rootRect.top + scrollRoot.scrollTop - 96, 0);
    scrollRoot.scrollTo({ top, behavior: "smooth" });
  } else {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

interface UseReadingPositionOptions {
  pageId: string;
  activeSectionId: string | undefined;
  activeSectionLabel: string | undefined;
}

export function useReadingPosition({
  pageId,
  activeSectionId,
  activeSectionLabel,
}: UseReadingPositionOptions) {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastShownRef = useRef(false);

  // Save position on section change (debounced)
  useEffect(() => {
    if (!activeSectionId || !activeSectionLabel) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      save({
        pageId,
        sectionId: activeSectionId,
        sectionLabel: activeSectionLabel,
        savedAt: Date.now(),
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [pageId, activeSectionId, activeSectionLabel]);

  // Offer to resume on page mount
  const offerResume = useCallback(() => {
    if (toastShownRef.current) return;
    const saved = loadSaved(pageId);
    if (!saved) return;
    if (!saved.sectionId) return;

    toastShownRef.current = true;

    requestToast({
      message: `Jatka kohdasta: ${saved.sectionLabel}`,
      variant: "info",
      duration: 8000,
      action: {
        label: "Siirry",
        onClick: () => {
          scrollToSectionElement(saved.sectionId);
        },
      },
    });
  }, [pageId]);

  // Trigger offer after first render (give DOM time to paint)
  useEffect(() => {
    toastShownRef.current = false;
    const timer = setTimeout(offerResume, 800);
    return () => clearTimeout(timer);
  }, [pageId]); // reset on page change
}
