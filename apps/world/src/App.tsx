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
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageAside, PageBody } from "@repo/ui/components/Page";
import { TopNavDropdown, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { Text } from "@repo/ui/components/Text";
import { useEffect, useRef } from "react";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { requestToast } from "@repo/ui/components/Toast";
import {
  StationConnections,
  type StationConnectionNode,
} from "@repo/ui/components/StationConnections";
import { stationConnections } from "./connections";
import { worldCategories } from "./categories";

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
  category: string;
  tension?: string;
  image?: string;
}

const entries: WorldEntry[] = Object.entries(modules)
  .map(([path, rawMd]) => {
    const rawString = typeof rawMd === "string" ? rawMd : "";
    const { data, content } = parseFrontmatter(rawString);

    // "./content/kynnys/01-seula.md" -> category: "kynnys", id: "01-seula"
    const parts = path.replace("./content/", "").split("/");
    const category = parts.length > 1 ? parts[0] : "uncategorized";
    const filename = (parts[parts.length - 1] ?? "unknown").replace(".md", "");

    return {
      id: filename.toLowerCase(),
      title: data.title || filename,
      order: data.order || 99,
      description: data.description || "",
      content,
      category: data.category || category,
      tension: data.tension || "",
      image: data.image || "",
    };
  })
  .sort((a, b) => a.order - b.order);

/** All entries for a given category id, in order. */
function entriesForCategory(categoryId: string): WorldEntry[] {
  return entries.filter((e) => e.category === categoryId);
}

/** Builds the StationConnectionNode array for a given station title. */
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

// ---------------------------------------------------------------------------
// World Hub — landing page at /world
// ---------------------------------------------------------------------------
function WorldHub({ basePath }: { basePath: string }) {
  const categoryEntryCount = (categoryId: string) =>
    entries.filter((e) => e.category === categoryId).length;

  // Link directly to the first station in each category, bypassing the index
  const categoryFirstStation = (categoryId: string) =>
    entriesForCategory(categoryId)[0]?.id ?? "";

  return (
    <Page>
      <HeadingLevelProvider>
        <Hero
          title="Maailma"
          description="Tutki kampanjan maailmaa — sijainteja, faktioita ja tarinoita."
        />
        <PageBody>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {worldCategories.map((category) => {
              const count = categoryEntryCount(category.id);
              const firstStation = categoryFirstStation(category.id);
              const href = firstStation
                ? `${basePath}/${category.id}/${firstStation}`
                : `${basePath}/${category.id}`;
              return (
                <Card
                  key={category.id}
                  variant="interactive"
                  onClick={() => {}}
                  className="cursor-pointer"
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.location.href = href;
                    }
                  }}
                >
                  <a
                    href={href}
                    className="block no-underline text-inherit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] flex items-center justify-center flex-shrink-0">
                          <Icon name={category.icon} size={20} />
                        </div>
                        <CardTitle>{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Text variant="muted" className="mb-3">
                        {category.description}
                      </Text>
                      <Text variant="caption" className="text-sm">
                        {count} {count === 1 ? "artikkeli" : "artikkelia"}
                      </Text>
                    </CardContent>
                  </a>
                </Card>
              );
            })}
          </div>
        </PageBody>
      </HeadingLevelProvider>
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Article content — a single entry rendered with progress tracking
// ---------------------------------------------------------------------------
function ArticleContent({
  entry,
  basePath,
}: {
  entry: WorldEntry;
  basePath: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const articleRef = useRef<HTMLDivElement>(null);

  const categoryEntries = entriesForCategory(entry.category);
  const currentIndex = categoryEntries.findIndex((e) => e.id === entry.id);

  // Swipe navigation between stations (mobile)
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const delta = startX - endX;
      const SWIPE_THRESHOLD = 60;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (delta > 0 && currentIndex < categoryEntries.length - 1) {
        const next = categoryEntries[currentIndex + 1];
        if (next) navigate(`${basePath}/${entry.category}/${next.id}`);
      } else if (delta < 0 && currentIndex > 0) {
        const prev = categoryEntries[currentIndex - 1];
        if (prev) navigate(`${basePath}/${entry.category}/${prev.id}`);
      }
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, categoryEntries, basePath, entry.category, navigate]);

  // Article progress tracking
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

  const connectionNodes = buildConnectionNodes(entry.title);
  const hasSidebar = connectionNodes.length > 0;

  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title={entry.title}
          description={entry.description}
          backgroundImageSrc={entry.image ? resolveRemoteAssetUrl(entry.image) : undefined}
        />
      </HeadingLevelProvider>

      <PageBody
        className={
          hasSidebar
            ? "grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8"
            : undefined
        }
      >
        <Breadcrumb
          className={hasSidebar ? "col-span-full mb-2" : "mb-2"}
          items={[
            { label: "Maailma", to: basePath || "/world" },
            {
              label: worldCategories.find((c) => c.id === entry.category)?.title ?? entry.category,
              to: `${basePath}/${entry.category}`,
            },
            { label: entry.title },
          ]}
        />
        <div ref={articleRef} className="animate-in fade-in duration-500 space-y-6">
          <HeadingLevelProvider>
            <MarkdownRenderer headingIdPrefix={`world-${entry.id}`}>
              {entry.content}
            </MarkdownRenderer>
          </HeadingLevelProvider>
        </div>

        {hasSidebar && (
          <PageAside sticky>
            <HeadingLevelProvider>
              <StationConnections
                connections={connectionNodes}
                tension={entry.tension}
                currentStationOrder={entry.order}
                currentStationTitle={entry.title}
                stations={categoryEntries}
                basePath={`${basePath}/${entry.category}`}
              />
            </HeadingLevelProvider>
          </PageAside>
        )}
      </PageBody>
    </>
  );
}

