import { memo, useCallback, useMemo } from "react";
import type React from "react";

import { AnchoredTooltip } from "./AnchoredTooltip";
import type { ArticleSectionAnchor } from "./article-navigation-utils";
import { cn } from "./utils";

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
  isScrolledPast: boolean;
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
      <p className={cn("text-sm text-text-muted", isMinimalVariant ? "pl-4" : "pl-5")}>
        Ei osioita
      </p>
    );
  }

  return markers.map((marker) =>
    isMinimalVariant ? (
      <div
        key={marker.id}
        className="group absolute -translate-y-1/2"
        style={{ top: `${marker.topPercent}%` }}
      >
        <button
          type="button"
          data-section-id={marker.id}
          title={`Siirry osioon: ${marker.label}`}
          aria-label={`Siirry osioon: ${marker.label}`}
          aria-current={marker.isActive ? "true" : undefined}
          onClick={handleMarkerClick}
          className={cn(
            "group cursor-pointer transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2",
            "focus-visible:ring-offset-[var(--theme-bg)] aria-[current=true]:text-[var(--theme-primary)]",
            "p-4 left-0 flex items-center justify-center text-[var(--theme-text)]",
          )}
        >
          <span
            className={cn(
              "absolute h-3 w-3 shrink-0 rounded-full border bg-[var(--theme-bg)]",
              marker.isScrolledPast
                ? "border-[var(--theme-primary)]"
                : "border-[var(--theme-secondary)]",
              "group-aria-[current=true]:border-[var(--theme-primary)] group-aria-[current=true]:bg-[var(--theme-primary)]",
            )}
            style={{ left: "1.5rem", transform: "translateX(-50%)" }}
          />
        </button>
        <AnchoredTooltip placement="right">
          {marker.label}
        </AnchoredTooltip>
      </div>
    ) : (
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
          "left-0 flex w-full items-center text-left pl-[2.625rem]",
        )}
        style={{ top: `${marker.topPercent}%` }}
      >
        <span
          className={cn(
            "absolute h-3 w-3 shrink-0 rounded-full border bg-[var(--theme-bg)]",
            marker.isScrolledPast
              ? "border-[var(--theme-primary)]"
              : "border-[var(--theme-secondary)]",
            "group-aria-[current=true]:border-[var(--theme-primary)] group-aria-[current=true]:bg-[var(--theme-primary)]",
          )}
          style={{ left: "1.5rem", transform: "translateX(-50%)" }}
        />
        <span className="text-sm font-semibold">{marker.label}</span>
      </button>
    ),
  );
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
  const hasProgressStarted = boundedProgress > 0;
  const isProgressComplete = boundedProgress >= 100;
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
        const topPercent = markerPositions?.[section.id] ?? fallbackTopPercent;
        const isActive = section.id === activeSectionId;
        const isScrolledPast = !isActive && topPercent < boundedProgress;
        return {
          id: section.id,
          label: section.label,
          isActive,
          isScrolledPast,
          topPercent,
        };
      }),
    [activeSectionId, boundedProgress, markerCount, markerPositions, sections],
  );

  return (
    <div
      className={cn(
        isMinimalVariant
          ? "bg-transparent px-0 py-0"
          : "rounded-xl border border-[var(--theme-border-medium)] bg-[var(--theme-bg)] px-3 py-4",
        className,
      )}
      {...props}
    >
      <div
        className="relative"
        style={{ height: typeof resolvedRailHeight === "number" ? `${resolvedRailHeight}px` : resolvedRailHeight }}
      >
        <div
          className={cn(
            "absolute h-px w-4 rounded-full",
            hasProgressStarted ? "bg-[var(--theme-primary)]" : "bg-[var(--theme-secondary)]/60",
          )}
          style={{ left: "1.5rem", top: 0, transform: "translateX(-50%)" }}
        />
        <div
          className="absolute top-0 h-full w-1 rounded-full bg-[var(--theme-secondary)]/30"
          style={{ left: "1.5rem", transform: "translateX(-50%)" }}
        />
        <div
          className="absolute top-0 h-full w-1 rounded-full bg-[var(--theme-primary)] origin-top transform-gpu transition-transform duration-150"
          style={{ left: "1.5rem", transform: `translateX(-50%) scaleY(${boundedProgress / 100})` }}
        />
        <div
          className={cn(
            "absolute h-px w-4 rounded-full",
            isProgressComplete ? "bg-[var(--theme-primary)]" : "bg-[var(--theme-secondary)]/60",
          )}
          style={{ left: "1.5rem", bottom: 0, transform: "translateX(-50%)" }}
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
