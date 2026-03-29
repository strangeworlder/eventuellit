import { SkillTagList } from "@repo/ui/components/SkillTagList";
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
import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Drawer } from "@repo/ui/components/Drawer";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageBody } from "@repo/ui/components/Page";
import { TopNav, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { Input } from "@repo/ui/components/Input";
import { Select } from "@repo/ui/components/Select";
import { TextArea } from "@repo/ui/components/TextArea";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Text } from "@repo/ui/components/Text";
import { requestToast } from "@repo/ui/components/Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  type Episode,
  useCreateEpisode,
  useCreateEpisodeSkill,
  useDeleteEpisode,
  useDeleteEpisodeSkill,
  useEpisode,
  useEpisodes,
  useEpisodeSkills,
  useUpdateEpisode,
  useUpdateEpisodeSkill,
} from "./api/episodes";
import { ReadingListEditor } from "./ReadingListEditor";
import {
  useDisenrollPlayer,
  useEnrollPlayer,
  useEpisodePlayers,
} from "./api/episode-players";
import { usePlayerUsers } from "./api/users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function EpisodeEditForm({ episode, onCancel, onSave }: { episode?: Episode; onCancel: () => void; onSave: (data: Partial<Episode>) => void }) {
  const [formData, setFormData] = useState<Partial<Episode>>(
    episode || {
      title: "",
      slug: "",
      order: 99,
      status: "planned",
      description: "",
      content: "",
      players: "",
      sessionDates: "",
      location: "",
      locationLink: "",
      image: "",
      imageAlt: "",
      mechanicalAdditions: "",
      summary: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "order" ? parseInt(value) || 0 : value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{episode ? "Muokkaa Jaksoa" : "Uusi Jakso"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Otsikko" name="title" value={formData.title ?? ""} onChange={handleChange} />
          <Input label="Slug (URL)" name="slug" value={formData.slug ?? ""} onChange={handleChange} />
          <Input label="Järjestys" type="number" name="order" value={formData.order?.toString() ?? "99"} onChange={handleChange} />

          <Select
            label="Tila"
            name="status"
            value={formData.status ?? "planned"}
            onChange={handleChange}
            options={[
              { value: "active", label: "Aktiivinen" },
              { value: "completed", label: "Arkistoitu" },
              { value: "planned", label: "Tulossa" },
            ]}
          />
        </div>

        <Input label="Lyhyt Kuvaus" name="description" value={formData.description ?? ""} onChange={handleChange} />

        <TextArea
          label="Sisältö (Markdown)"
          name="content"
          variant="monospace"
          className="h-64"
          value={formData.content ?? ""}
          onChange={handleChange}
        />

        <TextArea
          label="Mekaaniset Lisäykset (Markdown)"
          name="mechanicalAdditions"
          variant="monospace"
          className="h-32"
          value={formData.mechanicalAdditions ?? ""}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Pelaajat" name="players" value={formData.players ?? ""} onChange={handleChange} />
          <Input label="Sessiot" name="sessionDates" value={formData.sessionDates ?? ""} onChange={handleChange} />
          <Input label="Sijainti" name="location" value={formData.location ?? ""} onChange={handleChange} />
          <Input label="Sijainti (Linkki)" name="locationLink" value={formData.locationLink ?? ""} onChange={handleChange} />
          <Input label="Kuva (URL)" name="image" value={formData.image ?? ""} onChange={handleChange} />
          <Input label="Kuva (Alt)" name="imageAlt" value={formData.imageAlt ?? ""} onChange={handleChange} />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>Peruuta</Button>
          <Button onClick={() => {
            const { id, gmId, createdAt, updatedAt, ...editableData } = formData as Episode;
            onSave(editableData);
          }}>Tallenna</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EpisodePlayersEditor({ episodeId }: { episodeId: number }) {
  const { data: allPlayers, isLoading: isPlayersLoading } = usePlayerUsers();
  const { data: enrolled, isLoading: isEnrolledLoading } = useEpisodePlayers(episodeId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollPlayer();
  const { mutate: disenroll, isPending: isDisenrolling } = useDisenrollPlayer();

  const isPending = isEnrolling || isDisenrolling;

  if (isPlayersLoading || isEnrolledLoading) return <LoadingState message="Ladataan pelaajia..." />;

  const enrolledUserIds = new Set((enrolled ?? []).map((e) => e.userId));
  const enrollmentByUserId = new Map((enrolled ?? []).map((e) => [e.userId, e]));

  return (
    <div className="space-y-2">
      <Heading>Pelaajat</Heading>
      {!allPlayers || allPlayers.length === 0 ? (
        <Text variant="muted">Ei pelaajatilejä rekisteröity.</Text>
      ) : (
        <div className="space-y-1">
          {allPlayers.map((player) => {
            const isEnrolled = enrolledUserIds.has(player.id);
            const enrollment = enrollmentByUserId.get(player.id);
            return (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 py-1.5 border-b border-[var(--theme-border-subtle)] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)] truncate">
                    {player.username}
                  </span>
                  <p className="text-[10px] text-[var(--theme-text)]/40 truncate">{player.email}</p>
                </div>
                <Button
                  size="compact"
                  variant={isEnrolled ? "danger" : "outline"}
                  disabled={isPending}
                  onClick={() => {
                    if (isEnrolled && enrollment) {
                      disenroll({ id: enrollment.id, episodeId });
                    } else {
                      enroll({ episodeId, userId: player.id });
                    }
                  }}
                >
                  {isEnrolled ? "Poista" : "Lisää"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EpisodeSkillsEditor({ episodeId }: { episodeId: number }) {
  const { data: skills, isLoading } = useEpisodeSkills(episodeId);
  const { mutate: addSkill } = useCreateEpisodeSkill();
  const { mutate: removeSkill } = useDeleteEpisodeSkill();
  const { mutate: updateSkill } = useUpdateEpisodeSkill();

  if (isLoading) return <LoadingState message="Ladataan taitoja..." />;

  return (
    <div className="space-y-3">
      <Heading>Jakson Taidot</Heading>
      <SkillTagList
        items={(skills ?? []).map((s) => ({ id: s.id, name: s.name }))}
        onItemEdit={(id, name) =>
          updateSkill({ episodeId, skillId: id as number, name })
        }
        onItemRemove={(id) =>
          removeSkill({ episodeId, skillId: id as number })
        }
        onItemAdd={(name) =>
          addSkill({ episodeId, name })
        }
      />
    </div>
  );
}

function GmToolsPanel({
  episode,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  episode: Episode;
  onEdit: () => void;
  onDelete: () => void;
  onCreateNew: () => void;
}) {
  return (
    <Drawer title="Pelinjohtajan Työkalut">
      <div className="space-y-3">
        <Heading>Toiminnot</Heading>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="compact" onClick={onEdit}>Muokkaa Jaksoa</Button><br/>
          <Button variant="danger" size="compact" onClick={onDelete}>Poista Jakso</Button><br/>
          <Button size="compact" onClick={onCreateNew}>Luo Uusi Jakso</Button>
        </div>
      </div>
      <div className="space-y-3">
        <EpisodeSkillsEditor episodeId={episode.id} />
      </div>
      <div className="space-y-3">
        <EpisodePlayersEditor episodeId={episode.id} />
      </div>
      <div className="space-y-3">
        <ReadingListEditor episodeId={episode.id} />
      </div>
    </Drawer>
  );
}

function EpisodeDetails({ id, onCreateNew, basePath }: { id: string; onCreateNew?: () => void; basePath: string }) {
  const { data: episodes, isLoading: isEpisodesLoading } = useEpisodes();
  const episode = episodes?.find((e) => e.slug === id);
  const { data: fullEpisode, isLoading: isEpisodeLoading } = useEpisode(episode?.id as number);
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode } = useUpdateEpisode();
  const { mutate: deleteEpisode } = useDeleteEpisode();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const articleRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);

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

  if (isEpisodesLoading || isEpisodeLoading) return <LoadingState message="Ladataan jaksoa..." />;
  if (!episode || !fullEpisode) return <div className="p-8 text-center">Jaksoa ei löytynyt.</div>;

  if (isEditing && isGm) {
    return (
      <EpisodeEditForm
        episode={fullEpisode}
        onCancel={() => setIsEditing(false)}
        onSave={(data) => {
          updateEpisode({ ...data, id: fullEpisode.id }, {
            onSuccess: () => setIsEditing(false)
          });
        }}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <HeadingLevelProvider>
        <Hero title={fullEpisode.title} description={fullEpisode.description || ""}>
          <div className="flex gap-2 mt-4">
            {fullEpisode.status === "active" && (
              <Badge variant="solid" icon="sparkles">
                Aktiivinen Jakso
              </Badge>
            )}
            {fullEpisode.status === "completed" && <Badge variant="outline">Arkistoitu</Badge>}
            {fullEpisode.status === "planned" && <Badge variant="outline">Tulossa</Badge>}
          </div>
        </Hero>

        {isGm && onCreateNew && (
          <GmToolsPanel
            episode={fullEpisode}
            onEdit={() => setIsEditing(true)}
            onDelete={() => {
              if (window.confirm("Oletko varma että haluat poistaa jakson?")) {
                deleteEpisode(fullEpisode.id, {
                  onSuccess: () => navigate("/")
                });
              }
            }}
            onCreateNew={onCreateNew}
          />
        )}

        <PageBody className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8">
          <Breadcrumb
            className="col-span-full mb-2"
            items={[
              { label: "Jaksot", to: basePath === "/" ? "/" : basePath },
              { label: fullEpisode.title },
            ]}
          />
          <div ref={articleRef} className="space-y-6">
            <HeadingLevelProvider>
              {fullEpisode.content && (
                <MarkdownRenderer headingIdPrefix={`episode-${fullEpisode.id}`}>
                  {fullEpisode.content}
                </MarkdownRenderer>
              )}
            </HeadingLevelProvider>
          </div>

          <div className="space-y-8 pt-6">
            {fullEpisode.image && (
              <ImageElement
                src={fullEpisode.image}
                sizes="(max-width: 1024px) 100vw, 24rem"
                alt={fullEpisode.imageAlt || fullEpisode.title}
                variant="outline"
              />
            )}

            <div className="space-y-4">
              <Card variant="outline" className="gap-2">
                <CardHeader>
                  <CardTitle>Tiedot</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeadingLevelProvider>
                    {fullEpisode.players && (
                      <>
                        <Heading>Pelaajat</Heading>
                        <p>{fullEpisode.players}</p>
                      </>
                    )}
                    {fullEpisode.sessionDates && (
                      <>
                        <Heading>Sessiot</Heading>
                        <List variant="unbulleted">
                          {fullEpisode.sessionDates.split(",").map((dateStr) => {
                            const date = new Date(dateStr.trim());
                            const formattedDate = Number.isNaN(date.getTime())
                              ? dateStr.trim()
                              : date.toLocaleDateString("fi-FI");
                            return <ListItem key={dateStr.trim()}>{formattedDate}</ListItem>;
                          })}
                        </List>
                      </>
                    )}
                    {fullEpisode.location && (
                      <>
                        <Heading>Sijainti</Heading>
                        <Link href={fullEpisode.locationLink || "#"}>
                          {fullEpisode.location}
                        </Link>
                      </>
                    )}
                  </HeadingLevelProvider>
                </CardContent>
              </Card>
            </div>

            {fullEpisode.mechanicalAdditions && (
              <div className="desktop:col-span-1 space-y-4">
                <Card iconName="zap">
                  <CardHeader>
                    <CardTitle>Mekaaniset Lisäykset</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 tablet:pt-0">
                    <MarkdownRenderer>{fullEpisode.mechanicalAdditions}</MarkdownRenderer>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </PageBody>
      </HeadingLevelProvider>
    </div>
  );
}

function NotFoundRedirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      requestToast({ message: "Sivua ei löydy. Uudelleenohjattu lähimpään vanhempaan.", variant: "warning", duration: 0 });
      navigate(to, { replace: true });
    }, 0);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function EpisodesIndex({ episodes, basePath }: { episodes: Episode[]; basePath: string }) {
  return (
    <>
      <HeadingLevelProvider>
        <Hero
          title="Jaksot"
          description="Kampanjan jaksot — aktiiviset, arkistoidut ja tulevat."
        />
      </HeadingLevelProvider>
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[{ label: "Jaksot" }]}
        />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <a
                key={episode.id}
                href={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
                className="no-underline text-inherit"
              >
                <Card variant="interactive" className="h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{episode.title}</CardTitle>
                      <span className="text-xs font-mono shrink-0 mt-0.5">
                        #{String(episode.order).padStart(2, "0")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {episode.description && (
                      <Text className="text-sm mb-2">{episode.description}</Text>
                    )}
                    <div className="flex gap-2">
                      {episode.status === "active" && (
                        <Badge variant="solid" icon="sparkles">Aktiivinen</Badge>
                      )}
                      {episode.status === "completed" && (
                        <Badge variant="outline">Arkistoitu</Badge>
                      )}
                      {episode.status === "planned" && (
                        <Badge variant="outline">Tulossa</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </HeadingLevelProvider>
      </PageBody>
    </>
  );
}

function EpisodeWrapper() {
  const { pathname } = useLocation();
  const { data: episodes, isLoading } = useEpisodes();
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: createEpisode } = useCreateEpisode();

  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <Page><LoadingState message="Ladataan jaksoja..." /></Page>;
  }

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (episodes?.some((p) => p.slug === segments[0])) return "/";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  const navEpisodes = (episodes ?? []).filter(
    (e) => e.status === "active" || e.status === "planned",
  );

  const activeEpisode =
    (episodes ?? []).find((e) => e.status === "active") ?? episodes?.[0];
  const latestPath = activeEpisode
    ? basePath === "/"
      ? `/${activeEpisode.slug}`
      : `${basePath}/${activeEpisode.slug}`
    : basePath === "/"
      ? "/"
      : basePath;

  const listingPath = basePath === "/" ? "/" : basePath;

  return (
    <Page>

      {isCreating && isGm ? (
        <EpisodeEditForm
          onCancel={() => setIsCreating(false)}
          onSave={(data) => {
            createEpisode(data, {
              onSuccess: () => setIsCreating(false)
            });
          }}
        />
      ) : (
        <>
          {episodes && episodes.length > 0 && (
            <TopNav>
              <TopNavList>
                <TopNavLink variant="parent" to={listingPath}>
                  Jaksot
                </TopNavLink>
                {navEpisodes.map((episode) => (
                  <TopNavLink
                    key={episode.id}
                    to={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
                  >
                    #{episode.order}: {episode.title}
                  </TopNavLink>
                ))}
              </TopNavList>

              <div>
                <Routes>
                  <Route path="/" element={<EpisodesIndex episodes={episodes} basePath={basePath} />} />
                  <Route path="latest" element={<Navigate to={latestPath} replace />} />
                  {episodes.map((episode) => (
                    <Route
                      key={episode.id}
                      path={episode.slug}
                      element={<EpisodeDetails id={episode.slug} onCreateNew={() => setIsCreating(true)} basePath={basePath} />}
                    />
                  ))}
                  <Route path="*" element={<NotFoundRedirect to={listingPath} />} />
                </Routes>
              </div>
            </TopNav>
          )}

          {episodes && episodes.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
              <Text variant="muted">Ei jaksoja löydetty.</Text>
              {isGm && (
                <Button onClick={() => setIsCreating(true)}>Luo ensimmäinen jakso</Button>
              )}
            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EpisodeWrapper />
    </QueryClientProvider>
  );
}