// ---------------------------------------------------------------------------
// 404 redirect with toast
// ---------------------------------------------------------------------------
function NotFoundRedirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      requestToast({ message: "Sivua ei löydy. Uudelleenohjattu lähimpään vanhempaan.", variant: "warning", duration: 0 });
      navigate(to, { replace: true });
    }, 0);
    // clearTimeout in StrictMode's synchronous cleanup prevents the double-dispatch
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// ---------------------------------------------------------------------------
// Station detail route — reads :stationId param
// ---------------------------------------------------------------------------
function StationDetail({
  categoryEntries,
  basePath,
}: {
  categoryEntries: WorldEntry[];
  basePath: string;
}) {
  const { stationId } = useParams<{ stationId: string }>();
  const entry = categoryEntries.find((e) => e.id === stationId);
  const categoryId = categoryEntries[0]?.category ?? "";

  if (!entry) {
    return <NotFoundRedirect to={`${basePath}/${categoryId}`} />;
  }

  return <ArticleContent entry={entry} basePath={basePath} />;
}

// ---------------------------------------------------------------------------
// Kynnys Index — card grid of all stations at /world/kynnys
// ---------------------------------------------------------------------------
function KynnysIndex({
  categoryEntries,
  categoryId,
  basePath,
}: {
  categoryEntries: WorldEntry[];
  categoryId: string;
  basePath: string;
}) {
  const category = worldCategories.find((c) => c.id === categoryId);
  const categoryBasePath = `${basePath}/${categoryId}`;

  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title={category?.title ?? categoryId}
          description={category?.description}
        />
      </HeadingLevelProvider>
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Maailma", to: basePath || "/world" },
            { label: category?.title ?? categoryId },
          ]}
        />
        <HeadingLevelProvider>
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {categoryEntries.map((entry) => (
            <a
              key={entry.id}
              href={`${categoryBasePath}/${entry.id}`}
              className="no-underline text-inherit"
            >
              <Card variant="interactive" className="h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{entry.title}</CardTitle>
                    <span className="text-xs font-mono text-text-muted shrink-0 mt-0.5">
                      {String(entry.order).padStart(2, "0")}
                    </span>
                  </div>
                </CardHeader>
                {(entry.description || entry.tension) && (
                  <CardContent>
                    {entry.description && (
                      <Text variant="muted" className="text-sm">
                        {entry.description}
                      </Text>
                    )}
                    {entry.tension && (
                      <Text variant="caption" className="mt-2 text-xs uppercase tracking-widest text-[var(--theme-primary)]">
                        {entry.tension}
                      </Text>
                    )}
                  </CardContent>
                )}
              </Card>
            </a>
          ))}
        </div>
        </HeadingLevelProvider>
      </PageBody>
    </>
  );
}

// ---------------------------------------------------------------------------
// Kynnys Layout — wraps all /world/kynnys/* routes
// ---------------------------------------------------------------------------
function KynnysLayout({
  categoryEntries,
  categoryId,
  basePath,
}: {
  categoryEntries: WorldEntry[];
  categoryId: string;
  basePath: string;
}) {
  const { pathname } = useLocation();
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const isIndexPage = lastSegment === categoryId;
  const currentEntry = isIndexPage
    ? null
    : (categoryEntries.find((e) => e.id === lastSegment) ?? categoryEntries[0]);

  const categoryBasePath = `${basePath}/${categoryId}`;

  return (
    <Page>
      <div className="px-4 tablet:px-0 pt-4">
        {/* Desktop: tab bar with parent back-link */}
        <TopNavList className="hidden tablet:flex">
          <TopNavLink variant="parent" to={basePath || "/world"}>
            Maailma
          </TopNavLink>
          {categoryEntries.map((entry) => (
            <TopNavLink key={entry.id} to={`${categoryBasePath}/${entry.id}`}>
              {entry.title}
            </TopNavLink>
          ))}
        </TopNavList>

        {/* Mobile: dropdown selector */}
        <TopNavDropdown
          className="tablet:hidden"
          currentId={currentEntry?.id ?? ""}
          items={categoryEntries.map((entry) => ({
            id: entry.id,
            label: entry.title,
            to: `${categoryBasePath}/${entry.id}`,
          }))}
          label="Valitse asema"
        />
      </div>

      <Outlet />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Root App component
// ---------------------------------------------------------------------------
function AppRoutes() {
  const { pathname } = useLocation();

  // Derive the mount base path (e.g., "/world" when hosted, "/" in dev standalone)
  const getBasePath = (): string => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/world";
    // If the first segment is "world" we're mounted normally
    if (segments[0] === "world") return "/world";
    // If the first segment is a known category, we're in standalone/dev mode
    if (worldCategories.some((c) => c.id === segments[0])) return "";
    // Otherwise use the first segment as base
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  return (
    <Routes>
      {/* Hub landing */}
      <Route index element={<WorldHub basePath={basePath} />} />

      {/* Category routes */}
      {worldCategories.map((category) => {
        const categoryEntries = entriesForCategory(category.id);

        return (
          <Route
            key={category.id}
            path={category.id}
            element={
              <KynnysLayout
                categoryEntries={categoryEntries}
                categoryId={category.id}
                basePath={basePath}
              />
            }
          >
            <Route
              index
              element={
                <KynnysIndex
                  categoryEntries={categoryEntries}
                  categoryId={category.id}
                  basePath={basePath}
                />
              }
            />
            <Route
              path=":stationId"
              element={
                <StationDetail
                  categoryEntries={categoryEntries}
                  basePath={basePath}
                />
              }
            />
          </Route>
        );
      })}

      {/* Fallback */}
      <Route path="*" element={<NotFoundRedirect to={basePath || "/world"} />} />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
