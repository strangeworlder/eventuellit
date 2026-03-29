import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Checkbox } from "@repo/ui/components/Checkbox";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { PageBody } from "@repo/ui/components/Page";
import { Text } from "@repo/ui/components/Text";
import { useState } from "react";
import { useEpisode } from "./api/episodes";
import {
  type ReadingItem,
  useEpisodeReadingItems,
  useToggleReadingProgress,
} from "./api/reading";
import { EnrollmentError, type Session, useSessions } from "./api/sessions";

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return <Badge variant="solid" icon="sparkles">Aktiivinen Jakso</Badge>;
  if (status === "completed") return <Badge variant="outline">Arkistoitu</Badge>;
  return <Badge variant="outline">Tulossa</Badge>;
}

function SessionStatusBadge({ status }: { status: Session["status"] }) {
  if (status === "played") return <Badge variant="outline">Pelattu</Badge>;
  if (status === "next") return <Badge variant="solid" icon="sparkles">Seuraava</Badge>;
  return <Badge variant="ghost">Tulossa</Badge>;
}

function typeLabel(contentType: string) {
  if (contentType === "world") return "Maailma";
  if (contentType === "ruleset") return "Säännöt";
  if (contentType === "custom") return "Muut";
  return "";
}

function PracticalInfoCard({
  players,
  sessionDates,
  location,
  locationLink,
}: {
  players: string | null;
  sessionDates: string | null;
  location: string | null;
  locationLink: string | null;
}) {
  const hasDates = sessionDates && sessionDates.trim();
  const hasLocation = location && location.trim();
  const hasPlayers = players && players.trim();

  if (!hasDates && !hasLocation && !hasPlayers) return null;

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>Käytännön tiedot</CardTitle>
      </CardHeader>
      <CardContent>
        <HeadingLevelProvider>
          {hasPlayers && (
            <div className="mb-4">
              <Heading>Pelaajat</Heading>
              <Text>{players}</Text>
            </div>
          )}
          {hasDates && (
            <div className="mb-4">
              <Heading>Sessiopäivät</Heading>
              <List variant="unbulleted">
                {sessionDates!.split(",").map((d) => {
                  const trimmed = d.trim();
                  const date = new Date(trimmed);
                  const formatted = Number.isNaN(date.getTime())
                    ? trimmed
                    : date.toLocaleDateString("fi-FI");
                  return <ListItem key={trimmed}>{formatted}</ListItem>;
                })}
              </List>
            </div>
          )}
          {hasLocation && (
            <div>
              <Heading>Sijainti</Heading>
              {locationLink ? (
                <Link href={locationLink} external>
                  {location}
                </Link>
              ) : (
                <Text>{location}</Text>
              )}
            </div>
          )}
        </HeadingLevelProvider>
      </CardContent>
    </Card>
  );
}

function ReadingItemRow({
  item,
  onToggle,
  isPending,
}: {
  item: ReadingItem;
  onToggle: (item: ReadingItem) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--theme-border-subtle)] last:border-0">
      <div className="pt-0.5">
        <Checkbox
          label=""
          checked={item.completed}
          onChange={() => onToggle(item)}
          disabled={isPending}
          aria-label={`Merkitse luetuksi: ${item.title}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              item.completed
                ? "line-through text-[var(--theme-text)]/40"
                : "text-[var(--theme-text)]"
            }`}
          >
            {item.title}
          </span>
          {item.contentType !== "task" && (
            <Badge variant="ghost">{typeLabel(item.contentType)}</Badge>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-[var(--theme-text)]/60 mt-0.5">{item.description}</p>
        )}
      </div>
      {item.url && (
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = item.url!;
            }}
          >
            Avaa
          </Button>
        </div>
      )}
    </div>
  );
}

function SessionProgress({ items }: { items: ReadingItem[] }) {
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  if (totalCount === 0) return null;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  return (
    <div className="space-y-1 pt-2">
      <div className="flex justify-between items-center text-xs text-[var(--theme-text)]/60">
        <span className="font-bold uppercase tracking-widest">Edistyminen</span>
        <span>{completedCount} / {totalCount} valmis</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--theme-bg-subtle)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--theme-secondary)] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

