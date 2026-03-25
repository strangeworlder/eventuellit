import {
  mapSectionOffsetsToProgressPositions,
  resolveActiveSectionFromProgress,
} from "@repo/ui/components/article-navigation-utils";
import {
  ARTICLE_JUMP_EVENT,
  ARTICLE_PROGRESS_EVENT,
  type ArticleJumpPayload,
  type ArticleProgressPayload,
} from "@repo/ui/components/article-progress-events";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Text } from "@repo/ui/components/Text";
import { Hero } from "@repo/ui/components/Hero";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageAside, PageBody } from "@repo/ui/components/Page";
import { Tabs, TabsLink, TabsList } from "@repo/ui/components/Tabs";
import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  StationConnections,
  type StationConnectionNode,
} from "@repo/ui/components/StationConnections";
import { stationConnections } from "./connections";

const remoteOrigin = new URL(import.meta.url).origin;

function resolveRemoteAssetUrl(assetPath: string) {
  if (
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://") ||
    assetPath.startsWith("data:")
  ) {
    return assetPath;
  }
  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${remoteOrigin}${normalizedPath}`;
}

// Lightweight frontmatter parser
function parseFrontmatter(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  // biome-ignore lint/suspicious/noExplicitAny: Frontmatter supports mixed scalar values across world entry fields.
  const data: Record<string, any> = {};
  let content = md;

  if (match) {
    const frontmatter = match[1];
    content = md.slice(match[0].length);

    for (const line of frontmatter.split(/\r?\n/)) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (topLevelMatch) {
        const key = topLevelMatch[1];
        let value = topLevelMatch[2].trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!Number.isNaN(Number(value)) && value !== "") {
          data[key] = Number(value);
        } else {
          data[key] = value;
        }
      }
    }
  }
  return { data, content };
}

const modules = import.meta.glob("./content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export interface WorldEntry {
  id: string;
  title: string;
  order: number;
  content: string;
  description?: string;
  category?: string;
  tension?: string;
  image?: string;
}

const entries: WorldEntry[] = Object.entries(modules)
  .map(([path, rawMd]) => {
    const rawString = typeof rawMd === "string" ? rawMd : "";
    const { data, content } = parseFrontmatter(rawString);

    const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

    return {
      id: filename.toLowerCase(),
      title: data.title || filename,
      order: data.order || 99,
      description: data.description || "",
      content,
      category: data.category || "",
      tension: data.tension || "",
      image: data.image || "",
    };
  })
  .sort((a, b) => a.order - b.order);

/** Builds the StationConnectionNode array for a given station title from the connections data file */
function buildConnectionNodes(stationTitle: string): StationConnectionNode[] {
  const connectionMap = stationConnections[stationTitle];
  if (!connectionMap) return [];
  return Object.entries(connectionMap).map(([nodeTitle, node]) => ({
    title: nodeTitle,
    direction: node.direction,
    type: node.type,
    shape: node.shape,
  }));
}

function ArticleContent({
  entry,
}: {
  entry: WorldEntry;
}) {
  const { pathname } = useLocation();
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollRoot = document.getElementById("app-scroll-root");
    if (!scrollRoot) {
      return;
    }

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

      dispatchProgress({
        source: "world",
        route: pathname,
        sections: renderedSections,
        progress: nextProgress,
        activeSectionId: nextActiveSectionId,
        markerPositions: nextMarkerPositions,
      });
    };

    const onJumpRequested = (event: Event) => {
      const customEvent = event as CustomEvent<ArticleJumpPayload>;
      const payload = customEvent.detail;
      if (!payload || payload.source !== "world") {
        return;
      }

      const element = document.getElementById(payload.sectionId);
      if (element) {
        const targetTop = Math.max(getOffsetWithinScrollRoot(element) - 96, 0);
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
  }, [pathname]);

  return (
    <div ref={articleRef} className="animate-in fade-in duration-500 space-y-6">
      <HeadingLevelProvider>
        <MarkdownRenderer headingIdPrefix={`world-${entry.id}`}>
          {entry.content}
        </MarkdownRenderer>
      </HeadingLevelProvider>
    </div>
  );
}

function App() {
  const { pathname } = useLocation();

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (entries.some((e) => e.id === segments[0])) return "/";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();
  const defaultPath = entries.length > 0 ? entries[0].id : "";

  // Derive current entry from the last URL segment
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const currentEntry = entries.find((e) => e.id === lastSegment) ?? entries[0];

  // Build connections for the current station (if it has them)
  const isStation = currentEntry?.category === "asema";
  const currentConnections = isStation
    ? buildConnectionNodes(currentEntry.title)
    : [];
  const hasSidebar = isStation && currentConnections.length > 0;

  return (
    <Page>
      {entries.length > 0 && (
        <Tabs>
          <TabsList>
            {entries.map((entry) => (
              <TabsLink
                key={entry.id}
                to={basePath === "/" ? `/${entry.id}` : `${basePath}/${entry.id}`}
              >
                {entry.title}
              </TabsLink>
            ))}
          </TabsList>

          {/* Hero: full-width, outside Routes, reacts to URL-derived currentEntry */}
          <HeadingLevelProvider>
            <Hero
              title={currentEntry?.title ?? ""}
              description={currentEntry?.description}
              backgroundImageSrc={
                currentEntry?.image
                  ? resolveRemoteAssetUrl(currentEntry.image)
                  : undefined
              }
            />
          </HeadingLevelProvider>

          {/* Two-column body: article left, persistent sidebar right */}
          <PageBody
            className={
              hasSidebar
                ? "grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8"
                : undefined
            }
          >
            {/* Article content: inside Routes so navigation/progress tracking works */}
            <div>
              <Routes>
                <Route path="/" element={<Navigate to={defaultPath} replace />} />
                {entries.map((entry) => (
                  <Route
                    key={entry.id}
                    path={entry.id}
                    element={<ArticleContent entry={entry} />}
                  />
                ))}
              </Routes>
            </div>

            {/* Persistent sidebar: outside Routes, stays mounted across station navigations */}
            {hasSidebar && (
              <PageAside sticky>
                <HeadingLevelProvider>
                  <StationConnections
                    connections={currentConnections}
                    tension={currentEntry.tension}
                    currentStationOrder={currentEntry.order}
                    currentStationTitle={currentEntry.title}
                    stations={entries}
                    basePath={basePath}
                  />
                </HeadingLevelProvider>
              </PageAside>
            )}
          </PageBody>
        </Tabs>
      )}
      {entries.length === 0 && (
        <div className="animate-in fade-in duration-500">
          <HeadingLevelProvider>
            <Hero title="Maailma" description="Tutki kampanjan maailmaa, sijainteja ja hahmoja." />
            <PageBody>
              <Heading>Sisältöä tulossa</Heading>
              <Text variant="muted" className="mt-2">
                Maailman sisältöä ei ole vielä lisätty. Lisää markdown-tiedostoja{" "}
                <code>src/content/</code>-kansioon.
              </Text>
            </PageBody>
          </HeadingLevelProvider>
        </div>
      )}
    </Page>
  );
}

export default App;
