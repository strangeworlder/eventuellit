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
import { Badge } from "@repo/ui/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page } from "@repo/ui/components/Page";
import { Tabs, TabsLink, TabsList } from "@repo/ui/components/Tabs";
import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Lightweight frontmatter parser
function parseFrontmatter(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  // biome-ignore lint/suspicious/noExplicitAny: Frontmatter supports mixed scalar + block values across episode fields.
  const data: Record<string, any> = {};
  let content = md;

  if (match) {
    const frontmatter = match[1];
    content = md.slice(match[0].length);

    const lines = frontmatter.split(/\r?\n/);
    let currentKey: string | null = null;
    let isBlock = false;
    let blockLines: string[] = [];

    for (const line of lines) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

      // If we find what looks like a new key, and we're not currently in a block
      // OR we are in a block but this line isn't indented (meaning the block ended)
      if (
        topLevelMatch &&
        (!isBlock || (line.trim() !== "" && !line.startsWith("  ") && !line.startsWith("\t")))
      ) {
        // If we were in a block, save it before starting the new key
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
        // We are in a block, just accumulate lines and strip leading spaces (up to 2)
        blockLines.push(line.replace(/^ {0,2}/, ""));
      }
    }

    // Finalize last block if exists
    if (isBlock && currentKey) {
      data[currentKey] = blockLines.join("\n").trim();
    }
  }
  return { data, content };
}

const modules = import.meta.glob("./content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

interface EpisodePage {
  id: string;
  title: string;
  order: number;
  content: string;
  description?: string;
  status: "active" | "completed" | "planned";
  players?: string;
  sessionDates?: string;
  location?: string;
  locationLink?: string;
  mechanicalAdditions?: string;
  image?: string;
  imageAlt?: string;
}

const episodes: EpisodePage[] = Object.entries(modules)
  .map(([path, rawMdx]) => {
    const rawString = typeof rawMdx === "string" ? rawMdx : "";
    const { data, content } = parseFrontmatter(rawString);

    const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

    return {
      id: filename.toLowerCase(),
      title: data.title || filename,
      order: data.order || 99,
      description: data.description || "",
      content: content,
      status: data.status || "planned",
      players: data.players,
      sessionDates: data.sessionDates,
      location: data.location,
      locationLink: data.locationLink,
      mechanicalAdditions: data.mechanicalAdditions,
      image: data.image,
      imageAlt: data.imageAlt,
    };
  })
  .sort((a, b) => a.order - b.order);

function EpisodeDetails({ episode }: { episode: EpisodePage }) {
  const { pathname } = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
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
        source: "episodes",
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
      if (!payload || payload.source !== "episodes") {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeadingLevelProvider>
        <Hero ref={heroRef} title={episode.title} description={episode.description}>
          <div className="flex gap-2 mt-4">
            {episode.status === "active" && (
              <Badge variant="primary" icon="sparkles">
                Aktiivinen Jakso
              </Badge>
            )}
            {episode.status === "completed" && <Badge variant="secondary">Arkistoitu</Badge>}
            {episode.status === "planned" && <Badge variant="outline">Tulossa</Badge>}
          </div>
        </Hero>
        <div className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8 px-4 tablet:pr-8 tablet:pl-0">
          <div ref={articleRef} className="space-y-6">
            <HeadingLevelProvider>
              <MarkdownRenderer headingIdPrefix={`episode-${episode.id}`}>
                {episode.content}
              </MarkdownRenderer>
            </HeadingLevelProvider>
          </div>
          <div className="space-y-8 pt-6">
            {episode.image && (
              <ImageElement
                src={episode.image}
                sizes="(max-width: 1024px) 100vw, 24rem"
                alt={episode.imageAlt || episode.title}
                variant="secondary"
              />
            )}

            <div className="space-y-4">
              <Card variant="secondary" className="gap-2">
                <CardHeader>
                  <CardTitle>Tiedot</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeadingLevelProvider>
                    {episode.players && (
                      <>
                        <Heading>Pelaajat</Heading>
                        <p>{episode.players}</p>
                      </>
                    )}
                    {episode.sessionDates && (
                      <>
                        <Heading>Sessiot</Heading>
                        <List variant="unbulleted">
                          {episode.sessionDates.split(",").map((dateStr) => {
                            const date = new Date(dateStr.trim());
                            const formattedDate = Number.isNaN(date.getTime())
                              ? dateStr.trim()
                              : date.toLocaleDateString("fi-FI");
                            return <ListItem key={dateStr.trim()}>{formattedDate}</ListItem>;
                          })}
                        </List>
                      </>
                    )}
                    {episode.location && (
                      <>
                        <Heading>Sijainti</Heading>
                        <Link
                          href={episode.locationLink || "#"}
                          external={Boolean(episode.locationLink)}
                        >
                          {episode.location}
                        </Link>
                      </>
                    )}
                  </HeadingLevelProvider>
                </CardContent>
              </Card>
            </div>

            {episode.mechanicalAdditions && (
              <div className="desktop:col-span-1 space-y-4">
                <Card iconName="zap">
                  <CardHeader>
                    <CardTitle>Mekaaniset Lisäykset</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 tablet:pt-0">
                    <MarkdownRenderer>{episode.mechanicalAdditions}</MarkdownRenderer>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </HeadingLevelProvider>
    </div>
  );
}

function App() {
  const { pathname } = useLocation();

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (episodes.some((p) => p.id === segments[0])) return "/";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();
  const defaultPath = episodes.length > 0 ? episodes[0].id : "";

  return (
    <Page>
      {episodes.length > 0 && (
        <Tabs>
          <TabsList>
            {episodes.map((episode) => (
              <TabsLink
                key={episode.id}
                to={basePath === "/" ? `/${episode.id}` : `${basePath}/${episode.id}`}
              >
                #{episode.order}: {episode.title}
              </TabsLink>
            ))}
          </TabsList>

          <div>
            <Routes>
              <Route path="/" element={<Navigate to={defaultPath} replace />} />
              {episodes.map((episode) => (
                <Route
                  key={episode.id}
                  path={episode.id}
                  element={<EpisodeDetails episode={episode} />}
                />
              ))}
            </Routes>
          </div>
        </Tabs>
      )}
      {episodes.length === 0 && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-text/40 italic">Ei jaksoja löydetty.</p>
        </div>
      )}
    </Page>
  );
}

export default App;
