import type { ArticleProgressPayload } from "@repo/ui/components/article-progress-events";
import { scrollElementIntoScrollRoot } from "@repo/ui/components/article-navigation-utils";
import { MfeNotFoundRedirect } from "@repo/ui/components/MfeNotFoundRedirect";
import { useArticleScrollProgress } from "@repo/ui/components/useArticleScrollProgress";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageBody } from "@repo/ui/components/Page";
import { Text } from "@repo/ui/components/Text";
import { TopNav, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ChapterNav } from "./ChapterNav";
import { GlossaryPage } from "./GlossaryPage";
import { QuickReference } from "./QuickReference";
import { RulesetSearch } from "./RulesetSearch";
import { useReadingPosition } from "./useReadingPosition";

// Lightweight frontmatter parser to avoid Node 'Buffer' dependency from gray-matter in the browser
function parseFrontmatter(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const data: Record<string, unknown> = {};
  let content = md;
  let frontmatter = "";

  if (match) {
    frontmatter = match[1];
    content = md.slice(match[0].length);

    const lines = frontmatter.split(/\r?\n/);
    let currentKey: string | null = null;
    let isBlock = false;
    let blockLines: string[] = [];

    for (const line of lines) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

      if (
        topLevelMatch &&
        (!isBlock || (line.trim() !== "" && !line.startsWith("  ") && !line.startsWith("\t")))
      ) {
        if (isBlock && currentKey) {
          data[currentKey] = blockLines.join("\n").trim();
          isBlock = false;
          blockLines = [];
        }

        const key = topLevelMatch[1];
        const rest = topLevelMatch[2].trim();

        if (rest === "|") {
          currentKey = key;
          isBlock = true;
          blockLines = [];
        } else {
          currentKey = key;
          let value = rest;
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
      } else if (isBlock) {
        blockLines.push(line.replace(/^ {0,2}/, ""));
      }
    }

    if (isBlock && currentKey) {
      data[currentKey] = blockLines.join("\n").trim();
    }
  }
  return { data, content, frontmatter };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function removeOptionalQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseImagesFromFrontmatter(frontmatter: string): string[] {
  const imagesMatch = frontmatter.match(/(?:^|\r?\n)images:\s*\r?\n((?:[ \t]*-\s*.+\r?\n?)*)/);
  if (!imagesMatch) {
    return [];
  }

  return imagesMatch[1]
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s*(.+)\s*$/)?.[1] ?? "")
    .map(removeOptionalQuotes)
    .filter((value) => value.length > 0);
}

function splitByMajorSections(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ") && current.length > 0) {
      sections.push(current.join("\n").trim());
      current = [line];
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) {
    sections.push(current.join("\n").trim());
  }

  return sections.filter((section) => section.length > 0);
}

