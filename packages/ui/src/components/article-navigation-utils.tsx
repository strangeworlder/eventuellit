export interface ArticleSectionAnchor {
  id: string;
  label: string;
}

const markdownEscapePattern = /\\([\\`*_{}[\]()#+.!-])/g;

export function normalizeHeadingLabel(rawLabel: string): string {
  return rawLabel
    .replace(markdownEscapePattern, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#*$/, "")
    .trim();
}

export function slugifyHeadingLabel(label: string): string {
  const normalized = normalizeHeadingLabel(label)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "osio";
}

export function createUniqueHeadingId(
  label: string,
  usageMap: Map<string, number>,
  prefix?: string,
): string {
  const baseSlug = slugifyHeadingLabel(label);
  const nextCount = (usageMap.get(baseSlug) ?? 0) + 1;
  usageMap.set(baseSlug, nextCount);

  const uniqueSlug = nextCount > 1 ? `${baseSlug}-${nextCount}` : baseSlug;
  return prefix ? `${prefix}-${uniqueSlug}` : uniqueSlug;
}

export function extractH3SectionsFromMarkdown(
  markdown: string,
  prefix?: string,
): ArticleSectionAnchor[] {
  const usageMap = new Map<string, number>();
  const sections: ArticleSectionAnchor[] = [];
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+?)\s*$/);
    if (!headingMatch) {
      continue;
    }

    const label = normalizeHeadingLabel(headingMatch[1]);
    sections.push({
      id: createUniqueHeadingId(label, usageMap, prefix),
      label,
    });
  }

  return sections;
}

export function calculateArticleProgress(
  scrollY: number,
  contentStartY: number,
  contentEndY: number,
): number {
  const totalRange = contentEndY - contentStartY;
  if (!Number.isFinite(totalRange) || totalRange <= 0) {
    return 0;
  }

  const rawProgress = ((scrollY - contentStartY) / totalRange) * 100;
  return Math.min(100, Math.max(0, rawProgress));
}

export function resolveActiveSectionId(
  viewportProbeY: number,
  sectionOffsets: Array<{ id: string; top: number }>,
): string | undefined {
  let activeId: string | undefined;

  for (const section of sectionOffsets) {
    if (section.top <= viewportProbeY) {
      activeId = section.id;
    } else {
      break;
    }
  }

  return activeId ?? sectionOffsets[0]?.id;
}

export function resolveActiveSectionFromProgress(
  progress: number,
  sectionIds: string[],
  markerPositions: Record<string, number>,
): string | undefined {
  if (sectionIds.length === 0) {
    return undefined;
  }

  // Filter to only sections that have marker positions to avoid data sync issues
  const sectionsWithMarkers = sectionIds.filter((id) => markerPositions[id] !== undefined);
  
  // If no sections have markers, fall back to first section
  if (sectionsWithMarkers.length === 0) {
    return sectionIds[0];
  }

  // At 100% progress, always return the last section with a marker
  if (progress >= 100) {
    return sectionsWithMarkers[sectionsWithMarkers.length - 1];
  }

  // Find the last section where marker position <= progress
  let activeId: string | undefined;
  for (const id of sectionsWithMarkers) {
    const markerPos = markerPositions[id];
    if (markerPos !== undefined && markerPos <= progress) {
      activeId = id;
    }
  }

  // If no section found (progress < first marker), return first section
  return activeId ?? sectionsWithMarkers[0];
}

export function mapSectionOffsetsToProgressPositions(
  sectionOffsets: Array<{ id: string; top: number }>,
  contentStartY: number,
  contentEndY: number,
): Record<string, number> {
  const positions: Record<string, number> = {};

  for (const section of sectionOffsets) {
    positions[section.id] = calculateArticleProgress(section.top, contentStartY, contentEndY);
  }

  return positions;
}
