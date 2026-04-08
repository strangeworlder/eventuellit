import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { EntityCard } from "@repo/ui/components/EntityCard";
import { FactionBadge } from "@repo/ui/components/FactionBadge";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { MfeNotFoundRedirect } from "@repo/ui/components/MfeNotFoundRedirect";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page, PageAside, PageBody } from "@repo/ui/components/Page";
import {
  type StationConnectionNode,
  StationConnections,
} from "@repo/ui/components/StationConnections";
import { Text } from "@repo/ui/components/Text";
import { TextSection } from "@repo/ui/components/TextSection";
import { TopNavDropdown, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { useArticleScrollProgress } from "@repo/ui/components/useArticleScrollProgress";
import { useEffect, useRef } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { worldCategories } from "./categories";
import { stationConnections } from "./connections";
import { type factions, getFactionById } from "./factions";

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

// ---------------------------------------------------------------------------
// Lightweight frontmatter parser
// ---------------------------------------------------------------------------
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
  // Faction entry fields
  parent?: string;
  color?: string;
  // Station faction fields
  ruling_faction?: string;
  disrupting_factions?: string[];
}

/** Parse a comma-separated string field into a trimmed string array. */
function parseListField(value: unknown): string[] | undefined {
  if (!value || value === "" || value === "null" || value === "-") return undefined;
  const items = String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

const entries: WorldEntry[] = Object.entries(modules)
  .map(([path, rawMd]) => {
    const rawString = typeof rawMd === "string" ? rawMd : "";
    const { data, content } = parseFrontmatter(rawString);

    // "./content/kynnys/01-seula.md" -> category: "kynnys", id: "01-seula"
    // "./content/faktiot/tuhkan-puolue/muotinvalajat.md" -> category: "faktiot", id: "muotinvalajat"
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
      parent: data.parent || undefined,
      color: data.color || undefined,
      ruling_faction:
        data.ruling_faction && data.ruling_faction !== "null" && data.ruling_faction !== ""
          ? String(data.ruling_faction)
          : undefined,
      disrupting_factions: parseListField(data.disrupting_factions),
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

  const categoryFirstStation = (categoryId: string) => entriesForCategory(categoryId)[0]?.id ?? "";

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
              const href =
                category.useHubIndex || !firstStation
                  ? `${basePath}/${category.id}`
                  : `${basePath}/${category.id}/${firstStation}`;
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
                      <Text className="mb-3">{category.description}</Text>
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
// Station faction aside — shows ruling + disrupting factions for a station
// ---------------------------------------------------------------------------
function StationFactions({
  rulingFaction,
  disruptingFactions,
  basePath,
}: {
  rulingFaction?: string;
  disruptingFactions?: string[];
  basePath: string;
}) {
  const ruling = rulingFaction ? getFactionById(rulingFaction) : null;
  const disrupting = (disruptingFactions ?? [])
    .map((id) => getFactionById(id))
    .filter(Boolean) as (typeof factions)[number][];

  if (!ruling && disrupting.length === 0) return null;

  return (
    <div className="px-4 tablet:pr-8 tablet:pl-0">
      <Heading className="mb-3">Faktiot</Heading>
      <div className="space-y-3">
        {ruling && (
          <div>
            <Text variant="label" className="mb-1.5 block">
              Hallitseva faktio
            </Text>
            <FactionBadge
              factionName={ruling.name}
              color={ruling.color}
              iconName={ruling.icon}
              href={`${basePath}/faktiot/${ruling.id}`}
              variant="card"
              className="w-full"
            />
          </div>
        )}
        {disrupting.length > 0 && (
          <div>
            <Text variant="label" className="mb-1.5 block">
              Häiritsevä faktio
            </Text>
            <div className="space-y-1.5">
              {disrupting.map((f) => (
                <FactionBadge
                  key={f.id}
                  factionName={f.name}
                  color={f.color}
                  iconName={f.icon}
                  href={`${basePath}/faktiot/${f.id}`}
                  variant="card"
                  disrupting
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article content — a single entry rendered with progress tracking
// ---------------------------------------------------------------------------
function ArticleContent({ entry, basePath }: { entry: WorldEntry; basePath: string }) {
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

  useArticleScrollProgress({
    articleRef,
    source: "world",
    route: pathname,
  });

  const connectionNodes = buildConnectionNodes(entry.title);
  const hasFactionData = !!(entry.ruling_faction || entry.disrupting_factions?.length);
  const hasSidebar = connectionNodes.length > 0 || hasFactionData;

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
        className={hasSidebar ? "grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8" : undefined}
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
        <div
          ref={articleRef}
          className={`animate-in fade-in duration-500 space-y-6${hasSidebar ? "" : "mx-auto max-w-3xl"}`}
        >
          <HeadingLevelProvider>
            <MarkdownRenderer headingIdPrefix={`world-${entry.id}`}>
              {entry.content}
            </MarkdownRenderer>
          </HeadingLevelProvider>
        </div>

        {hasSidebar && (
          <PageAside sticky>
            <HeadingLevelProvider>
              <HeadingLevelProvider>
                {connectionNodes.length > 0 && (
                  <StationConnections
                    connections={connectionNodes}
                    tension={entry.tension}
                    currentStationOrder={entry.order}
                    currentStationTitle={entry.title}
                    stations={categoryEntries}
                    basePath={`${basePath}/${entry.category}`}
                  />
                )}
                {hasFactionData && (
                  <StationFactions
                    rulingFaction={entry.ruling_faction}
                    disruptingFactions={entry.disrupting_factions}
                    basePath={basePath}
                  />
                )}
              </HeadingLevelProvider>
            </HeadingLevelProvider>
          </PageAside>
        )}
      </PageBody>
    </>
  );
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
    return <MfeNotFoundRedirect to={`${basePath}/${categoryId}`} />;
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
        <Hero title={category?.title ?? categoryId} description={category?.description} />
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
                      <span className="text-xs font-mono shrink-0 mt-0.5">
                        {String(entry.order).padStart(2, "0")}
                      </span>
                    </div>
                  </CardHeader>
                  {(entry.description || entry.tension) && (
                    <CardContent>
                      {entry.description && <Text className="text-sm">{entry.description}</Text>}
                      {entry.tension && (
                        <Text
                          variant="caption"
                          className="mt-2 text-xs uppercase tracking-widest text-[var(--theme-primary)]"
                        >
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
// Faktiot Layout — wraps all /world/faktiot/* routes
// ---------------------------------------------------------------------------
function FaktiotLayout({
  factiotEntries,
  basePath,
}: {
  factiotEntries: WorldEntry[];
  basePath: string;
}) {
  const { pathname } = useLocation();
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const isIndexPage = lastSegment === "faktiot";
  const currentEntry = isIndexPage
    ? null
    : (factiotEntries.find((e) => e.id === lastSegment) ?? factiotEntries[0]);

  const categoryBasePath = `${basePath}/faktiot`;

  return (
    <Page>
      <div className="px-4 tablet:px-0 pt-4">
        <TopNavList className="hidden tablet:flex">
          <TopNavLink variant="parent" to={basePath || "/world"}>
            Maailma
          </TopNavLink>
          {factiotEntries.map((entry) => (
            <TopNavLink key={entry.id} to={`${categoryBasePath}/${entry.id}`}>
              {entry.title}
            </TopNavLink>
          ))}
        </TopNavList>

        <TopNavDropdown
          className="tablet:hidden"
          currentId={currentEntry?.id ?? ""}
          items={factiotEntries.map((entry) => ({
            id: entry.id,
            label: entry.title,
            to: `${categoryBasePath}/${entry.id}`,
          }))}
          label="Valitse faktio"
        />
      </div>

      <Outlet />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Faktiot Hub — power triad + all factions grid at /world/faktiot
// ---------------------------------------------------------------------------
function FaktiotHub({
  factiotEntries,
  stationEntries,
  basePath,
}: {
  factiotEntries: WorldEntry[];
  stationEntries: WorldEntry[];
  basePath: string;
}) {
  const getStationCount = (factionId: string) =>
    stationEntries.filter((s) => s.ruling_faction === factionId).length;

  const getSubfactionCount = (factionId: string) =>
    factiotEntries.filter((e) => e.parent === factionId).length;

  const ekklesiaEntry = factiotEntries.find((e) => e.id === "ekklesia");
  const tuhkanEntry = factiotEntries.find((e) => e.id === "tuhkan-puolue");
  const kwEntry = factiotEntries.find((e) => e.id === "kw-konsortio");

  const renderMainCard = (entry: WorldEntry | undefined, className?: string) => {
    if (!entry) return null;
    const def = getFactionById(entry.id);
    const stationCount = getStationCount(entry.id);
    const subCount = getSubfactionCount(entry.id);
    return (
      <EntityCard
        name={entry.title}
        subtitle={entry.description}
        color={def?.color ?? "secondary"}
        iconName={def?.icon}
        href={`${basePath}/faktiot/${entry.id}`}
        className={className}
      >
        <div className="flex gap-2 mt-1 flex-wrap">
          <Badge variant="ghost">{subCount} alafaktiota</Badge>
          {stationCount > 0 && <Badge variant="ghost">{stationCount} asemaa</Badge>}
        </div>
      </EntityCard>
    );
  };

  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title="Faktiot"
          description="Kynnyksen kolme suurvaltaa jakavat asemien kontrollin alafaktioidensa kanssa — poliittinen atlas."
        />
      </HeadingLevelProvider>

      <PageBody>
        <Breadcrumb
          className="mb-8"
          items={[{ label: "Maailma", to: basePath || "/world" }, { label: "Faktiot" }]}
        />

        {/* Power Triad */}
        <HeadingLevelProvider>
          <TextSection title="Kolme suurvaltaa" className="mb-10">
            <div className="flex flex-col gap-4 max-w-2xl mx-auto mt-4">
              {/* Top: Ekklesia */}
              <div className="flex justify-center">
                {renderMainCard(ekklesiaEntry, "w-full max-w-xs")}
              </div>
              {/* Bottom: Tuhkan puolue + KW-konsortio */}
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                {renderMainCard(tuhkanEntry)}
                {renderMainCard(kwEntry)}
              </div>
            </div>
          </TextSection>

          {/* All factions grid */}
          <TextSection title="Kaikki faktiot">
            <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 mt-4">
              {factiotEntries.map((entry) => {
                const def = getFactionById(entry.id);
                const parentDef = entry.parent ? getFactionById(entry.parent) : undefined;
                return (
                  <EntityCard
                    key={entry.id}
                    name={entry.title}
                    subtitle={entry.description}
                    color={def?.color ?? "secondary"}
                    iconName={def?.icon}
                    parentLabel={parentDef?.name}
                    href={`${basePath}/faktiot/${entry.id}`}
                    variant={entry.parent ? "npc" : "faction"}
                  />
                );
              })}
            </div>
          </TextSection>
        </HeadingLevelProvider>
      </PageBody>
    </>
  );
}

// ---------------------------------------------------------------------------
// Faction Detail — single faction or subfaction page at /world/faktiot/:factionId
// ---------------------------------------------------------------------------
function FactionDetail({
  factiotEntries,
  stationEntries,
  basePath,
}: {
  factiotEntries: WorldEntry[];
  stationEntries: WorldEntry[];
  basePath: string;
}) {
  const { factionId } = useParams<{ factionId: string }>();
  const entry = factiotEntries.find((e) => e.id === factionId);

  if (!entry) {
    return <MfeNotFoundRedirect to={`${basePath}/faktiot`} />;
  }

  const def = getFactionById(entry.id);
  const parentDef = entry.parent ? getFactionById(entry.parent) : undefined;
  const subEntries = entry.parent ? [] : factiotEntries.filter((e) => e.parent === entry.id);

  const controlledStations = stationEntries.filter((s) => s.ruling_faction === entry.id);
  const disruptedStations = stationEntries.filter((s) => s.disrupting_factions?.includes(entry.id));

  // Factions that control stations this faction disrupts (rivals)
  const rivalIds = Array.from(
    new Set(
      stationEntries
        .filter((s) => s.disrupting_factions?.includes(entry.id) && s.ruling_faction)
        .map((s) => s.ruling_faction!),
    ),
  );
  const rivals = rivalIds
    .map((id) => getFactionById(id))
    .filter(Boolean) as (typeof factions)[number][];

  const accentColor = def?.color ?? "secondary";

  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title={entry.title}
          description={entry.description}
          backgroundImageSrc={entry.image ? resolveRemoteAssetUrl(entry.image) : undefined}
        />

        <PageBody className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8">
          <Breadcrumb
            className="col-span-full mb-2"
            items={[
              { label: "Maailma", to: basePath || "/world" },
              { label: "Faktiot", to: `${basePath}/faktiot` },
              ...(parentDef
                ? [{ label: parentDef.name, to: `${basePath}/faktiot/${parentDef.id}` }]
                : []),
              { label: entry.title },
            ]}
          />

          {/* Main content column */}
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Lore */}
            <MarkdownRenderer headingIdPrefix={`faction-${entry.id}`}>
              {entry.content}
            </MarkdownRenderer>

            {/* Subfactions (main factions only) */}
            {subEntries.length > 0 && (
              <TextSection title="Alafaktiot">
                <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mt-4">
                  {subEntries.map((sub) => {
                    const subDef = getFactionById(sub.id);
                    return (
                      <EntityCard
                        key={sub.id}
                        name={sub.title}
                        subtitle={sub.description}
                        color={subDef?.color ?? accentColor}
                        iconName={subDef?.icon}
                        href={`${basePath}/faktiot/${sub.id}`}
                        variant="npc"
                      />
                    );
                  })}
                </div>
              </TextSection>
            )}

            {/* NPCs placeholder */}
            <TextSection title="Merkittävät hahmot">
              <div className="mt-4">
                <NoticePanel variant="info">
                  Tämän faktion merkittävät hahmot dokumentoidaan tähän myöhemmin.
                </NoticePanel>
              </div>
            </TextSection>

            {/* Controlled stations */}
            {controlledStations.length > 0 && (
              <TextSection title="Hallitut asemat">
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 mt-4">
                  {controlledStations.map((station) => (
                    <a
                      key={station.id}
                      href={`${basePath}/kynnys/${station.id}`}
                      className="no-underline text-inherit"
                    >
                      <Card variant="interactive" className="h-full cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle>{station.title}</CardTitle>
                            {station.tension && (
                              <Text
                                variant="caption"
                                className="text-xs uppercase tracking-widest text-[var(--theme-primary)] shrink-0 mt-0.5"
                              >
                                {station.tension}
                              </Text>
                            )}
                          </div>
                        </CardHeader>
                        {station.description && (
                          <CardContent>
                            <Text className="text-sm">{station.description}</Text>
                          </CardContent>
                        )}
                      </Card>
                    </a>
                  ))}
                </div>
              </TextSection>
            )}
          </div>

          {/* Sidebar */}
          <PageAside sticky>
            <div className="space-y-4">
              {/* Parent faction link (subfactions only) */}
              {parentDef && (
                <Card variant="outline">
                  <CardHeader>
                    <CardTitle>Emofaktio</CardTitle>
                  </CardHeader>
                  <CardContent variant="dense">
                    <FactionBadge
                      factionName={parentDef.name}
                      color={def?.color ?? "secondary"}
                      iconName={parentDef.icon}
                      href={`${basePath}/faktiot/${parentDef.id}`}
                      variant="card"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Quick stats */}
              <Card variant="outline">
                <CardHeader>
                  <CardTitle>Tilastot</CardTitle>
                </CardHeader>
                <CardContent variant="dense">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex items-baseline justify-between gap-2">
                      <dt>
                        <Text variant="caption" className="uppercase tracking-wider">
                          Hallittuja asemia
                        </Text>
                      </dt>
                      <dd className="font-heading font-bold text-lg tabular-nums text-[var(--theme-primary)]">
                        {controlledStations.length}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <dt>
                        <Text variant="caption" className="uppercase tracking-wider">
                          Häirittyä asemaa
                        </Text>
                      </dt>
                      <dd className="font-heading font-bold text-lg tabular-nums text-[var(--theme-primary)]">
                        {disruptedStations.length}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Rivals */}
              {rivals.length > 0 && (
                <Card variant="outline">
                  <CardHeader>
                    <CardTitle>Kilpailijat</CardTitle>
                  </CardHeader>
                  <CardContent variant="dense">
                    <div className="space-y-1.5">
                      {rivals.map((rival) => (
                        <FactionBadge
                          key={rival.id}
                          factionName={rival.name}
                          color={rival.color}
                          iconName={rival.icon}
                          href={`${basePath}/faktiot/${rival.id}`}
                          variant="card"
                          className="w-full"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subfaction list (main factions only) */}
              {!entry.parent && subEntries.length > 0 && (
                <Card variant="outline">
                  <CardHeader>
                    <CardTitle>Alafaktiot</CardTitle>
                  </CardHeader>
                  <CardContent variant="dense">
                    <div className="space-y-1.5">
                      {subEntries.map((sub) => {
                        const subDef = getFactionById(sub.id);
                        return (
                          <FactionBadge
                            key={sub.id}
                            factionName={sub.title}
                            color={subDef?.color ?? accentColor}
                            iconName={subDef?.icon}
                            href={`${basePath}/faktiot/${sub.id}`}
                            variant="card"
                            className="w-full"
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </PageAside>
        </PageBody>
      </HeadingLevelProvider>
    </>
  );
}

// ---------------------------------------------------------------------------
// Root App component
// ---------------------------------------------------------------------------
function AppRoutes() {
  const { pathname } = useLocation();

  const getBasePath = (): string => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/world";
    if (segments[0] === "world") return "/world";
    if (worldCategories.some((c) => c.id === segments[0])) return "";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  return (
    <Routes>
      {/* Hub landing */}
      <Route index element={<WorldHub basePath={basePath} />} />

      {/* Faktiot routes — custom hub + faction detail layout */}
      <Route
        path="faktiot"
        element={
          <FaktiotLayout factiotEntries={entriesForCategory("faktiot")} basePath={basePath} />
        }
      >
        <Route
          index
          element={
            <FaktiotHub
              factiotEntries={entriesForCategory("faktiot")}
              stationEntries={entriesForCategory("kynnys")}
              basePath={basePath}
            />
          }
        />
        <Route
          path=":factionId"
          element={
            <FactionDetail
              factiotEntries={entriesForCategory("faktiot")}
              stationEntries={entriesForCategory("kynnys")}
              basePath={basePath}
            />
          }
        />
      </Route>

      {/* All other category routes */}
      {worldCategories
        .filter((c) => c.id !== "faktiot")
        .map((category) => {
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
                element={<StationDetail categoryEntries={categoryEntries} basePath={basePath} />}
              />
            </Route>
          );
        })}

      {/* Fallback */}
      <Route path="*" element={<MfeNotFoundRedirect to={basePath || "/world"} />} />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
