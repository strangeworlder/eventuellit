import { memo, useCallback, useMemo } from "react";
import type React from "react";

import type { ArticleSectionAnchor } from "./article-navigation-utils";
import { cn } from "./Heading";

export interface ArticleProgressNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: ArticleSectionAnchor[];
  progress: number;
  variant?: "default" | "minimal";
  activeSectionId?: string;
  markerPositions?: Record<string, number>;
  railHeight?: number | string;
  onSelectSection?: (sectionId: string) => void;
}

interface MarkerModel {
  id: string;
  label: string;
  isActive: boolean;
  topPercent: number;
}

interface ArticleProgressMarkersProps {
  markers: MarkerModel[];
  isMinimalVariant: boolean;
  onSelectSection: (sectionId: string) => void;
}

const ArticleProgressMarkers = memo(function ArticleProgressMarkers({
  markers,
  isMinimalVariant,
  onSelectSection,
}: ArticleProgressMarkersProps) {
  const handleMarkerClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const sectionId = event.currentTarget.dataset.sectionId;
      if (!sectionId) {
        return;
      }
      onSelectSection(sectionId);
    },
    [onSelectSection],
  );

  if (markers.length === 0) {
    return (
      <p className={cn("text-sm text-[var(--theme-text)]/70", isMinimalVariant ? "pl-4" : "pl-5")}>
        Ei osioita
      </p>
    );
  }

  return markers.map((marker) => (
    <button
      key={marker.id}
      type="button"
      data-section-id={marker.id}
      title={`Siirry osioon: ${marker.label}`}
      aria-label={`Siirry osioon: ${marker.label}`}
      aria-current={marker.isActive ? "true" : undefined}
      onClick={handleMarkerClick}
      className={cn(
        "group absolute -translate-y-1/2 cursor-pointer transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--theme-bg)] aria-[current=true]:text-[var(--theme-primary)]",
        isMinimalVariant
          ? "p-4 left-0 flex items-center justify-center text-[var(--theme-text)]"
          : "left-0 flex w-full items-center gap-3 text-left",
      )}
      style={{ top: `${marker.topPercent}%` }}
    >
      <span
        className={cn(
          "h-3 w-3 shrink-0 rounded-full border border-[var(--theme-secondary)] bg-[var(--theme-bg)]",
          "group-aria-[current=true]:border-[var(--theme-primary)] group-aria-[current=true]:bg-[var(--theme-primary)]",
        )}
      />
      {isMinimalVariant ? (
        <span
          className={cn(
            "pointer-events-none absolute left-6 top-1/2 max-w-[calc(100dvh-3rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-[var(--theme-bg)]/95 px-2 py-1 text-xs font-semibold text-[var(--theme-text)] shadow-lg ring-1 ring-[var(--theme-secondary)]/40",
            "origin-top rotate-270 opacity-0 transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          {marker.label}
        </span>
      ) : (
        <span className="text-sm font-semibold">{marker.label}</span>
      )}
    </button>
  ));
});

export function ArticleProgressNavigator({
  sections,
  progress,
  variant = "default",
  activeSectionId,
  markerPositions,
  railHeight,
  onSelectSection,
  className,
  ...props
}: ArticleProgressNavigatorProps) {
  const boundedProgress = Math.min(100, Math.max(0, progress));
  const markerCount = sections.length;
  const resolvedRailHeight = railHeight ?? Math.max(220, markerCount * 48);
  const isMinimalVariant = variant === "minimal";
  const handleSelectSection = useCallback(
    (sectionId: string) => {
      if (onSelectSection) {
        onSelectSection(sectionId);
        return;
      }

      const targetElement = document.getElementById(sectionId);
      targetElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onSelectSection],
  );
  const markers = useMemo<MarkerModel[]>(
    () =>
      sections.map((section, index) => {
        const fallbackTopPercent = markerCount <= 1 ? 0 : (index / Math.max(markerCount - 1, 1)) * 100;
        return {
          id: section.id,
          label: section.label,
          isActive: section.id === activeSectionId,
          topPercent: markerPositions?.[section.id] ?? fallbackTopPercent,
        };
      }),
    [activeSectionId, markerCount, markerPositions, sections],
  );

  return (
    <div
      className={cn(
        isMinimalVariant
          ? "bg-transparent px-0 py-0"
          : "rounded-xl border border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] px-3 py-4",
        className,
      )}
      {...props}
    >
      <div
        className="relative"
        style={{ height: typeof resolvedRailHeight === "number" ? `${resolvedRailHeight}px` : resolvedRailHeight }}
      >
        <div className="absolute ml-6 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-[var(--theme-secondary)]/30" />
        <div
          className="absolute ml-6 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-[var(--theme-primary)] origin-top transform-gpu transition-transform duration-150"
          style={{ transform: `translateX(-50%) scaleY(${boundedProgress / 100})` }}
        />
        <ArticleProgressMarkers
          markers={markers}
          isMinimalVariant={isMinimalVariant}
          onSelectSection={handleSelectSection}
        />
      </div>
    </div>
  );
}