function SessionPrepSection({
  session,
  episodeId,
  defaultOpen,
}: {
  session: Session;
  episodeId: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { data: items, isLoading } = useEpisodeReadingItems(episodeId, session.id);
  const { toggle, isPending } = useToggleReadingProgress();

  const readingItems = (items ?? []).filter((i) => i.contentType !== "task");
  const taskItems = (items ?? []).filter((i) => i.contentType === "task");
  const allItems = items ?? [];

  const sessionDate = session.date
    ? new Date(session.date).toLocaleDateString("fi-FI")
    : null;

  const isPlayed = session.status === "played";

  return (
    <div className={`rounded-sm border border-[var(--theme-border-subtle)] overflow-hidden ${isPlayed ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[var(--theme-bg-subtle)] hover:bg-[var(--theme-surface-tint)] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-[var(--theme-text)]/50 shrink-0">
            #{String(session.sessionNumber).padStart(2, "0")}
          </span>
          <span className="font-bold text-sm uppercase tracking-widest text-[var(--theme-text)] truncate">
            {session.label || `Sessio ${session.sessionNumber}`}
          </span>
          {sessionDate && (
            <span className="text-xs text-[var(--theme-text)]/50 shrink-0 hidden tablet:block">
              {sessionDate}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SessionStatusBadge status={session.status} />
          <svg
            className={`w-4 h-4 text-[var(--theme-text)]/50 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="p-4 space-y-4">
          {isLoading ? (
            <LoadingState message="Ladataan..." />
          ) : allItems.length === 0 ? (
            <Text variant="muted">Tälle sessiolle ei ole vielä lukemistoa tai tehtäviä.</Text>
          ) : (
            <>
              {readingItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lukemisto ({readingItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 tablet:pt-0">
                    {readingItems.map((item) => (
                      <ReadingItemRow
                        key={item.id}
                        item={item}
                        onToggle={toggle}
                        isPending={isPending}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {taskItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tehtävät ({taskItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 tablet:pt-0">
                    {taskItems.map((item) => (
                      <ReadingItemRow
                        key={item.id}
                        item={item}
                        onToggle={toggle}
                        isPending={isPending}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              <SessionProgress items={allItems} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function EpisodeLevelItems({ episodeId }: { episodeId: number }) {
  const { data: items, isLoading } = useEpisodeReadingItems(episodeId);
  const { toggle, isPending } = useToggleReadingProgress();

  const unassigned = (items ?? []).filter((i) => i.sessionId === null);
  if (isLoading || unassigned.length === 0) return null;

  const readingItems = unassigned.filter((i) => i.contentType !== "task");
  const taskItems = unassigned.filter((i) => i.contentType === "task");

  return (
    <div className="space-y-4">
      <div className="border-b-2 border-primary/20 pb-2">
        <Heading>Yleinen lukemisto</Heading>
      </div>
      {readingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lukemisto ({readingItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 tablet:pt-0">
            {readingItems.map((item) => (
              <ReadingItemRow key={item.id} item={item} onToggle={toggle} isPending={isPending} />
            ))}
          </CardContent>
        </Card>
      )}
      {taskItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tehtävät ({taskItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 tablet:pt-0">
            {taskItems.map((item) => (
              <ReadingItemRow key={item.id} item={item} onToggle={toggle} isPending={isPending} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function SessionPrepView({
  episodeId,
  basePath,
}: {
  episodeId: number;
  basePath: string;
}) {
  const { data: episode, isLoading: isEpisodeLoading } = useEpisode(episodeId);
  const { data: sessions, isLoading: isSessionsLoading, error: sessionsError } = useSessions(episodeId);

  const isNotEnrolled = sessionsError instanceof EnrollmentError;

  if (isEpisodeLoading) return <LoadingState message="Ladataan jaksoa..." />;
  if (!episode) return <div className="p-8 text-center">Jaksoa ei löydy.</div>;

  if (isNotEnrolled) {
    return (
      <HeadingLevelProvider>
        <Hero title={`Valmistaudu: ${episode.title}`} description={episode.description ?? undefined}>
          <div className="mt-4">
            <StatusBadge status={episode.status} />
          </div>
        </Hero>
        <PageBody>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Hahmot", to: `${basePath}/list` },
              { label: `Valmistaudu: ${episode.title}` },
            ]}
          />
          <div className="py-12 text-center space-y-2">
            <Text variant="muted">Et ole ilmoittautunut tähän jaksoon.</Text>
            <Text variant="muted">Ota yhteyttä pelinjohtajaan.</Text>
          </div>
        </PageBody>
      </HeadingLevelProvider>
    );
  }

  const nextSessionIndex = sessions
    ? sessions.findIndex((s) => s.status === "next")
    : -1;

  return (
    <HeadingLevelProvider>
      <Hero title={`Valmistaudu: ${episode.title}`} description={episode.description ?? undefined}>
        <div className="mt-4">
          <StatusBadge status={episode.status} />
        </div>
      </Hero>
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Hahmot", to: `${basePath}/list` },
            { label: `Valmistaudu: ${episode.title}` },
          ]}
        />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="space-y-6">
              {isSessionsLoading ? (
                <LoadingState message="Ladataan sessioita..." />
              ) : sessions && sessions.length > 0 ? (
                <>
                  <div className="border-b-2 border-primary/20 pb-2">
                    <Heading>Sessiot</Heading>
                  </div>
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <SessionPrepSection
                        key={session.id}
                        session={session}
                        episodeId={episodeId}
                        defaultOpen={
                          session.status === "next" ||
                          (nextSessionIndex === -1 && index === 0)
                        }
                      />
                    ))}
                  </div>
                  <EpisodeLevelItems episodeId={episodeId} />
                </>
              ) : (
                <EpisodeLevelItems episodeId={episodeId} />
              )}
            </div>

            <div>
              <PracticalInfoCard
                players={episode.players}
                sessionDates={episode.sessionDates}
                location={episode.location}
                locationLink={episode.locationLink}
              />
            </div>
          </div>
        </HeadingLevelProvider>
      </PageBody>
    </HeadingLevelProvider>
  );
}