// Dynamically import all markdown files in the content directory and subdirectories
const modules = import.meta.glob("./content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

interface MarkdownPage {
  id: string;
  title: string;
  order: number;
  content: string;
  description?: string;
  images: string[];
}

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

const pages: MarkdownPage[] = Object.entries(modules)
  .map(([path, rawMdx]) => {
    const rawString = typeof rawMdx === "string" ? rawMdx : "";
    const { data, content, frontmatter } = parseFrontmatter(rawString);

    // Fallback ID from filename
    const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

    const legacyImage = asString(data.image);
    const images = parseImagesFromFrontmatter(frontmatter);
    const resolvedImages = images.length > 0 ? images : legacyImage ? [legacyImage] : [];

    return {
      id: filename.toLowerCase(),
      title: asString(data.title) || filename,
      order: asNumber(data.order) || 99,
      description: asString(data.description) || "",
      content: content,
      images: resolvedImages,
    };
  })
  .sort((a, b) => a.order - b.order);

// Known non-markdown routes (treated as valid first segments like page IDs)
const STATIC_ROUTES = new Set(["sanasto"]);

function RulesetArticleView({ page, basePath }: { page: MarkdownPage; basePath: string }) {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => splitByMajorSections(page.content), [page.content]);

  // Track active section for progress rail and reading position
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>();
  const [activeSectionLabel, setActiveSectionLabel] = useState<string | undefined>();

  const onAfterProgressComputed = useCallback((payload: ArticleProgressPayload) => {
    setActiveSectionId(payload.activeSectionId);
    const activeSection = payload.sections.find((s) => s.id === payload.activeSectionId);
    setActiveSectionLabel(activeSection?.label);
  }, []);

  useArticleScrollProgress({
    articleRef,
    source: "ruleset",
    route: pathname,
    onAfterProgressComputed,
  });

  // Reading position memory
  useReadingPosition({
    pageId: page.id,
    activeSectionId,
    activeSectionLabel,
  });

  // Scroll to a specific section when navigated from search.
  // Double-rAF ensures layout/paint for the new page content is complete.
  useEffect(() => {
    const scrollTarget = (location.state as { scrollToSection?: string } | null)?.scrollToSection;
    if (!scrollTarget) return;

    navigate(pathname, { replace: true, state: {} });

    let cancelled = false;

    const doScroll = () => {
      if (cancelled) return;
      scrollElementIntoScrollRoot(scrollTarget);
    };

    requestAnimationFrame(() => requestAnimationFrame(doScroll));

    return () => {
      cancelled = true;
    };
  }, [location.state, pathname, navigate]);

  const heroImage = page.images[0];
  const inContentImages = page.images.slice(1);

  // Prev / next chapter
  const currentIndex = pages.findIndex((p) => p.id === page.id);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1]! : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1]! : null;

  return (
    <HeadingLevelProvider>
      <Hero
        ref={heroRef}
        title={page.title}
        description={page.description}
        backgroundImageSrc={heroImage ? resolveRemoteAssetUrl(heroImage) : undefined}
      />
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Säännöt", to: basePath === "/" ? "/" : basePath },
            { label: page.title },
          ]}
        />
        <div ref={articleRef} className="max-w-3xl mx-auto">
          <HeadingLevelProvider>
            <div className="space-y-8">
              {sections.map((section, index) => {
                const imagePath = inContentImages[index];
                const imageUrl = imagePath ? resolveRemoteAssetUrl(imagePath) : undefined;

                return (
                  <div key={`${page.id}-section-${index}`} className="space-y-6">
                    <MarkdownRenderer headingIdPrefix={page.id}>{section}</MarkdownRenderer>
                    {imageUrl && (
                      <ImageElement
                        src={imageUrl}
                        alt={`${page.title} kuvitus ${index + 2}`}
                        variant="inline"
                        sizes="(max-width: 768px) 100vw, 42rem"
                        className="w-full max-w-2xl mx-auto"
                        imgClassName="max-h-[24rem]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </HeadingLevelProvider>
        </div>

        <ChapterNav
          prev={prevPage ? { id: prevPage.id, title: prevPage.title } : null}
          next={nextPage ? { id: nextPage.id, title: nextPage.title } : null}
          basePath={basePath}
        />
      </PageBody>
    </HeadingLevelProvider>
  );
}

function RulesetIndex({ basePath }: { basePath: string }) {
  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title="Säännöt"
          description="Kampanjan sääntökirja — mekaniikat, maailma ja johdanto."
        />
      </HeadingLevelProvider>
      <PageBody>
        <Breadcrumb className="mb-6" items={[{ label: "Säännöt" }]} />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {pages.map((page) => (
              <a
                key={page.id}
                href={basePath === "/" ? `/${page.id}` : `${basePath}/${page.id}`}
                className="no-underline text-inherit"
              >
                <Card variant="interactive" className="h-full cursor-pointer">
                  <CardHeader>
                    <CardTitle>{page.title}</CardTitle>
                  </CardHeader>
                  {page.description && (
                    <CardContent>
                      <Text className="text-sm">{page.description}</Text>
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

function RulesetRoutes() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickRefOpen, setQuickRefOpen] = useState(false);

  // Dynamically determine the correct base path for absolute routing to avoid nesting issues
  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    const firstSegment = segments[0]!;
    // If first segment matches a page ID or a known static route, we're mounted at root
    if (pages.some((p) => p.id === firstSegment) || STATIC_ROUTES.has(firstSegment)) return "/";
    // Otherwise, use the first segment as the mount point (e.g. "/ruleset")
    return `/${firstSegment}`;
  };

  const basePath = getBasePath();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Ctrl+K / Cmd+K — open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      // ? — toggle quick reference (not inside an input)
      if (e.key === "?" && !isInInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setQuickRefOpen((v) => !v);
        return;
      }

      // Alt+ArrowLeft / Alt+ArrowRight — previous/next chapter
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const segments = pathname.split("/").filter(Boolean);
        const currentPageId = segments[segments.length - 1];
        const currentIndex = pages.findIndex((p) => p.id === currentPageId);
        if (currentIndex === -1) return;

        const delta = e.key === "ArrowRight" ? 1 : -1;
        const nextIndex = currentIndex + delta;
        if (nextIndex >= 0 && nextIndex < pages.length) {
          const nextPage = pages[nextIndex]!;
          navigate(basePath === "/" ? `/${nextPage.id}` : `${basePath}/${nextPage.id}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, navigate, basePath]);

  return (
    <Page>
      {pages.length > 0 && (
        <TopNav>
          {/* Nav bar row: tabs + search trigger */}
          <div className="flex items-end border-b-2 border-[var(--theme-primary)]">
            <TopNavList className="border-b-0 flex-1 mb-0">
              {pages.map((page) => (
                <TopNavLink
                  key={page.id}
                  to={basePath === "/" ? `/${page.id}` : `${basePath}/${page.id}`}
                >
                  {page.title}
                </TopNavLink>
              ))}
              <TopNavLink to={basePath === "/" ? "/sanasto" : `${basePath}/sanasto`}>
                Sanasto
              </TopNavLink>
            </TopNavList>

            {/* Search trigger */}
            <div className="flex items-center gap-1 pb-1.5 pr-2 shrink-0">
              <Button
                variant="ghost-subtle"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Hae säännöistä (Ctrl+K)"
                title="Hae säännöistä (Ctrl+K)"
              >
                <Icon name="search" size={18} />
              </Button>
            </div>
          </div>

          <div className="animate-in fade-in duration-300">
            <Routes>
              <Route path="/" element={<RulesetIndex basePath={basePath} />} />
              {pages.map((page) => {
                return (
                  <Route
                    key={page.id}
                    path={page.id}
                    element={<RulesetArticleView page={page} basePath={basePath} />}
                  />
                );
              })}
              <Route path="sanasto" element={<GlossaryPage basePath={basePath} />} />
              <Route
                path="*"
                element={<MfeNotFoundRedirect to={basePath === "/" ? "/" : basePath} />}
              />
            </Routes>
          </div>
        </TopNav>
      )}

      {/* Quick reference FAB */}
      <Button
        type="button"
        variant="ghost-subtle"
        size="icon"
        onClick={() => setQuickRefOpen(true)}
        className="fixed top-20 right-4 z-40 w-9 h-9 rounded-lg text-text-muted bg-black/40 backdrop-blur-sm border border-[var(--theme-border-soft)] hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)] hover:border-[var(--theme-border-medium)]"
        aria-label="Avaa pikaohjeet (?)"
        title="Pikaohjeet (?)"
      >
        <Icon name="book-marked" size={15} aria-hidden="true" />
      </Button>

      {/* Modals */}
      <RulesetSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        pages={pages}
        basePath={basePath}
      />
      <QuickReference open={quickRefOpen} onClose={() => setQuickRefOpen(false)} />
    </Page>
  );
}

function App() {
  return <RulesetRoutes />;
}

export default App;
